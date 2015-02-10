CHECK = \033[32m✓\033[m

all: clean test_stables

dist: development_dependencies
	mkdir -p dist
	cp lib/i18n.js dist/
	cp lib/i18n-plurals.js dist/
	node_modules/uglify-js/bin/uglifyjs lib/i18n.js -o dist/i18n.min.js
	node_modules/uglify-js/bin/uglifyjs lib/i18n-plurals.js -o dist/i18n-plurals.min.js

jshint: development_dependencies
	@./node_modules/jshint/bin/jshint lib/*.js spec/*Spec.js script/*.js
	@echo "$(CHECK) JSHint OK"

test_stables: jshint development_dependencies vendor_install
	JQUERY_VERSION=1.9.1 EMBER_VERSION=1.0.1 HANDLEBARS_VERSION=1.1.0 ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=1.7.1 HANDLEBARS_VERSION=1.3.0 ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=1.9.1 HANDLEBARS_VERSION=2.0.0 ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=1.10.0 HANDLEBARS_VERSION=2.0.0 EMBER_TEMPLATE_COMPILER=true ./script/run.js

test_prereleases: jshint development_dependencies vendor_install
	JQUERY_VERSION=2.0.3 EMBER_VERSION=release HANDLEBARS_VERSION=2.0.0 EMBER_TEMPLATE_COMPILER=true ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=beta HANDLEBARS_VERSION=2.0.0 EMBER_TEMPLATE_COMPILER=true ./script/run.js
	JQUERY_VERSION=1.11.0 EMBER_VERSION=canary HANDLEBARS_VERSION=2.0.0 EMBER_TEMPLATE_COMPILER=true ./script/run.js

# Run the tests against the current environment only; don't run any prerequisites like
# dependency installation or JSHint checks.
test: development_dependencies
	@echo "Running tests with jQuery $$JQUERY_VERSION, Ember $$EMBER_VERSION, and Handlebars $$HANDLEBARS_VERSION"
	@./script/run.js

vendor_install: development_dependencies
	@mkdir -p ./vendor
	@./script/fetch_vendor.js
	@echo "$(CHECK) Fetched vendor dependencies"

clean:
	@rm -rf dist/
	@rm -f spec/suite.html
	@echo "$(CHECK) Tidied up"

realclean: clean
	@rm -f vendor/ember*
	@rm -f vendor/handlebars*
	@rm -f vendor/jquery*
	@echo "$(CHECK) Cleaned *everything*"

development_dependencies:
	@which node > /dev/null || (echo "Could not find node on path" && false)
	@which npm > /dev/null || (echo "Could not find npm on path" && false)
	@which phantomjs > /dev/null || (echo "Could not find phantomjs on path" && false)
	@npm install 2>&1 1>/dev/null
	@echo "$(CHECK) Development dependencies OK"

.PHONY: jshint test_stables test_prereleases test vendor_install clean realclean development_dependencies
