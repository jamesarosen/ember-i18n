import Ember from 'ember';
import { module, test } from 'qunit';
import { compileTemplate } from 'ember-i18n';

const { htmlSafe, isHTMLSafe } = Ember.String;

module('compile-template');

function compileAndEval(template, data = {}, rtl = false) {
  return compileTemplate(template, rtl)(data);
}

test('it emits simple strings', function(assert) {
  const result = compileAndEval('Add the brandy and cook 5 minutes.');
  assert.equal(result, 'Add the brandy and cook 5 minutes.');
});

test('it emits Unicode strings', function(assert) {
  const result = compileAndEval('Flambé');
  assert.equal(result, 'Flambé');
});

// Interpolations

test('it interpolates simple values', function(assert) {
  const result = compileAndEval('Preheat oven to {{temp}}{{units}}', { temp: '200', units: '℃' });
  assert.equal(result, 'Preheat oven to 200℃');
});

test('it ignores whitespace around interpolations', function(assert) {
  const result = compileAndEval('Add the hot stock {{  amt   }} at a time.', {
    amt: '1/4 cup'
  });
  assert.equal(result, 'Add the hot stock 1/4 cup at a time.');
});

// HTML Safety

test('it treats interpolations as HTML-unsafe', function(assert) {
  const result = compileAndEval('Add {{amount}} cloves garlic', { amount: '<em>9</em>' });
  assert.equal(result, 'Add &lt;em&gt;9&lt;/em&gt; cloves garlic');
});

test('it obeys interpolations marked as HTML-safe', function(assert) {
  const result = compileAndEval('Heat oil over {{temp}} heat.', {
    temp: htmlSafe('<strong>medium</strong>')
  });
  assert.equal(result, 'Heat oil over <strong>medium</strong> heat.');
});

test('it treats triple-stache interpolations as HTML-safe', function(assert) {
  const result = compileAndEval('Shred 100g {{{cheese}}}', {
    cheese: '<span class="no-substitutes">Parmiggiano Reggiano</span>'
  });
  assert.equal(result, 'Shred 100g <span class="no-substitutes">Parmiggiano Reggiano</span>');
});

test('it returns HTML-safe strings', function(assert) {
  const result = compileAndEval('Roast the hazelnuts');
  assert.ok(isHTMLSafe(result));
});

// Right-to-Left Support

test('it wraps the result in Unicode Right-to-Left markers if asked', function(assert) {
  const result = compileAndEval('skaets doc eht hsaW', {}, true);
  assert.equal(result, '\u202Bskaets doc eht hsaW\u202C');
});
