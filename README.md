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
const url = encodeURIComponent('https://boardgamegeek.com/boardgame/264220/tainted-grail-fall-avalon');
const selector = encodeURIComponent('div.game-header-title-info h1 a');
const result = await axios.get(`http://localhost:3002/api/scrape/text?url=${url}&selector=${selector}`);

/* HTML */
const url = encodeURIComponent('https://boardgamegeek.com/boardgame/264220/tainted-grail-fall-avalon');
const selector = encodeURIComponent('article.game-description-body p');
const result = await axios.get(`http://localhost:3002/api/scrape/html?url=${url}&selector=${selector}`);

/* Link */
const url = encodeURIComponent('https://boardgamegeek.com/browse/boardgame');
const selector = encodeURIComponent('#collectionitems td:nth-child(3) a');
const result = await axios.get(`http://localhost:3002/api/scrape/link?url=${url}&selector=${selector}`);
```
