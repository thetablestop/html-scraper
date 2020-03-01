export class PuppeteerController {
    constructor({ puppeteerService }) {
        this.service = puppeteerService;
    }

    async scrape(req, res) {
        try {
            if (!req.body.url) {
                res.status(400).send('The url field is rquired');
                return;
            }
            if (!req.body.selectors && !Array.isArray(req.body.selectors)) {
                res.status(400).send('The selectors field is rquired and must be an array of objects');
                return;
            }
            for (const s of req.body.selectors) {
                console.log(s);
                if (!s.name) {
                    res.status(400).send('Selectors require the field: name');
                    return;
                }
                if (!s.selector) {
                    res.status(400).send('Selectors require the field: selector');
                    return;
                }
            }

            const results = await this.service.eval(req.body.url, req.body.selectors, sels => {
                return sels.map(sel => {
                    sel.results = Array.from(document.querySelectorAll(sel.selector)).map(x => {
                        switch (sel.type) {
                            case 'link':
                                return {
                                    content: x.innerText.trim(),
                                    link: x.getAttribute('href')
                                };
                            case '':
                                return {
                                    content: x.innerHTML.trim()
                                };
                            default:
                                return {
                                    content: x.innerText.trim()
                                };
                        }
                    });
                    return sel;
                });
            });
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
                    link: x.getAttribute('href')
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
