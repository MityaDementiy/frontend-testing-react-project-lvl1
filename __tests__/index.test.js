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
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');

    const scope = nock('https://ru.hexlet.io').get('/courses').reply(200, expectedData);
    const result = await loader('https://ru.hexlet.io/courses', tempDir);
    const { filepath: processedFilepath } = result;
    const processedData = await fs.readFile(processedFilepath, 'utf-8');
    console.log("🚀 ~ file: index.test.js ~ line 66 ~ it ~ processedData", processedData)

    expect(rawData).not.toEqual(processedData);
    expect(processedData).toEqual(expectedData);
  })
});

