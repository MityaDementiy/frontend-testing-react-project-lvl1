import nock from 'nock';

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

  const result = await loader('https://ru.hexlet.io/courses', 'downloads');
  const expected = 'downloads/ru-hexlet-io-courses.html';

  expect(result).toEqual(expected);
});
