import fs from 'fs';
import chalk from 'chalk';
import express from 'express';
import cors from 'cors';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import merge from 'deepmerge';
import moment from 'moment';
import puppeteer from 'puppeteer';

const app = express();
const router = express.Router();
const env = process.env.NODE_ENV || 'Development';
const generalSettings = require('./appsettings.json');
const envSettings = require(`./appsettings.${env}.json`);
const settings = merge(generalSettings, envSettings);

let server;
let protocol;
if (settings.ssl.enabled) {
    protocol = 'https';
    server = https.createServer(
        {
            key: fs.readFileSync(settings.ssl.key),
            cert: fs.readFileSync(settings.ssl.cert)
        },
        app
    );
} else {
    protocol = 'http';
    server = http.createServer(app);
}

app.use(bodyParser.urlencoded({ extended: true }))
    .use(
        cors({
            origin: settings.allowedOrigin
        })
    )
    .use(bodyParser.json())
    .use('/api', router)
    .get('/', (req, res) => {
        const pkg = require('../package.json');
        res.send(`<h1>${pkg.name}</h1>
        <h2>Version: ${pkg.version}</h2>`);
    });

server.listen(process.env.PORT || settings.port);
console.log(`Listening on ${protocol}://localhost:${settings.port}`);

// Setup routes
router
    .get('/scrape', async (req, res) => {
        let browser;
        let result;
        let error = '';
        try {
            if (!req.query.url) {
                error += ` url is required;`
            }
            if (!req.query.selector) {
                error += ` selector is required;`
            }

            browser = await puppeteer.launch({
                args: ['--no-sandbox'],
                headless: settings.headless
            });
            if (!browser) {
                error = `Unable to launch chromium browser`;
            }

            if (browser && req.query.url && req.query.selector) {
                const page = await browser.newPage();
                await page.goto(req.query.url);
                await page.waitForSelector(req.query.selector);

                result = await page.evaluate(q => {
                    try {
                        const elem = document.querySelector(q.selector);
                        return {
                            content: elem.innerText.trim()
                        };
                    }
                    catch (err) {
                        return {
                            error: err
                        };
                    }
                }, req.query);
                await browser.close();
            }

            if (result && result.error) {
                res.status(400).send(result);
            }
            else if (error) {
                res.status(400).send({
                    error: error
                });
            }
            else {
                res.send(result);
            }
        } catch (err) {
            console.log(chalk.red(`${moment().format()}: ${err}`));
            if (browser) {
                await browser.close();
            }
            res.sendStatus(500);
        }
    });

