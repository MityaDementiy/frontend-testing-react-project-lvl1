import axios from 'axios';
import cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';

export const formatUrl = (url) => {
  const urlObj = new URL(url);
  const { hostname, pathname } = urlObj;
  const stringifyedUrl = `${hostname}${pathname}`;
  const separators = new RegExp('\\W');
  const splitted = stringifyedUrl.split(separators);
  const joined = splitted.join('-');
  const formatted = `${joined}.html`;

  return formatted;
};

export const get = (url) => axios.get(url)
  .then((response) => response.data)
  .then((data) => data)
  .catch((err) => console.log(err.message));

export const makeFileDirectoryUrl = (fileName) => {
  const splittedUrl = fileName.split('.');
  const fileDirectoryUrl = `${splittedUrl[0]}_files`;

  return fileDirectoryUrl;
};

export const makeImageUrl = (imageUrl, directoryPath, requestUrl) => {
  if (!imageUrl) {
    return;
  }

  if (imageUrl.startsWith('http')) {
    const urlObj = new URL(imageUrl);
    const { hostname, pathname } = urlObj;
    const stringifyedUrl = `${hostname}${pathname}`;
    const separators = new RegExp('\\W');
    const splitted = stringifyedUrl.split(separators);
    const fileExt = splitted.pop();
    const joined = splitted.join('-');
    const result = `${directoryPath}/${joined}.${fileExt}`;
    return result;
  }
  const requestUrlObj = new URL(requestUrl);
  const { origin } = requestUrlObj;
  const absoluteImageUrl = path.join(origin, imageUrl);
  const urlObj = new URL(absoluteImageUrl);
  const { hostname, pathname } = urlObj;
  const stringifyedUrl = `${hostname}${pathname}`;
  const separators = new RegExp('\\W');
  const splitted = stringifyedUrl.split(separators);
  const fileExt = splitted.pop();
  const joined = splitted.join('-');
  const result = `${directoryPath}/${joined}.${fileExt}`;
  return result;
};
