import { moduleFor, test } from 'ember-qunit';

moduleFor('service:i18n', 'I18nService#t', {
  integration: true
});

test('returns true when the key exists', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.exists('no.interpolations'), true);
});

test('returns false when the key does not exist', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.exists('not.yet.translated'), false);
});

test('works with interpolations', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.exists('with.interpolations', { count: 2 }), true);
});

test('reports false when the key does not exist, but the fallback does', function(assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.exists('not.yet.translated', { default: 'no.interpolations' }), false);
});

test('fallsback to the parent locale', function(assert) {
  const i18n = this.subject({ locale: 'en-ps' });

  assert.equal(i18n.exists('no.interpolations.either'), true);
});

test('non-existing translations when checked twice do not exist', function (assert) {
  const i18n = this.subject({ locale: 'en' });

  assert.equal(i18n.exists('not.existing'), false);
  assert.equal(i18n.t('not.existing'), 'Missing translation: not.existing');
  assert.equal(i18n.exists('not.existing'), false);
});
