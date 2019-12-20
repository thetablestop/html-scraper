export class PuppeteerController {
    constructor({ puppeteerService }) {
        this.service = puppeteerService;
    }

    async scrapeText(req, res) {
        try {
            const results = await this.service.eval(req.query.url, req.query.selector, sel =>
                Array.from(document.querySelectorAll(sel)).map(x => ({
                    content: x.innerText.trim()
                }))
            );
            if (results.error) {
                res.status(400).send(results);
            } else {
                res.send(results);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async scrapeHtml(req, res) {
        try {
            const results = await this.service.eval(req.query.url, req.query.selector, sel =>
                Array.from(document.querySelectorAll(sel)).map(x => ({
                    content: x.innerHTML.trim()
                }))
            );
            if (results.error) {
                res.status(400).send(results);
            } else {
                res.send(results);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }

    async scrapeLink(req, res) {
        try {
            const results = await this.service.eval(req.query.url, req.query.selector, sel =>
                Array.from(document.querySelectorAll(sel)).map(x => ({
                    content: x.innerText.trim(),
                    anchor: x.getAttribute('href')
                }))
            );
            if (results.error) {
                res.status(400).send(results);
            } else {
                res.send(results);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
}
