import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var app;

module('Acceptance: CP Macro', {
  beforeEach: function(assert) {
    app = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test('defines a translated property with dependencies', function(assert) {
  assert.textIs('.cp-macro-translation', 'Clicks: 0');

  click('.increment');

  assert.textIs('.cp-macro-translation', 'Clicks: 1');
});
