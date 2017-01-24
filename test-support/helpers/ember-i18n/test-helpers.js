import Ember from 'ember';

// example usage: find(`.header:contains(${t('welcome_message')})`)
Ember.Test.registerHelper('t', function(app, key, interpolations){
  const i18n = app.__container__.lookup('service:i18n');
  return i18n.t(key, interpolations);
});

// example usage: expectTranslation('.header', 'welcome_message');
Ember.Test.registerHelper('expectTranslation', function(app, element, key, interpolations){
  const text = app.testHelpers.t(key, interpolations);

  assertTranslation(element, key, text);
});

const assertTranslation = (function() {
  if (typeof QUnit !== 'undefined' && typeof ok === 'function') {
    return function(element, key, text) {
      ok(find(`${element}:contains(${text})`).length, `Found translation key ${key} in ${element}`);
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
