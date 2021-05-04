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

test('test loader', async () => {
  const scope = nock('https://ru.hexlet.io').get('/courses').reply(200, 'hello');

  const result = await loader('https://ru.hexlet.io/courses', tempDir);
  const expected = `${tempDir}/ru-hexlet-io-courses.html`;

  expect(result).toEqual(expected);
  expect(scope.isDone).toBeTruthy();
  expect(result.endsWith('ru-hexlet-io-courses.html')).toBe(true);
});
