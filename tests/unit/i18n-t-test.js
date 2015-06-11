import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#t', {
  integration: true
});

test('falls back to parent locale', function(assert) {
  const i18n = this.subject({ locale: 'en-ps' });

  assert.equal(i18n.t('no.interpolations'), 'téxt wîth nö ìntérpølåtíôns');
  assert.equal(i18n.t('with.interpolations', { clicks: 8 }), 'Clicks: 8');
});

test('returns "missing translation" translations', function(assert) {
  const result = this.subject({ locale: 'en' }).t('not.yet.translated', {});
  assert.equal('Missing translation: not.yet.translated', result);
});

test('emits "missing" events', function(assert) {
  const i18n = this.subject({ locale: 'en' });
  const calls = [];
  function spy() { calls.push(arguments); }
  i18n.on('missing', spy);

  i18n.t('not.yet.translated', { some: 'data' });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].length, 3);
  assert.equal(calls[0][0], 'en');
  assert.equal(calls[0][1], 'not.yet.translated');
  assert.equal(calls[0][2].some, 'data');
});

test('adds RTL markers if the locale calls for it', function(assert) {
  const i18n = this.subject({ locale: 'en-bw' });
  const result = this.subject().t('no.interpolations');

  assert.equal(result, '\u202Bsnoitalopretni on htiw txet\u202C');
});

test("applies pluralization rules from the locale", function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.t('pluralized.translation', { count: 0 }), '0 Clicks');
  assert.equal(i18n.t('pluralized.translation', { count: 1 }), 'One Click');
  assert.equal(i18n.t('pluralized.translation', { count: 2 }), '2 Clicks');
});

test("applies custom pluralization rules", function(assert) {
  const i18n = this.subject({ locale: 'en-wz' });

  assert.equal(i18n.t('pluralized.translation', { count: 0 }), 'Zero Clicks');
  assert.equal(i18n.t('pluralized.translation', { count: 1 }), 'One Click');
  assert.equal(i18n.t('pluralized.translation', { count: 2 }), '2 Clicks');
});

test("applies provided fallbacks only if they exist", function(assert) {
  const i18n = this.subject({ locale: 'en' });
  const fallbacks = ['with.pretty-good-interpolations', 'with.interpolations'];

  assert.equal(i18n.t('with.great-interpolations', { clicks: 8, fallbacks: fallbacks }), 'Clicks: 8');
  assert.equal(i18n.t('not.yet.translated', { clicks: 8, fallbacks: ['not.translated.either'] }), 'Missing translation: not.yet.translated');
});
