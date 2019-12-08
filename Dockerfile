# Based on https://github.com/ebidel/try-puppeteer/blob/master/backend/Dockerfile

FROM node:8-slim

# Install dependencies

## See https://crbug.com/795759
RUN apt-get update && apt-get -yq upgrade && apt-get install \
    && apt-get autoremove && apt-get autoclean

## Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
## Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
## installs, work.
## https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-unstable
RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont ssl-cert \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

# Install global NPM dependencies
RUN npm install -g yarn

# Copy built code
COPY package*.json ./
COPY node_modules/. node_modules/
COPY src/. src/

## Install puppeteer so it can be required by user code that gets run in
## server.js. Cache bust so we always get the latest version of puppeteer when
## building the image.
ARG CACHEBUST=1
RUN yarn add puppeteer

# Copy certs
COPY certs/thetablestop.* /etc/ssl/
RUN chown root:ssl-cert /etc/ssl/*
RUN chmod 644 /etc/ssl/*

# Add pptr user.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video,ssl-cert pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app \
    && chown -R appusr:appusr /mnt/nodeshared

# Run app as non privileged.
USER pptruser

CMD ["yarn", "serve"]
