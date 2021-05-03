#!/usr/bin/env node
/* eslint-disable no-console */

import program from 'commander';

import loader from '../index';

program
  .description('Loads page')
  .arguments('<pageUrl>')
  .action(async (pageUrl) => {
    console.log(await loader(pageUrl));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
