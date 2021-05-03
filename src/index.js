import axios from 'axios';
import { promises as fs } from 'fs';

import formatUrl from './utils';

const loader = async (url) => {
  const filePath = formatUrl(url);

  const pageData = await axios.get(url)
    .then((response) => response.data)
    .then((data) => data)
    .catch((err) => err.message);

  try {
    fs.writeFile(filePath, pageData);
  } catch (error) {
    console.log(error);
  }

  return filePath;
};

export default loader;
