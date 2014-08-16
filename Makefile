all: clean test_stables

jshint: npm_install
	./node_modules/jshint/bin/jshint lib/*.js spec/*Spec.js script/*.js

test_stables: jshint npm_install vendor_install
	JQUERY_VERSION=1.9.1 EMBER_VERSION=1.0.1 HANDLEBARS_VERSION=1.1.0 ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=release HANDLEBARS_VERSION=1.3.0 ./script/run.js
	JQUERY_VERSION=2.0.3 EMBER_VERSION=release HANDLEBARS_VERSION=1.3.0 ./script/run.js
	WITHOUT_HANDLEBARS=true JQUERY_VERSION=1.9.1 EMBER_VERSION=1.0.1 HANDLEBARS_VERSION=1.1.0 ./script/run.js
	WITHOUT_HANDLEBARS=true JQUERY_VERSION=1.11.0 EMBER_VERSION=release HANDLEBARS_VERSION=1.3.0 ./script/run.js
	WITHOUT_HANDLEBARS=true JQUERY_VERSION=2.0.3 EMBER_VERSION=release HANDLEBARS_VERSION=1.3.0 ./script/run.js

test_prereleases: jshint npm_install vendor_install
	JQUERY_VERSION=1.11.0 EMBER_VERSION=beta HANDLEBARS_VERSION=1.3.0 ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=canary HANDLEBARS_VERSION=1.3.0 ./script/run.js
	WITHOUT_HANDLEBARS=true JQUERY_VERSION=1.11.0 EMBER_VERSION=beta HANDLEBARS_VERSION=1.3.0 ./script/run.js
	WITHOUT_HANDLEBARS=true JQUERY_VERSION=1.11.0 EMBER_VERSION=canary HANDLEBARS_VERSION=1.3.0 ./script/run.js

# Run the tests against the current environment only; don't run any prerequisites like
# dependency installation or JSHint checks.
test:
	@echo "Running tests with jQuery $$JQUERY_VERSION, Ember $$EMBER_VERSION, and Handlebars $$HANDLEBARS_VERSION"
	@./script/run.js

npm_install:
	npm install

vendor_install:
	./script/fetch_vendor.js

clean:
	rm -f spec/suite.html

realclean: clean
	@rm -f vendor/ember*
	@rm -f vendor/handlebars*
	@rm -f vendor/jquery*

.PHONY: jshint test_stables test_prereleases test npm_install vendor_install clean realclean
