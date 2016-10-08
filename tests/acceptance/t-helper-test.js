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

test('renders with no interpolations', function(assert) {
  assert.textIs('.no-interpolations', 'text with no interpolations');
});

test('renders with static interpolations', function(assert) {
  assert.textIs('.static-interpolations', 'Clicks: 45');
});

test('renders translations of dynamic keys', function(assert) {
  assert.textIs('.dynamic-key', 'text with no interpolations');
});

test('updates translations of dynamic keys', function(assert) {
  assert.textIs('.dynamic-key', 'text with no interpolations');

  click('.change-dynamic-key');

  assert.textIs('.dynamic-key', 'another text without interpolations');
});

test('updates when dynamic interpolations change', function(assert) {
  assert.textIs('.dynamic-interpolations', 'Clicks: 0');

  click('.increment');

  assert.textIs('.dynamic-interpolations', 'Clicks: 1');
});

test('updates when the locale changes', function(assert) {
  click('.switch-to-es');

  andThen(function() {
    assert.textIs('.no-interpolations', 'texto sin interpolaciones');
  });
});

test('can override the target locale', function(assert) {
  assert.textIs('.locale-override', 'texto sin interpolaciones');
});
