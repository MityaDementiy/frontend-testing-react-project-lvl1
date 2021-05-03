import nock from 'nock';

import { formatUrl, get } from '../src/utils';

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test('test formatter', () => {
  const rawUrl = 'https://ru.hexlet.io/courses';
  const formattedUrl = 'ru-hexlet-io-courses.html';
  const processedUrl = formatUrl(rawUrl);

  expect(rawUrl).not.toEqual(processedUrl);
  expect(processedUrl).toEqual(formattedUrl);
});

test('test http request', async () => {
  const data = '<h1>Hello, World!</h1>';

  const scope = nock('https://ru.hexlet.io').get('/courses').reply(200, data);
  const result = await get('https://ru.hexlet.io/courses');

  expect(scope.isDone()).toBeTruthy();
  expect(result).toBe(data);
});
