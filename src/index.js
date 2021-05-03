import { promises as fs } from 'fs';
import path from 'path';

import { formatUrl, get } from './utils';

const loader = async (url, directory) => {
  const cwd = process.cwd();
  const fileName = formatUrl(url);
  const filePath = path.join(directory, fileName);

  const pageData = await get(url);

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
