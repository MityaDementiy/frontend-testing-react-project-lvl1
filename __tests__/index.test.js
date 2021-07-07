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

const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);

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

  it('should download assets', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const expectedImage = 'ru-hexlet-io-assets-professions-nodejs.png';
    const imagePath = getFixturePath(expectedImage);
    const imageData = await fs.readFile(imagePath, 'utf-8');
    const expectedCss = 'ru-hexlet-io-assets-application.css';
    const expectedCssPath = getFixturePath(expectedCss);
    const cssData = await fs.readFile(expectedCssPath, 'utf-8');
    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;
    const expectedScript = 'ru-hexlet-io-packs-js-runtime.js';
    const expectedScriptPath = getFixturePath(expectedScript);
    const scriptData = await fs.readFile(expectedScriptPath, 'utf-8');

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);
    nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png')
      .reply(200, imageData);
    nock('https://ru.hexlet.io').get('/assets/application.css').reply(200, cssData);
    nock('https://ru.hexlet.io').get('/packs/js/runtime.js').reply(200, scriptData);

    await loader('https://ru.hexlet.io/courses', tempDir);

    const assetsDirContent = await fs.readdir(assetsDir);
    const downloadedImage = await fs.readFile(path.join(assetsDir, expectedImage), 'utf-8');
    const downloadedCss = await fs.readFile(path.join(assetsDir, expectedCss), 'utf-8');
    const downloadedScript = await fs.readFile(path.join(assetsDir, expectedScript), 'utf-8');

    expect(assetsDirContent.length).not.toBe(0);
    expect(downloadedImage).toBe(imageData);
    expect(downloadedCss).toBe(cssData);
    expect(downloadedScript).toBe(scriptData);
  });

  it('should throw when reply is 404', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(404);
    expect(loader('https://ru.hexlet.io/courses', tempDir)).rejects.toThrow();
  });

  it('should throw when reply is 503', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(503);
    expect(loader('https://ru.hexlet.io/courses', tempDir)).rejects.toThrow();
  });

  it('should throw when can not download resource', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const expectedImage = 'ru-hexlet-io-assets-professions-nodejs.png';

    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);
    nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png')
      .reply(500);

    await loader('https://ru.hexlet.io/courses', tempDir);

    await expect(fs.readFile(path.join(assetsDir, expectedImage), 'utf-8')).rejects.toThrow();
  });

  it('should throw if permisson denied or incorrect path', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const sysDirPath = '/sys';
    const errorMessage = new RegExp('[A-Za-z]');

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);

    await expect(loader('https://ru.hexlet.io/courses', sysDirPath)).rejects.toThrow(errorMessage);
  });

  it('should throw if invalid path', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const incorrectDirPath = 'asdf';
    const errorMessage = new RegExp('[A-Za-z]');

    nock('https://ru.hexlet.io').get('/courses').reply(200, rawData);

    await expect(loader('https://ru.hexlet.io/courses', incorrectDirPath)).rejects.toThrow(errorMessage);
  });
});
