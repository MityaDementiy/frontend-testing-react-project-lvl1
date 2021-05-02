#!/usr/bin/env node

const program = require('commander');

const loader = require('../index');

program
  .description('Loads page')
  .arguments('<pageUrl>')
  .action((pageUrl) => {
    console.log(loader(pageUrl));
  })
  .parse(process.argv);

if (!program.args.length) program.help();
