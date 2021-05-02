#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander');

const loader = require('../index');

program
  .description('Loads page')
  .arguments('<pageUrl>')
  .action(async (pageUrl) => {
    console.log(await loader(pageUrl));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
