# HTML Scraper

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

```
const axios = require('axios').default;
const url = 'https://www.google.com';
const selector = '#hptl > a:nth-child(1)';
const result = await axios.get(`http://localhost:3000/api/scrape?url=${url}&selector=${selector}`;
console.log(result); //'About'
```

## Publish

TBD
