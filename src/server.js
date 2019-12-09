import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

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

const port = process.env.NODE_PORT || 3000;
httpServer.listen(port);
console.log(`Listening on http://localhost:${port}`);

// Setup routes
router.get('/scrape', async (req, res) => {
    let browser;
    let result;
    let error = '';
    try {
        if (!req.query.url) {
            error += ` url is required;`;
        }
        if (!req.query.selector) {
            error += ` selector is required;`;
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
                } catch (err) {
                    return {
                        error: err
                    };
                }
            }, req.query);
            await browser.close();
        }

        if (result && result.error) {
            res.status(400).send(result);
        } else if (error) {
            res.status(400).send({
                error: error
            });
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
