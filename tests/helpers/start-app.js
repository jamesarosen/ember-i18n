import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}

Ember.Test.registerAsyncHelper('setLocale', function(app, locale) {
  const $select = findWithAssert('.select-locale');

  Ember.run(function() {
    $select.val(locale).trigger('change');
  });
});

if (QUnit.assert.textIs == null) {
  QUnit.assert.textIs = function(selector, expected) {
    andThen(() => {
      const actual = findWithAssert(selector).text();
      this.push(actual === expected, actual, expected);
    });
  };
}
