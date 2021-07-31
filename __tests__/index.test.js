import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import path from 'path';

import loader from '../src/index';

const getFixturePath = (name) => path.join(__dirname, '..', '__fixtures__', name);
const siteUrl = 'https://ru.hexlet.io';
const pagePath = '/courses';
const requestUrl = 'https://ru.hexlet.io/courses';
const scope = nock(siteUrl).persist();

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

let tempDir = '';
let rawData;

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

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  rawData = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  assets.forEach(async (asset) => scope
    .get(asset.requestUrl)
    .reply(200, await fs.readFile(getFixturePath(asset.path))));
});

afterEach(() => {
  nock.cleanAll();
});

describe('test pageloader — positive cases', () => {
  it('should download assets', async () => {
    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    scope.get(pagePath).reply(200, rawData);

    await loader(requestUrl, tempDir);
    assets.forEach(async (asset) => {
      const expectedData = await fs.readFile(getFixturePath(asset.expected), 'utf-8');
      const downloadedData = await fs.readFile(path.join(assetsDir, asset.path), 'utf-8');
      expect(expectedData).toEqual(downloadedData);
    });
  });

  test.each(assets)('load %s asset', async (asset) => {
    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    scope
      .get(pagePath)
      .reply(200, rawData);

    await loader(requestUrl, tempDir);

    const expectedData = await fs.readFile(getFixturePath(asset.expected), 'utf-8');
    const downloadedData = await fs.readFile(path.join(assetsDir, asset.path), 'utf-8');

    expect(expectedData).toEqual(downloadedData);
  });

  it('should write file correctly', async () => {
    const expectedData = await fs.readFile(getFixturePath('expected/main.html'), 'utf-8');

    scope.get(pagePath).reply(200, rawData);
    const result = await loader(requestUrl, tempDir);
    const { filepath: processedFilepath } = result;
    const processedData = await fs.readFile(processedFilepath, 'utf-8');

    expect(rawData).not.toEqual(processedData);
    expect(processedData).toEqual(expectedData);
  });
});

describe('test pageloader — negative cases', () => {
  test.each([404, 503])('Error %p', async (status) => {
    scope.get(pagePath).reply(status);
    await expect(loader(requestUrl, tempDir)).rejects.toThrow(new RegExp(status));
  });

  it('should throw when can not download resource', async () => {
    const expectedImage = 'ru-hexlet-io-assets-professions-nodejs.png';

    const assetsDir = `${tempDir}/ru-hexlet-io-courses_files`;

    scope.get(pagePath).reply(200, rawData);
    scope.get('/assets/professions/nodejs.png')
      .reply(500);

    await loader(requestUrl, tempDir);

    await expect(fs.readFile(path.join(assetsDir, expectedImage), 'utf-8')).rejects.toThrow();
  });

  it('should throw if permisson denied', async () => {
    const sysDirPath = '/sys';
    scope.get(pagePath).reply(200);

    await expect(loader(requestUrl, sysDirPath)).rejects.toThrow(/EACCES || EROFS/);
  });

  it('should throw if incorrect path', async () => {
    const incorrectDirPath = 'asdf';
    scope.get(pagePath).reply(200);

    await expect(loader(requestUrl, incorrectDirPath)).rejects.toThrow(/ENOENT/);
    await expect(loader(requestUrl, '/')).rejects.toThrow(/EACCES/);
  });

  it('should throw when not directory', async () => {
    scope.get(pagePath).reply(200, rawData);

    await expect(loader(requestUrl, getFixturePath('ru-hexlet-io-courses.html'))).rejects.toThrow(/ENOTDIR/);
  });
});
