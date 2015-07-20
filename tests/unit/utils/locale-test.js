import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#locales', {
  integration: true
});

const locales = [
  'en-bw',
  'en-ps',
  'en-wz',
  'en',
  'es'
];

test('locales have the correct length and names', function(assert) {
  const i18n = this.subject();

  assert.deepEqual(i18n.get('locales'), locales);
});
