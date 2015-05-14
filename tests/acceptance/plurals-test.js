import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var app;

module('Acceptance: Pluralization', {
  beforeEach: function(assert) {
    app = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test("applies pluralization rules from the locale", function(assert) {
  assert.textIs('.pluralize-translation', '0 Clicks');
  click('.increment');
  assert.textIs('.pluralize-translation', 'One Click');
  click('.increment');
  assert.textIs('.pluralize-translation', '2 Clicks');
});

test("applies custom pluralization rules", function(assert) {
  setLocale('en-wz');

  assert.textIs('.pluralize-translation', 'Zero Clicks');
  click('.increment');
  assert.textIs('.pluralize-translation', 'One Click');
  click('.increment');
  assert.textIs('.pluralize-translation', '2 Clicks');
});

