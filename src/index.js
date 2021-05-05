import { promises as fs } from 'fs';
import path from 'path';
import cheerio from 'cheerio';

import { formatUrl, get, makeFileDirectoryUrl } from './utils';

const loader = async (url, directory) => {
  const cwd = process.cwd();
  const fileName = formatUrl(url);
  const filePath = path.join(directory, fileName);
  const fileDirectoryUrl = makeFileDirectoryUrl(filePath);

  const pageData = await get(url);
  const $ = cheerio.load(pageData, { decodeEntities: false });

  if (directory !== cwd) {
    try {
      fs.mkdir(directory);
    } catch (error) {
      console.log(error);
    }
  }

  try {
    fs.writeFile(filePath, pageData);
  } catch (error) {
    console.log(error);
  }

  return filePath;
};

export default loader;
