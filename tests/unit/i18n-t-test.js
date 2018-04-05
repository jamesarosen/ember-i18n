import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

const { run, deprecate:originalDeprecate } = Ember;

moduleFor('service:i18n', 'I18nService#t', {
  integration: true,

  afterEach() {
    Ember.deprecate = originalDeprecate;
  }
});

test('falls back to parent locale', function(assert) {
  const i18n = this.subject({ locale: 'en-ps' });

  assert.equal('' + i18n.t('no.interpolations'), 'téxt wîth nö ìntérpølåtíôns');
  assert.equal(i18n.t('with.interpolations', { clicks: 8 }), 'Clicks: 8');
});

test('allows number values in translations', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.t('with.number'), "3");
});

test('supports changing locales', function(assert) {
  const i18n = this.subject({ locale: 'en' });
  assert.equal('' + i18n.t('no.interpolations'), 'text with no interpolations');

  run(i18n, 'set', 'locale', 'en-ps');
  assert.equal('' + i18n.t('no.interpolations'), 'téxt wîth nö ìntérpølåtíôns');

  run(i18n, 'set', 'locale', 'en');
  assert.equal('' + i18n.t('no.interpolations'), 'text with no interpolations');

  run(i18n, 'set', 'locale', 'es');
  assert.equal('' + i18n.t('no.interpolations'), 'texto sin interpolaciones');

  run(i18n, 'set', 'locale', 'en');
  assert.equal('' + i18n.t('no.interpolations'), 'text with no interpolations');
});

test('returns "missing translation" translations', function(assert) {
  const result = this.subject({ locale: 'en' }).t('not.yet.translated', {});
  assert.equal('Missing translation: not.yet.translated', result);
});

test('warns on the presence of htmlSafe and locale', function(assert) {
  const service = this.subject();
  let deprecations = 0;

  Ember.deprecate = function(message, predicate, options = {}) {
    if (predicate) { return; }

    const { id } = options;

    if (id === 'ember-i18n.reserve-htmlSafe' || id === 'ember-i18n.reserve-locale') {
      deprecations += 1;
    }
  };

  service.t('not.yet.translated', { htmlSafe: true });
  assert.equal(deprecations, 1);

  service.t('not.yet.translated', { locale: true });
  assert.equal(deprecations, 2);

  service.t('not.yet.translated');
  service.t('not.yet.translated', { some: 'other key' });
  assert.equal(deprecations, 2);
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
  this.subject({ locale: 'en-bw' });
  const result = this.subject().t('no.interpolations');

  assert.equal(result, '\u202Bsnoitalopretni on htiw txet\u202C');
});

test("applies pluralization rules from the locale", function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.t('pluralized.translation', { count: 0 }), '0 Clicks');
  assert.equal(i18n.t('pluralized.translation', { count: '1' }), 'One Click');
  assert.equal(i18n.t('pluralized.translation', { count: 2 }), '2 Clicks');
});

test("applies custom pluralization rules", function(assert) {
  const i18n = this.subject({ locale: 'en-wz' });

  assert.equal(i18n.t('pluralized.translation', { count: '0' }), 'Zero Clicks');
  assert.equal(i18n.t('pluralized.translation', { count: 1 }), 'One Click');
  assert.equal(i18n.t('pluralized.translation', { count: 2 }), '2 Clicks');
});

test("applies provided default translation in cascade when main one is not found", function(assert) {
  const i18n = this.subject({ locale: 'en' });
  const defaultsChain = ['with.pretty-good-interpolations', 'with.interpolations'];
  const calls = [];
  function spy() { calls.push(arguments); }
  i18n.on('missing', spy);
  assert.equal(i18n.t('with.great-interpolations', { clicks: 8, default: defaultsChain }), 'Clicks: 8', 'default can be an array');
  assert.equal(i18n.t('with.great-interpolations', { clicks: 8, default: 'with.interpolations' }), 'Clicks: 8', 'default can be an string');
  assert.equal(calls.length, 0, 'The missing event is not fired when a fallback translation is found');
  assert.equal(i18n.t('not.yet.translated', { clicks: 8, default: ['not.translated.either'] }), 'Missing translation: not.yet.translated');
  assert.equal(calls[0][1], 'not.yet.translated', 'When the "missing" event is fired, it\'s fired with the provided key');
});

test("check unknown locale", function(assert) {
  const result = this.subject({ locale: 'uy' }).t('not.yet.translated', {count: 2});
  assert.equal('Missing translation: not.yet.translated', result);
});

test('provided default translation works as expected when locale is default', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: true
    }
  });
  const i18n = this.subject({ locale: 'en' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Default 2 value');
});

test('falls back to default translation when label not found for locale', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: true
    }
  });
  const i18n = this.subject({ locale: 'es' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Default 2 value');
});

test('falls back to default translation when label not found and locale not found', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: true
    }
  });
  const i18n = this.subject({ locale: 'foobz' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Default 2 value');
});

test('does not fall back to default translation when configuration true but defaultLocale falsy', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: '',
      defaultFallback: true
    }
  });
  const i18n = this.subject({ locale: 'es' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Missing translation: defined.in.default.value');
});

test('does not fall back to default translation when configuration false', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: false
    }
  });
  const i18n = this.subject({ locale: 'es' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Missing translation: defined.in.default.value');
});

test('does not fall back to default translation when configuration null', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: null
    }
  });
  const i18n = this.subject({ locale: 'es' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Missing translation: defined.in.default.value');
});

test('does not fall back to default translation when configuration undefined', function(assert) {
  this.register('config:environment', {
    i18n: {
      defaultLocale: 'en',
      defaultFallback: undefined
    }
  });
  const i18n = this.subject({ locale: 'es' });
  assert.equal('' + i18n.t('defined.in.default.value', { count: 2 }), 'Missing translation: defined.in.default.value');
});
