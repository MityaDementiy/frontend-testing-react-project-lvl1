import formatUrl from '../src/utils';

test('test formatter', async () => {
  const rawUrl = 'https://ru.hexlet.io';
  const formattedUrl = formatUrl(rawUrl);

  expect(rawUrl).toEqual(formattedUrl);
});
