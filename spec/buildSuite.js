#!/usr/bin/env node

var fs   = require('fs'),
    hdbs = require('handlebars').create();

function versionFor(library) {
  var envPropertyName = library.toUpperCase() + '_VERSION';
      version = process.env[ envPropertyName ];

  if (version == null || version === '') {
    console.error('Must set environment variable ' + envPropertyName);
    process.exit(1);
  }

  var path = 'vendor/' + library + '-' + version + '.js';

  if (!fs.existsSync(path)) {
    console.error('No such file: ' + path);
    process.exit(1);
  }

  return version;
}

var emberVersion      = versionFor('ember'),
    handlebarsVersion = versionFor('handlebars'),
    jQueryVersion     = versionFor('jquery'),
    template          = fs.readFileSync('spec/suite.hdbs').toString(),
    compiledTemplate  = hdbs.compile(template),
    templateData      = { jQueryVersion: jQueryVersion, emberVersion: emberVersion, handlebarsVersion: handlebarsVersion },
    outputPath        = 'spec/suite.html';

fs.writeFileSync(outputPath, compiledTemplate(templateData));
console.info('Wrote suite to ' + outputPath);
