import Ember from "ember";

export default function addTranslations(locale, newTranslations, owner) {
  const key = `locale:${locale}/translations`;
  var existingTranslations = owner._lookupFactory(key);

  if (existingTranslations == null) {
    existingTranslations = {};
    owner.register(key, existingTranslations);
  }

  Ember.merge(existingTranslations, newTranslations);
}
