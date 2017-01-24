import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import './ember-i18n/test-helpers';

const assign = Ember.assign || Ember.merge;

export default function startApp(attrs) {
  var application;

  var attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
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
