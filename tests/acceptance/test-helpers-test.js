import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var app;

module('Acceptance: {{t}} Helper', {
  beforeEach: function() {
    app = startApp();
    visit('/');
  },

  afterEach: function() {
    Ember.run(app, 'destroy');
  }
});

test("t test helper", function(assert) {
  assert.equal(t("pluralized.translation", { count: 1 }), "One Click", "test-helpers t returns translation");
});

test("expectTranslation test helper", function() {
  expectTranslation('.no-interpolations', 'no.interpolations');
});
