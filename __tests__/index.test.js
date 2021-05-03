import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';

import loader from '../src/index';

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

test('returns filepath', async () => {
  nock('https://ru.hexlet.io').get('/courses').reply(200);

  const result = await loader('https://ru.hexlet.io/courses', os.tmpdir());
  const expected = '/tmp/ru-hexlet-io-courses.html';

  expect(result).toEqual(expected);
});
