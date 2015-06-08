import Ember from "ember";

const keys = Ember.keys;
const get = Ember.get;

// @public
export default function createTranslatedComputedProperty(key, interpolations = {}) {
  return Ember.computed(values(interpolations), function() {
    const i18n = get(this, 'i18n');
    Ember.assert(`Cannot translate ${key}. ${this} does not have an i18n.`, i18n);
    return i18n.t(key, mapPropertiesByHash(this, interpolations));
  });
}

function values(object) {
  return keys(object).map((key) => object[key]);
}

function mapPropertiesByHash(object, hash) {
  const result = {};

  keys(hash).forEach(function(key) {
    result[key] = get(object, hash[key]);
  });

  return result;
}
