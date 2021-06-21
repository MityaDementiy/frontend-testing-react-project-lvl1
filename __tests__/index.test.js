import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import path from 'path';
import cheerio from 'cheerio';

import loader from '../src/index';
import { urlToFilename, urlToDirname } from '../src/utils';

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

let tempDir = '';

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

const getFixturePath = (name) => path.join('__fixtures__', name);

describe('test utils', () => {
  test('urlToFilename should process urls', () => {
    const firstUrl = 'https://ru.hexlet.io/programs/frontend-testing-react';
    const firstExpectedUrl = 'https-ru-hexlet-io-programs-frontend-testing-react.html';
    const secondUrl = 'http://www.ru.hexlet.io/programs/frontend-testing-react';
    const secondExpectedUrl = 'http-www-ru-hexlet-io-programs-frontend-testing-react.html';

    const firstProcessedUrl = urlToFilename(firstUrl);
    const secondProcessedUrl = urlToFilename(secondUrl);

    expect(firstUrl).not.toEqual(firstProcessedUrl);
    expect(firstProcessedUrl).toEqual(firstExpectedUrl);
    expect(secondProcessedUrl).toEqual(secondExpectedUrl);
  });

  test('urlToDirname should process urls', () => {
    const firstUrl = 'https://ru.hexlet.io/programs/frontend-testing-react';
    const firstExpectedUrl = 'https-ru-hexlet-io-programs-frontend-testing-react_files';
    const secondUrl = 'http://www.ru.hexlet.io/programs/frontend-testing-react';
    const secondExpectedUrl = 'http-www-ru-hexlet-io-programs-frontend-testing-react_files';

    const firstProcessedUrl = urlToDirname(firstUrl);
    const secondProcessedUrl = urlToDirname(secondUrl);

    expect(firstUrl).not.toEqual(firstProcessedUrl);
    expect(firstProcessedUrl).toEqual(firstExpectedUrl);
    expect(secondProcessedUrl).toEqual(secondExpectedUrl);
  });
});

describe('test pageloader', () => {
  it('should write file correctly', async () => {
    const expectedData = await fs.readFile(getFixturePath('ru-hexlet-io-courses-expected.html'), 'utf-8');
    const formattedExpecteData = cheerio.load(expectedData, { decodeEntities: false });
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);
    const result = await loader('https://ru.hexlet.io/courses', tempDir);
    const { filepath: processedFilepath } = result;
    const processedData = await fs.readFile(processedFilepath, 'utf-8');

    expect(rawData).not.toEqual(processedData);
    expect(processedData).toEqual(formattedExpecteData.html());
  });

  it('should download images', async () => {
    const expectedData = await fs.readFile(getFixturePath('ru-hexlet-io-courses-expected.html'), 'utf-8');
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const image = 'ru-hexlet-io-assets-professions-nodejs.png';

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);
    const result = await loader('https://ru.hexlet.io/courses', tempDir);
    const { filepath: processedFilepath } = result;
    console.log("🚀 ~ file: index.test.js ~ line 80 ~ it ~ processedFilepath", processedFilepath)

    const directoryPath = path.dirname(processedFilepath);
    const dir = await fs.readdir(`${directoryPath}/ru-hexlet-io-courses_files`); // эта директория пустая
    console.log("🚀 ~ file: index.test.js ~ line 84 ~ it ~ dir", dir)
    const fileName = path.basename(processedFilepath, '.html');
    const assetsDirectory = `${fileName}_files`;
    const imagePath = path.join(directoryPath, assetsDirectory, image);
    console.log("🚀 ~ file: index.test.js ~ line 86 ~ it ~ imagePath", imagePath)
    const expectedImageData = await fs.readFile(getFixturePath('nodejs.png'));
    const imageData = await fs.readFile(imagePath);
    console.log("🚀 ~ file: index.test.js ~ line 87 ~ it ~ imageData", imageData);
  });
});
