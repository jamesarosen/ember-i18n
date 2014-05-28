#!/usr/bin/env node

var fs = require('fs'),
    httpGet = require('http').get,
    httpsGet = require('https').get,
    parseURL = require('url').parse;

var FILES = {
  "ember-1.0.1": "https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.0.1/ember.js",
  "ember-release": "http://builds.emberjs.com/release/ember.js",
  "ember-beta": "http://builds.emberjs.com/beta/ember.js",
  "ember-canary": "http://builds.emberjs.com/canary/ember.js",

  "jquery-1.9.1": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js",
  "jquery-1.11.0": "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js",
  "jquery-2.0.3": "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js",

  "handlebars-1.1.0": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.1.0/handlebars.js",
  "handlebars-1.3.0": "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.js"
};

function fetchAll() {
  for (var library in FILES) {
    if (FILES.hasOwnProperty(library)) {
      fetchIfUnfetched(library);
    }
  }
}

function fetchIfUnfetched(library) {
  var dest = destination(library);
  if (fs.existsSync(dest)) { return; }

  curl(FILES[library], function (body) {
    fs.writeFileSync(dest, body);
    console.info('Wrote ' + dest);
  });
}

function destination(library) {
  return 'vendor/' + library + '.js';
}

function get(urlOptions, callback) {
  var fn = urlOptions.protocol === 'https:' ? httpsGet : httpGet;
  return fn(urlOptions, callback);
}

function curl(url, callback) {
  var urlOptions = parseURL(url);
  get(urlOptions, function(res) {
    if (res.statusCode >= 400) {
      throw new Error('Error fetching ' + url);
    }

    var buf = '';
    res.on('data', function (chunk) {
      buf += chunk;
    });
    res.on('end', function () {
      callback(buf);
    });
  });
}

fetchAll();
