import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';
const { run } = Ember;

moduleForComponent('no-such-component', 't helper', {
  integration: true,

  beforeEach() {
    if (Ember.Helper == null) {
      const initializer = this.container.lookupFactory('initializer:ember-i18n-legacy-helper');
      initializer.initialize(this.registry);
    }

    const i18n = this.i18n = this.container.lookup('service:i18n');
    i18n.set('locale', 'en');

    this.addTranslations = function(locale, translations) {
      run(i18n, 'addTranslations', locale, translations);
    };
  },

  afterEach() {
    run(this.i18n, 'destroy');
  }
});

test('simple text, static key', function(assert) {
  this.addTranslations('en', { 'foo.bar': 'Foo Bar' });

  this.render(hbs`{{t 'foo.bar'}}`);
  assert.equal(this.$().text(), 'Foo Bar');
});

test('text with HTML, static key', function(assert) {
  this.addTranslations('en', { name: '<em>Name</em>:' });

  this.render(hbs`{{t 'name'}}`);
  assert.equal(this.$().html(), '<em>Name</em>:');
});

test('dynamic key', function(assert) {
  this.addTranslations('en', { foo: 'Foo', bar: 'Bar' });
  this.set('someKey', 'foo');

  this.render(hbs`{{t someKey}}`);
  assert.equal(this.$().text(), 'Foo');

  run(this, 'set', 'someKey', 'bar');
  assert.equal(this.$().text(), 'Bar');
});

test('interpolations', function(assert) {
  this.addTranslations('en', { 'bowl of soup': 'A bowl of {{soup}}' });
  this.set('soup', 'bisque');

  this.render(hbs`{{t 'bowl of soup' soup=soup}}`);
  assert.equal(this.$().text(), 'A bowl of bisque');

  run(this, 'set', 'soup', 'clam chowder');
  assert.equal(this.$().text(), 'A bowl of clam chowder');
});

test('locale change', function(assert) {
  this.addTranslations('en', { soup: 'Soup' });
  this.addTranslations('zh', { soup: '湯' });

  this.render(hbs`{{t 'soup'}}`);
  assert.equal(this.$().text(), 'Soup');

  run(this.i18n, 'set', 'locale', 'zh');
  assert.equal(this.$().text(), '湯');
});

test('pluralization', function(assert) {
  this.addTranslations('en', {
    bowls: {
      one: 'one bowl',
      other: '{{count}} bowls'
    }
  });
  run(this, 'set', 'numberOfBowls', 0);

  this.render(hbs`{{t 'bowls' count=numberOfBowls}}`);
  assert.equal(this.$().text(), '0 bowls');

  run(this, 'set', 'numberOfBowls', 1);
  assert.equal(this.$().text(), 'one bowl');

  run(this, 'set', 'numberOfBowls', 2);
  assert.equal(this.$().text(), '2 bowls');
});
