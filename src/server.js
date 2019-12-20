import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import * as awilix from 'awilix';
import { PuppeteerService } from './services/puppeteer-service.js';
import { PuppeteerController } from './controllers/puppeteer-controller.js';

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

container.register({
    puppeteerController: awilix.asClass(PuppeteerController),
    puppeteerService: awilix.asClass(PuppeteerService)
});

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
router
    .get('/scrape/text', async (req, res) => await container.cradle.puppeteerController.scrapeText(req, res))
    .get('/scrape/html', async (req, res) => await container.cradle.puppeteerController.scrapeHtml(req, res))
    .get('/scrape/link', async (req, res) => await container.cradle.puppeteerController.scrapeLink(req, res));
