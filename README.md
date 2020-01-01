# HTML Scraper

[![Build Status](https://travis-ci.org/thetablestop/html-scraper.svg?branch=master)](https://travis-ci.org/thetablestop/html-scraper)

Provides basic API endpoints for reading pieces of text from rendered HTML on an SPA by URL and selector.

## Install

```
git clone git@github.com:thetablestop/html-scraper.git
cd html-scraper
yarn
```

## Run

```
yarn start
```

## Usage

```js
const axios = require('axios').default;

/* Text */
const url1 = encodeURIComponent('https://boardgamegeek.com/boardgame/264220/tainted-grail-fall-avalon');
const selector1 = encodeURIComponent('div.game-header-title-info h1 a');
const result1 = await axios.get(`http://localhost:3002/api/scrape/text?url=${url1}&selector=${selector1}`);
/* Result: Array of all elements matching selector
    [
        { content: 'Inner text (without HTML) of element' }
    ]
*/

/* HTML */
const url2 = encodeURIComponent('https://boardgamegeek.com/boardgame/264220/tainted-grail-fall-avalon');
const selector2 = encodeURIComponent('article.game-description-body p');
const result2 = await axios.get(`http://localhost:3002/api/scrape/html?url=${url2}&selector=${selector2}`);
/* Result: Array of all elements matching selector
    [
        { content: 'Inner HTML of element' }
    ]
*/

/* Link */
const url3 = encodeURIComponent('https://boardgamegeek.com/browse/boardgame');
const selector3 = encodeURIComponent('#collectionitems td:nth-child(3) a');
const result3 = await axios.get(`http://localhost:3002/api/scrape/link?url=${url3}&selector=${selector3}`);
/* Result: Array of all elements matching selector
    [
        {
            content: 'Inner text (without HTML) of element',
            link: 'The URL that the link is pointing to for this anchor element'
        }
    ]
*/
```
