#!/usr/bin/env node

var buildSuite = require('./buildSuite'),
    exec = require('child_process').exec,
    phantomJSBin = './node_modules/mocha-phantomjs/bin/mocha-phantomjs';

function runSpecs() {
  var suitePath = buildSuite();
  exec(phantomJSBin + ' ' + suitePath, function (error, stdout, stderr) {
    logIfAnything(stdout);
    logIfAnything(stderr);
    if (error !== null) {
      console.error('Error running specs: ' + error);
    }
  });
}

function logIfAnything(output) {
  if (('' + output) !== "") {
    console.log(output);
  }
}

runSpecs();
