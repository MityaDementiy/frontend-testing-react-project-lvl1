import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import path from 'path';

import loader from '../src/index';

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
const assets = [{
  requestUrl: '/assets/professions/nodejs.png',
  path: 'ru-hexlet-io-assets-professions-nodejs.png',
  expected: '/expected/nodejs.png',
}, {
  requestUrl: '/assets/application.css',
  path: 'ru-hexlet-io-assets-application.css',
  expected: '/expected/style.css',
}, {
  requestUrl: '/packs/js/runtime.js',
  path: 'ru-hexlet-io-packs-js-runtime.js',
  expected: '/expected/main.js',
}];

const siteUrl = 'https://ru.hexlet.io';
const pagePath = '/courses';
const requestUrl = 'https://ru.hexlet.io/courses';

describe('test pageloader', () => {
  it('should download assets', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    nock(siteUrl).get(pagePath).reply(200, rawData);
    assets.forEach(async (asset) => nock(siteUrl)
      .get(asset.requestUrl)
      .reply(200, await fs.readFile(getFixturePath(asset.path))));

    await loader(requestUrl, tempDir);
    assets.forEach(async (asset) => {
      const expectedData = await fs.readFile(getFixturePath(asset.expected), 'utf-8');
      const downloadedData = await fs.readFile(path.join(assetsDir, asset.path), 'utf-8');
      expect(expectedData).toEqual(downloadedData);
    });
  });

  it('should write file correctly', async () => {
    const expectedData = await fs.readFile(getFixturePath('expected/main.html'), 'utf-8');
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');

    nock(siteUrl).get(pagePath).reply(200, rawData);
    const result = await loader(requestUrl, tempDir);
    const { filepath: processedFilepath } = result;
    const processedData = await fs.readFile(processedFilepath, 'utf-8');

    expect(rawData).not.toEqual(processedData);
    expect(processedData).toEqual(expectedData);
  });

  it('should throw when reply is 404', async () => {
    nock(siteUrl).get(pagePath).reply(404);
    expect(loader(requestUrl, tempDir)).rejects.toThrow();
  });

  it('should throw when reply is 503', async () => {
    nock(siteUrl).get(pagePath).reply(503);
    expect(loader(requestUrl, tempDir)).rejects.toThrow();
  });

  it('should throw when can not download resource', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
    const expectedImage = 'ru-hexlet-io-assets-professions-nodejs.png';

    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    nock(siteUrl).get(pagePath).reply(200, rawData);
    nock(siteUrl).get('/assets/professions/nodejs.png')
      .reply(500);

    await loader(requestUrl, tempDir);

    await expect(fs.readFile(path.join(assetsDir, expectedImage), 'utf-8')).rejects.toThrow();
  });

  it('should throw if permisson denied or incorrect path', async () => {
    const sysDirPath = '/sys';
    const incorrectDirPath = 'asdf';
    nock(siteUrl).get(pagePath).reply(200);

    await expect(loader(requestUrl, sysDirPath)).rejects.toThrow(/EACCES || EROFS/);
    await expect(loader(requestUrl, sysDirPath)).rejects.toThrow();
    await expect(loader(requestUrl, incorrectDirPath)).rejects.toThrow();
  });

  it('should throw when not directory', async () => {
    const rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');

    nock(siteUrl).get(pagePath).reply(200, rawData);

    await expect(loader(requestUrl, getFixturePath('ru-hexlet-io-courses.html'))).rejects.toThrow(/ENOTDIR/);
  });
});
