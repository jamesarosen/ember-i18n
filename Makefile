all: clean test

jshint: npm_install
	./node_modules/jshint/bin/jshint lib/*.js spec/*Spec.js

test_ember_0981: jshint npm_install vendor_install
	JQUERY_VERSION=1.7.2 EMBER_VERSION=0.9.8.1 HANDLEBARS_VERSION=1.0.0-rc.3 ./spec/buildSuite.js
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/suite.html

test_ember_101: jshint npm_install vendor_install
	JQUERY_VERSION=1.9.1 EMBER_VERSION=1.0.1 HANDLEBARS_VERSION=1.1.0 ./spec/buildSuite.js
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/suite.html

test_ember_canary: jshint npm_install vendor_install
	JQUERY_VERSION=1.11.0 EMBER_VERSION=canary HANDLEBARS_VERSION=1.3.0 ./spec/buildSuite.js
	./node_modules/mocha-phantomjs/bin/mocha-phantomjs spec/suite.html

test: test_ember_0981 test_ember_101 test_ember_canary

npm_install:
	npm install

vendor_install: vendor/ember-0.9.8.1.js vendor/ember-1.0.1.js vendor/ember-canary.js vendor/jquery-1.7.2.js vendor/jquery-1.9.1.js vendor/jquery-1.11.0.js vendor/handlebars-1.0.0-rc.3.js vendor/handlebars-1.1.0.js vendor/handlebars-1.3.0.js
	@echo "Installed vendor libraries"

vendor/ember-0.9.8.1.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/ember.js/0.9.8.1/ember-0.9.8.1.js > $@

vendor/ember-1.0.1.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/ember.js/1.0.1/ember.js > $@

vendor/ember-canary.js:
	@curl http://builds.emberjs.com/canary/ember.js > $@

vendor/jquery-1.7.2.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js > $@

vendor/jquery-1.9.1.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.js > $@

vendor/jquery-1.11.0.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.js > $@

vendor/handlebars-1.0.0-rc.3.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.3/handlebars.js > $@

vendor/handlebars-1.1.0.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.1.0/handlebars.js > $@

vendor/handlebars-1.3.0.js:
	@curl https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.js > $@

clean:
	rm -f spec/suite.html

realclean: clean
	@rm -f vendor/ember*
	@rm -f vendor/handlebars*
	@rm -f vendor/jquery*

.PHONY: jshint test test_ember_0981 test_ember_101 npm_install vendor_install clean realclean
