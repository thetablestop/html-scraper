import puppeteer from 'puppeteer';

export class PuppeteerService {
    async eval(url, selector, parseFunc) {
        let error = '';
        if (!url) {
            error += ` url is required;`;
        }
        if (!selector) {
            error += ` selector is required;`;
        }
        if (!parseFunc) {
            throw `parseFunc is required`;
        }

        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
            headless: process.env.HEADLESS
        });
        if (!browser) {
            error = `Unable to launch chromium browser`;
        }

        if (browser && url && parseFunc) {
            const page = await browser.newPage();
            await page.goto(url);
            await page.waitForSelector(selector);

            const result = await page.evaluate(sel => {
                try {
                    return parseFunc(document, sel);
                } catch (err) {
                    return {
                        error: err
                    };
                }
            }, selector);
            await browser.close();
            return result;
        }

        return {
            error: error
        };
    }
}
