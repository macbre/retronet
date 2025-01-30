#!/usr/bin/env node
import { setTimeout } from 'node:timers/promises';
import { writeFile } from 'node:fs/promises';

import log from 'npmlog';
import puppeteer from 'puppeteer';

import { getFileNameFromUrl } from './utils.mjs';

const url = 'https://web.archive.org/web/20060621110703/http://www.faroejet.fo/';
const path = getFileNameFromUrl(url);

log.info('Rendering', `<${url}> ...`);
log.info('Screenshot file', path);

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();

  // 1032 x 620
  await page.setViewport({width: 1004, height: 602, deviceScaleFactor: 1});

  page.on('requestfinished', (req) => {
    log.info('Response', `<${req.url()}>`);
  });

  page.on('console', msg => log.info('log: ', msg.text()));

  const then = Date.now();
  await page.goto(url, {waitUntil: 'networkidle0'});
  const took = Date.now() - then;

  log.info(`Page loaded`, `in ${took} ms`);

  // close the Web Archive nav bar and get the page title
  const title = await page.evaluate(() => {
    document.querySelector('#wm-ipp-base').style.display = 'none';
    return document.title;
  });
  await setTimeout(250);
  await writeFile('web_archive.txt', title);

  log.info(`Taking the screenshot of the page titled "${title}"...`);

  // wait a bit for the page to load, do some animations, etc.
  await setTimeout(3000);

  await page.screenshot({path});

  log.info(`Screenshot saved in ${path}`);

  await browser.close();
  log.info('Done');
})();
