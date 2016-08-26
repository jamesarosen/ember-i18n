import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './ember-i18n/test-helpers';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}

if (QUnit.assert.textIs == null) {
  QUnit.assert.textIs = function(selector, expected) {
    andThen(() => {
      const actual = findWithAssert(selector).text();
      this.push(actual === expected, actual, expected);
    });
  };
}
