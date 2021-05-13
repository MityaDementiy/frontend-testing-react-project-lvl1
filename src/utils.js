import axios from 'axios';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';
import debug from 'debug';
import 'axios-debug-log';

const log = debug('page-loader');

export const formatUrl = (url) => {
  const urlObj = new URL(url);
  const { hostname, pathname } = urlObj;
  const stringifyedUrl = `${hostname}${pathname}`;
  const separators = new RegExp('\\W');
  const splitted = stringifyedUrl.split(separators);
  const joined = splitted.join('-');
  const formatted = `${joined}.html`;
  log('Formatted url:', formatted);

  return formatted;
};

export const get = (url) => axios.get(url)
  .then((response) => response.data)
  .then((data) => data)
  .catch((debug, err) => debug('Error:', err.message));

export const makeFileDirectoryUrl = (fileName) => {
  const splittedUrl = fileName.split('.');
  const fileDirectoryUrl = `${splittedUrl[0]}_files`;

  return fileDirectoryUrl;
};

export const makeAssetUrl = (assetUrl, directoryPath, requestUrl) => {
  if (!assetUrl) {
    return;
  }

  if (assetUrl.startsWith('http')) {
    const urlObj = new URL(assetUrl);
    const { hostname, pathname } = urlObj;
    const stringifyedUrl = `${hostname}${pathname}`;
    const separators = new RegExp('\\W');
    const splitted = stringifyedUrl.split(separators);
    const fileExt = splitted.pop();
    const joined = splitted.join('-');
    const result = `${directoryPath}/${joined}.${fileExt}`;
    log('Asset URL:', result);
  
    return result;
  }
  const requestUrlObj = new URL(requestUrl);
  const { origin } = requestUrlObj;
  const absoluteImageUrl = `${origin}/${assetUrl}`;
  const urlObj = new URL(absoluteImageUrl);
  const { hostname, pathname } = urlObj;
  const stringifyedUrl = `${hostname}${pathname}`;
  const separators = new RegExp('\\W');
  const splitted = stringifyedUrl.split(separators);
  const fileExt = splitted.pop();
  const joined = splitted.join('-');
  const result = `${directoryPath}/${joined}.${fileExt}`;
  log('Asset URL:', result);

  return result;
};

export const hasAssets = (images) => images.length > 0;
