import Ember from "ember";

const assign = Ember.assign || Ember.merge;

export default function addTranslations(locale, newTranslations, owner) {
  const key = `locale:${locale}/translations`;
  let existingTranslations;
  if (owner.factoryFor) {
    let maybeTranslations = owner.factoryFor(key);
    existingTranslations = maybeTranslations && maybeTranslations.class;
  } else {
    existingTranslations = owner._lookupFactory(key);
  }

  if (existingTranslations == null) {
    existingTranslations = {};
    owner.register(key, existingTranslations);
  }

  assign(existingTranslations, newTranslations);
}
