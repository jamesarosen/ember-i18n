## Running the tests

You'll need [npm](https://npmjs.org), `make`, and [PhantomJS](http://phantomjs.org/).

The default `make` target will run tests against several combinations of Ember,
Handlebars, and jQuery.

To run tests against a single combination, run `make test` with a set of environment
variables set:

```bash
$ JQUERY_VERSION=2.0.3 EMBER_VERSION=beta HANDLEBARS_VERSION=1.3.0 make test
```

## Commit-Bit Policy

If a commit of yours lands in the `master` branch, you've earned committer
rights. If you would like to be added to the contributors list, please say
so in your pull request or email me.
