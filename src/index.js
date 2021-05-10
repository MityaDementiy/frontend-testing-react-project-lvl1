import { promises as fs } from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import axios from 'axios';
import debug from 'debug';

import {
  formatUrl, get, makeFileDirectoryUrl, makeAssetUrl, hasAssets,
} from './utils';

const log = debug('page-loader');

const loader = async (url, directory) => {
  const cwd = process.cwd();
  const fileName = formatUrl(url);
  const filePath = path.join(directory, fileName);
  const fileDirectoryUrl = makeFileDirectoryUrl(filePath);
  const urlObj = new URL(url);
  const { hostname, origin } = urlObj;
  log('file path, file directory url:', filePath, fileDirectoryUrl);

  const pageData = await get(url);
  const $ = cheerio.load(pageData, { decodeEntities: false });
  const imagesLinks = [];

  $('img').toArray().forEach((element) => {
    const { src } = element.attribs;
    if (!src) {
      return;
    }
    if (src.startsWith('http')) {
      const srcObj = new URL(src);
      const { hostname: srcHostName } = srcObj;
      if (srcHostName === hostname) {
        imagesLinks.push(src);
        const newSrc = makeAssetUrl(src, fileDirectoryUrl, url);
        element.attribs.src = newSrc;
      }
    }
    if (!src.startsWith('http') && src.startsWith('/')) {
      const newSrc = makeAssetUrl(src, fileDirectoryUrl, url);
      element.attribs.src = newSrc;
      const absolutePath = path.join(origin, src);
      imagesLinks.push(absolutePath);
    }
  });

  $('link').toArray().forEach((element) => {
    const { href } = element.attribs;
    if (!href) {
      return;
    }
    if (href.startsWith('http')) {
      const hrefObj = new URL(href);
      const { hostname: hrefHostName } = hrefObj;
      if (hrefHostName === hostname) {
        const newHref = makeAssetUrl(href, fileDirectoryUrl, url);
        element.attribs.href = newHref;
      }
    }
    if (!href.startsWith('http')) {
      const newHref = makeAssetUrl(href, fileDirectoryUrl, url);
      element.attribs.href = newHref;
    }
  });

  log('images urls:', imagesLinks);

  $('script').toArray().forEach((element) => {
    const { src } = element.attribs;
    if (!src) {
      return;
    }
    if (src.startsWith('http')) {
      const srcObj = new URL(src);
      const { hostname: srcHostName } = srcObj;
      if (srcHostName === hostname) {
        const newSrc = makeAssetUrl(src, fileDirectoryUrl, url);
        element.attribs.src = newSrc;
      }
    }
    if (!src.startsWith('http')) {
      const newSrc = makeAssetUrl(src, fileDirectoryUrl, url);
      element.attribs.src = newSrc;
    }
  });

  const processedData = $.html();

  if (directory !== cwd) {
    try {
      fs.mkdir(directory);
    } catch (error) {
      console.log(error);
    }
  }

  if (hasAssets(imagesLinks)) {
    fs.mkdir(fileDirectoryUrl);
    const requestImages = imagesLinks.map((url) => axios.get(url, { responseType: 'arraybuffer' }).then(({ data }) => data));
    const processedImagesUrls = imagesLinks.map((link) => makeAssetUrl(link, fileDirectoryUrl, url));

    Promise.all(requestImages)
      .then((responses) => {
        responses.forEach((response, index) => {
          fs.writeFile(processedImagesUrls[index], response);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  try {
    fs.writeFile(filePath, processedData);
  } catch (error) {
    console.log(error);
  }

  return filePath;
};

export default loader;
