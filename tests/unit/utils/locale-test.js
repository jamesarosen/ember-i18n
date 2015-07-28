import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#locales', {
  integration: true
});

test('locales have the correct length and names', function(assert) {
  const locales = [
    'en-bw',
    'en-ps',
    'en-wz',
    'en',
    'es'
  ];

  const i18n = this.subject();

  assert.deepEqual(i18n.get('locales'), locales);
});

test('addTranslations adds to locales', function(assert) {
  const locales = [
    'en-bw',
    'en-ps',
    'en-wz',
    'en',
    'es',
    'it'
  ];

  const i18n = this.subject({ locale: 'en' });

  i18n.addTranslations('it', {});

  assert.deepEqual(i18n.get('locales'), locales);
});

test('addTranslations doesn\'t add duplicate locales', function(assert) {
  const locales = [
    'en-bw',
    'en-ps',
    'en-wz',
    'en',
    'es',
    'it'
  ];

  const i18n = this.subject({ locale: 'en' });

  i18n.addTranslations('it', {});
  i18n.addTranslations('it', {});

  assert.deepEqual(i18n.get('locales'), locales);
});
