#!/usr/bin/env node
import { setTimeout } from 'node:timers/promises';
import { readFile, realpath } from 'node:fs/promises';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import log from 'npmlog';
import puppeteer from 'puppeteer';

import { getFileNameFromUrl, getOriginalUrlFromUrl } from './utils.mjs';

// const page = 'https://web.archive.org/web/20060621110703/http://www.faroejet.fo/';
const page = 'https://web.archive.org/web/20040130040316/http://fo.wikipedia.org/wiki.cgi';

const title = (await readFile('web_archive.txt')).toString('utf-8');
const screenshot = getFileNameFromUrl(page);

const __filename = fileURLToPath(import.meta.url);
const dir = path.dirname(await realpath(__filename));
const url = 'file://' + dir + '/index.html';

const page_url = getOriginalUrlFromUrl(page);

log.info('Rendering', `<${url}> ...`);
log.info('Page', {page_url, title, screenshot});

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();

  await page.setViewport({width: 1024, height: 768, deviceScaleFactor: 1});


  page.on('requestfinished', (req) => {
    log.info('Response', `<${req.url()}>`);
  });

  page.on('console', msg => log.info('log: ', msg.text()));

  const then = Date.now();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const took = Date.now() - then;

  // customize UI - set page title and URL
  await page.evaluate((title, page_url, screenshot) => {
    document.querySelector('#title').textContent = title;
    document.querySelector('address').textContent = page_url;
    document.querySelector('#screenshot').src = screenshot;
  }, title, page_url, screenshot);
  await setTimeout(250);

  log.info(`Page loaded`, `in ${took} ms`);

  await page.screenshot({path: 'retronet.png'});

  log.info(`Screenshot saved in retronet.png`);

  await browser.close();
  log.info('Done');
})();
