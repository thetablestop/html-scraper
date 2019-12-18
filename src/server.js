import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import moment from 'moment';
import { PuppeteerService } from './puppeteer-service.js';

const app = express();
const router = express.Router();
const httpServer = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }))
    .use(
        cors({
            origin: process.env.ORIGINS || '*'
        })
    )
    .use(bodyParser.json())
    .use('/api', router)
    .get('/', (req, res) => {
        const pkg = require('../package.json');
        res.send(`<h1>${pkg.name}</h1>
        <h2>Version: ${pkg.version}</h2>`);
    });

const port = process.env.NODE_PORT || 3002;
httpServer.listen(port);
console.log(`Listening on http://localhost:${port}`);

// Setup routes
router.get('/scrape', async (req, res) => {
    try {
        const pupSvc = new PuppeteerService();
        const result = await pupSvc.eval(req.url, req.selector, (document, selector) => ({
            content: document.querySelector(selector).innerText.trim()
        }));

        if (result.error) {
            res.status(400).send(result);
        } else {
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
