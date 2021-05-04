import nock from 'nock';
import { promises as fs } from 'fs';
import path from 'path';

import { formatUrl, get, makeFileDirectoryUrl } from '../src/utils';

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const getFixturePath = (name) => path.join('__fixtures__', name);

test('test formatter', () => {
  const rawUrl = 'https://ru.hexlet.io/courses';
  const formattedUrl = 'ru-hexlet-io-courses.html';
  const processedUrl = formatUrl(rawUrl);

  expect(rawUrl).not.toEqual(processedUrl);
  expect(processedUrl).toEqual(formattedUrl);
});

test('test http request', async () => {
  const data = await fs.readFile(getFixturePath('ru-hexlet-io-courses.html'), 'utf-8');

  const scope = nock('https://ru.hexlet.io').get('/courses').reply(200, data);
  const result = await get('https://ru.hexlet.io/courses');

  expect(scope.isDone()).toBeTruthy();
  expect(result).toBe(data);
});

test('test file directory formatter', () => {
  const fileUrl = 'ru-hexlet-io-courses.html';
  const expected = 'ru-hexlet-io-courses_files';
  const result = makeFileDirectoryUrl(fileUrl);

  expect(result).toEqual(expected);
});
