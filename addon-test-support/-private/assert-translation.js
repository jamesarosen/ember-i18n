/* globals QUnit, expect */

export default (function() {
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
