import { promises as fs } from 'fs';
import path, { resolve } from 'path';
import cheerio from 'cheerio';
import axios from 'axios';

import {
  formatUrl, get, makeFileDirectoryUrl, makeImageUrl,
} from './utils';

const loader = async (url, directory) => {
  const cwd = process.cwd();
  const fileName = formatUrl(url);
  const filePath = path.join(directory, fileName);
  const fileDirectoryUrl = makeFileDirectoryUrl(filePath);

  const pageData = await get(url);
  const $ = cheerio.load(pageData, { decodeEntities: false });
  const imagesLinks = [];

  $('img').toArray().forEach((element) => {
    const { src } = element.attribs;
    if (src.startsWith('http')) {
      imagesLinks.push(src);
    }
    const newSrc = makeImageUrl(src, fileDirectoryUrl, url);
    element.attribs.src = newSrc;
  });
  const processedData = $.html();

  if (directory !== cwd) {
    try {
      fs.mkdir(directory);
    } catch (error) {
      console.log(error);
    }
  }

  if ($('img').toArray().length > 0) {
    fs.mkdir(fileDirectoryUrl);
    const requestImages = imagesLinks.map((url) => axios.get(url, { responseType: 'arraybuffer' }).then(({ data }) => data));
    const processedImagesUrls = imagesLinks.map((link) => makeImageUrl(link, fileDirectoryUrl, url));

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
