import puppeteer from 'puppeteer';

export class PuppeteerService {
    async eval(url, selector, evalFunc) {
        let error = '';
        if (!url) {
            error += ` url is required;`;
        }
        if (!selector) {
            error += ` selector is required;`;
        }
        if (!evalFunc) {
            throw `evalFunc is required`;
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: process.env.HEADLESS
        });
        if (!browser) {
            error = `Unable to launch chromium browser`;
        }

        if (browser && url && evalFunc) {
            const page = await browser.newPage();
            await page.goto(url);
            if (Array.isArray(selector)) {
                for (const sel of selector) {
                    await page.waitForSelector(sel.selector);
                }
            } else {
                await page.waitForSelector(selector);
            }

            const result = await page.evaluate(evalFunc, selector);
            await browser.close();
            return result;
        }

        return {
            error: error
        };
    }
}
