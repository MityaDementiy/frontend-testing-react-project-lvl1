import nock from 'nock';
import os from 'os';
import { promises as fs } from 'fs';
import path from 'path';
import cheerio from 'cheerio';

import loader from '../src/index';
import { urlToFilename, urlToDirname } from '../src/utils';

describe('test utils', () => {
  test('urlToFilename should process urls', () => {
    const firstUrl = 'https://ru.hexlet.io/programs/frontend-testing-react';
    const firstExpectedUrl = 'https-ru-hexlet-io-programs-frontend-testing-react.html';
    const secondUrl = 'http://www.ru.hexlet.io/programs/frontend-testing-react';
    const secondExpectedUrl = 'http-www-ru-hexlet-io-programs-frontend-testing-react.html';

    const firstProcessedUrl = urlToFilename(firstUrl);
    const secondProcessedUrl = urlToFilename(secondUrl);

    expect(firstUrl).not.toEqual(firstProcessedUrl);
    expect(firstProcessedUrl).toEqual(firstExpectedUrl);
    expect(secondProcessedUrl).toEqual(secondExpectedUrl);
  });

  test('urlToDirname should process urls', () => {
    const firstUrl = 'https://ru.hexlet.io/programs/frontend-testing-react';
    const firstExpectedUrl = 'https-ru-hexlet-io-programs-frontend-testing-react_files';
    const secondUrl = 'http://www.ru.hexlet.io/programs/frontend-testing-react';
    const secondExpectedUrl = 'http-www-ru-hexlet-io-programs-frontend-testing-react_files';

    const firstProcessedUrl = urlToDirname(firstUrl);
    const secondProcessedUrl = urlToDirname(secondUrl);

    expect(firstUrl).not.toEqual(firstProcessedUrl);
    expect(firstProcessedUrl).toEqual(firstExpectedUrl);
    expect(secondProcessedUrl).toEqual(secondExpectedUrl);
  });
});

