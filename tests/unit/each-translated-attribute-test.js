import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

var spy;

moduleFor('service:i18n', 'I18n#eachTranslatedAttribute', {
  integration: true,

  beforeEach: function() {
    spy = function(key, translation) { spy.calls[key] = translation; };
    spy.calls = {};

    const object = {
      nonTranslatedKey: 'a value',
      titleTranslation: 'no.interpolations',
      aNullTranslation: null
    };

    this.subject({ locale: 'en' }).eachTranslatedAttribute(object, spy);
  }
});

test('skips non-translated attributes', function(assert) {
  assert.equal(spy.calls.hasOwnProperty('nonTranslatedKey'), false);
});

test('calls the callback with translated attributes, minus the marker suffix, and their translations', function(assert) {
  assert.equal(spy.calls.title, 'text with no interpolations');
});

test('calls the callback with null if the translation key is null', function(assert) {
  assert.strictEqual(spy.calls.aNull, null);
});
