import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import { translationMacro as t } from 'ember-i18n';

moduleFor('service:i18n', 'translationMacro', {
  integration: true,

  beforeEach() {
    const i18n = this.subject({ locale: 'en' });

    this.object = Ember.Object.extend({
      i18n: i18n,

      numberClicks: 9,

      tMacroProperty1: t('no.interpolations'),

      tMacroProperty2: t('with.interpolations', { clicks: 'numberClicks' }),
    }).create();
  }
});

test('defines a computed property that translates without interpolations', function(assert) {
  assert.equal(this.object.get('tMacroProperty1'), 'text with no interpolations');
});

test('defines a computed property that translates with interpolations', function(assert) {
  assert.equal(this.object.get('tMacroProperty2'), 'Clicks: 9');
});

test('defines a computed property with dependencies', function(assert) {
  Ember.run(this.object, 'set', 'numberClicks', 13);
  assert.equal(this.object.get('tMacroProperty2'), 'Clicks: 13');
});

test('defines a computed property that depends on the locale', function(assert) {
  assert.equal(this.object.get('tMacroProperty1'), 'text with no interpolations');
  Ember.run(this.object, 'set', 'i18n.locale', 'es');
  assert.equal(this.object.get('tMacroProperty1'), 'texto sin interpolaciones');
});
