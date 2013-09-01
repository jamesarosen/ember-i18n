all: clean test

jshint: npm_install
	./node_modules/jshint/bin/jshint lib/*.js spec/*Spec.js

test_ember_10rc3: jshint npm_install
	JQUERY_VERSION=1.9.1 EMBER_VERSION=1.0.0-rc.3 ./spec/buildSuite.js
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/suite.html

test: test_ember_10rc3

npm_install:
	npm install

clean:
	rm -f spec/suite.html

.PHONY: jshint test test_ember_10rc3 npm_install clean
