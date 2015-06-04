import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#addTranslations', {
  integration: true
});

// `addTranslations` mutates global state, so be careful that these
// tests don't interact poorly with one another or other tests.

test('adds translations to the current locale', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  const before = i18n.t('defined.at.runtime.one');
  assert.equal(before, 'Missing translation: defined.at.runtime.one');

  Ember.run(i18n, 'addTranslations', 'en', {
    'defined.at.runtime': { one: 'Defined at Runtime' }
  });

  const after = i18n.t('defined.at.runtime.one');
  assert.equal(after, 'Defined at Runtime');
});

test('adds translations to a parent locale', function(assert) {
  const i18n = this.subject({ locale: 'en-ps' });

  const before = i18n.t('defined.at.runtime.two');
  assert.equal(before, 'Missing translation: defined.at.runtime.two');

  Ember.run(i18n, 'addTranslations', 'en', {
    'defined.at.runtime.two': 'Defined at Runtime'
  });

  const after = i18n.t('defined.at.runtime.two');
  assert.equal(after, 'Defined at Runtime');
});

test('adds translations to an unrelated locale', function(assert) {
  const i18n = this.subject({ locale: 'es' });

  const before = i18n.t('defined.at.runtime.three');
  assert.equal(before, 'Missing translation: defined.at.runtime.three');

  Ember.run(i18n, 'addTranslations', 'en', {
    'defined.at': { 'runtime.three': 'Defined at Runtime' }
  });

  Ember.run(i18n, 'set', 'locale', 'en');

  const after = i18n.t('defined.at.runtime.three');
  assert.equal(after, 'Defined at Runtime');
});

test('adds translations to a locale that has not yet been defined', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  Ember.run(i18n, 'addTranslations', 'en-xyz', {
    'defined.at': { 'runtime.four': 'Defined at Runtime' }
  });

  Ember.run(i18n, 'set', 'locale', 'en-xyz');

  const after = i18n.t('defined.at.runtime.four');
  assert.equal(after, 'Defined at Runtime');
});
