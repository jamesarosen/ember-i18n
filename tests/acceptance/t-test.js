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
  assert.textIs('.static-interpolations', 'text with two static interpolations');
});

test('updates when dynamic interpolations change', function(assert) {
  assert.textIs('.dynamic-interpolations', 'Clicks: 0');

  click('.increment');

  assert.textIs('.dynamic-interpolations', 'Clicks: 1');
});

test('updates when the locale changes', function(assert) {
  setLocale('es');

  assert.textIs('.no-interpolations', 'texto sin interpolaciónes');
});

test('renders a missing-translation message', function(assert) {
  assert.textIs('.not-yet-translated', 'Missing translation: not.yet.translated');
});

test('triggers a "missing" event when the translation key is not found', function(assert) {
  assert.textIs('.last-missing-translation', 'Missing: en/not.yet.translated');
});

test('adds RTL markers if the locale calls for it', function(assert) {
  setLocale('en-bw');

  assert.textIs('.no-interpolations', '\u202Bsnoitalopretni on htiw txet\u202C');
});

test('falls back to parent locale', function(assert) {
  setLocale('en-ps');

  assert.textIs('.no-interpolations', 'téxt wîth nö ìntérpølåtíôns');
  assert.textIs('.static-interpolations', 'text with two static interpolations');
});
