import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#locales', {
  integration: true
});

test('locales have the correct length and names', function(assert) {
  const expected = [
    'en',
    'en-bw',
    'en-ps',
    'en-wz',
    'es'
  ];
  const actual = this.subject().get('locales');

  assert.deepEqual(actual, expected, JSON.stringify(actual));
});

test('addTranslations adds to locales', function(assert) {
  const expected = [
    'en',
    'en-bw',
    'en-ps',
    'en-wz',
    'es',
    'it'
  ];

  const i18n = this.subject({ locale: 'en' });
  i18n.addTranslations('it', {});
  const actual = i18n.get('locales');

  assert.deepEqual(actual, expected, JSON.stringify(actual));
});

test('addTranslations doesn\'t add duplicate locales', function(assert) {
  const expected = [
    'en',
    'en-bw',
    'en-ps',
    'en-wz',
    'es',
    'it'
  ];

  const i18n = this.subject({ locale: 'en' });
  i18n.addTranslations('it', {});
  i18n.addTranslations('it', {});
  const actual = i18n.get('locales');

  assert.deepEqual(actual, expected, JSON.stringify(actual));
});
