all: test

jshint: npm_install
	./node_modules/jshint/bin/jshint lib/*.js spec/*Spec.js

test: jshint npm_install
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/suite.html

npm_install:
	npm install

.PHONY: jshint test npm_install