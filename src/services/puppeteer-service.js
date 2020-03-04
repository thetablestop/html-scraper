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
            try {
                await page.goto(url);
            } catch (err) {
                return {
                    error: `Unable to navigate to ${url}: ${err}`
                };
            }

            if (Array.isArray(selector)) {
                const selectors = [];
                for (const sel of selector) {
                    try {
                        await page.waitForSelector(sel.selector, { timeout: 5000 });
                        selectors.push(sel);
                    } catch (err) {
                        // do not add selector that is not available
                    }
                }
                selector = selectors;
            } else {
                try {
                    await page.waitForSelector(selector);
                } catch (err) {
                    selector = null;
                }
            }

            if (selector) {
                const result = await page.evaluate(evalFunc, selector);
                await browser.close();
                return result;
            } else {
                error = 'selector not available';
            }
        }

        return {
            error: error
        };
    }
}
