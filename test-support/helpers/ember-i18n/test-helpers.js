/* globals QUnit, expect */

import { registerHelper } from '@ember/test';
import { _t } from 'ember-i18n/test-support/helpers';

// example usage: find(`.header:contains(${t('welcome_message')})`)
registerHelper('t', function(app, key, interpolations) {
  return _t(app.__container__, key, interpolations);
});

// example usage: expectTranslation('.header', 'welcome_message');
registerHelper('expectTranslation', function(app, element, key, interpolations){
  const text = app.testHelpers.t(key, interpolations);

  assertTranslation(element, key, text);
});

const assertTranslation = (function() {
  if (typeof QUnit !== 'undefined' && typeof QUnit.assert.ok === 'function') {
    return function(element, key, text) {
      QUnit.assert.ok(find(`${element}:contains(${text})`).length, `Found translation key ${key} in ${element}`);
    };
  } else if (typeof expect === 'function') {
    return function(element, key, text) {
      const found = !!(find(`${element}:contains(${text})`).length);
      expect(found).to.equal(true);
    };
  } else {
    return function() {
      throw new Error("ember-i18n could not find a compatible test framework");
    };
  }
}());
