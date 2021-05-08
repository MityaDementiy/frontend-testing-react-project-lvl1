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

let tempDir;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

const getFixturePath = (name) => path.join('__fixtures__', name);

test('test loader', async () => {
  const data = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  const scope = nock('https://ru.hexlet.io').get('/courses').reply(200, data);

  const result = await loader('https://ru.hexlet.io/courses', tempDir);
  console.log("🚀 ~ file: index.test.js ~ line 29 ~ test ~ result", result)
  const expected = `${tempDir}/ru-hexlet-io-courses.html`;

  expect(result).toEqual(expected);
  expect(scope.isDone).toBeTruthy();
  expect(result.endsWith('ru-hexlet-io-courses.html')).toBe(true);
});

