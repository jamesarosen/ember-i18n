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

test('allow override getPluralKey for locale', function(assert) {
  const i18n =this.factory().extend({
    buildLocale(id) {
      const locale = this._super(id);
      locale.getPluralKey = function(key, count) {
        const inflection = this.pluralForm(+count);
        return `${key} - ${inflection}`;
      };
      return locale;
    }
  }).create({ locale: 'en' });

  assert.equal(i18n.exists('custom pluralized.tranclation', { count: 2 }), true);
  assert.equal(i18n.exists('custom pluralized.tranclation', { count: 1 }), true);
});

test('allow override findTranslation for locale', function(assert) {
  const i18n = this.factory().extend({
    buildLocale(id) {
      const locale = this._super(id);
      locale.findTranslation = () => ({ result: `All keys will be resolved be this one`});
      return locale;
    }
  }).create({ locale: 'en' });

  assert.equal(i18n.exists('some strange translation', { count: 2 }), true);
  assert.equal(i18n.exists('some strange translation', { count: 1 }), true);
});
