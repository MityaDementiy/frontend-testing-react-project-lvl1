import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

import formatUrl from './utils';

const loader = async (url, directory) => {
  const cwd = process.cwd();
  const fileName = formatUrl(url);
  const filePath = path.join(directory, fileName);

  const pageData = await axios.get(url)
    .then((response) => response.data)
    .then((data) => data)
    .catch((err) => console.log(err.message));

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
