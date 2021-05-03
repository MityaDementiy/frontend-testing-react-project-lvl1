import formatUrl from '../src/utils';

test('test formatter', () => {
  const rawUrl = 'https://ru.hexlet.io/courses';
  const formattedUrl = 'ru-hexlet-io-courses.html';
  const processedUrl = formatUrl(rawUrl);

  expect(rawUrl).not.toEqual(processedUrl);
  expect(processedUrl).toEqual(formattedUrl);
});
