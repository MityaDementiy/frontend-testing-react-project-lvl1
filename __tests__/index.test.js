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
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const expectedImage = 'ru-hexlet-io-assets-professions-nodejs.png';
    const imagePath = getFixturePath(expectedImage);
    const imageData = await fs.readFile(imagePath, 'utf-8');

    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;
    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);
    nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png')
      .reply(200, imageData);

    await loader('https://ru.hexlet.io/courses', tempDir);

    const assetsDirContent = await fs.readdir(assetsDir);
    const downloadedImage = await fs.readFile(path.join(assetsDir, expectedImage), 'utf-8');

    expect(assetsDirContent.length).not.toBe(0);
    expect(downloadedImage).toBe(imageData);
  });
});
