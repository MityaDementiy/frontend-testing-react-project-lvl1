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

beforeEach(async () => {
  await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

afterEach(async () => {
  await fs.rmdir('/tmp/page-loader-', { recursive: true, force: true });
});

const getFixturePath = (name) => path.join('__fixtures__', name);

test('returns filepath', async () => {
  nock('https://ru.hexlet.io').get('/courses').reply(200);

  const result = await loader('https://ru.hexlet.io/courses', '/tmp/page-loader-');
  const expected = '/tmp/page-loader-/ru-hexlet-io-courses.html';

  expect(result).toEqual(expected);
});

test('loads page', async () => {
  const data = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');
  nock('https://ru.hexlet.io').get('/courses').reply(200, data);

  await loader('https://ru.hexlet.io/courses', '/tmp/page-loader-');
  const result = await fs.readFile('/tmp/page-loader-/ru-hexlet-io-courses.html', 'utf-8');

  expect(result).toEqual(data);
});
