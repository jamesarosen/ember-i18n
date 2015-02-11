var fs   = require('fs'),
    hdbs = require('handlebars').create();

function versionFor(library) {
  var envPropertyName = library.toUpperCase() + '_VERSION';
  var version = process.env[ envPropertyName ];

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

function useEmberHandlebarsCompiler() {
  return process.env.EMBER_TEMPLATE_COMPILER === 'true';
}

module.exports = function buildSuite() {
  var template          = fs.readFileSync('spec/suite.hdbs').toString(),
      compiledTemplate  = hdbs.compile(template),
      outputPath        = 'spec/suite.html',
      templateData = {
        emberVersion:      versionFor('ember'),
        jQueryVersion:     versionFor('jquery'),
        handlebarsVersion: versionFor('handlebars'),
        emberTemplateCompiler: useEmberHandlebarsCompiler()
      };
  fs.writeFileSync(outputPath, compiledTemplate(templateData));
  return outputPath;
};
