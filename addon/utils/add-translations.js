import Ember from "ember";

export default function addTranslations(locale, newTranslations, container) {
  const key = `locale:${locale}/translations`;
  var existingTranslations = container.lookupFactory(key);

  if (existingTranslations == null) {
    existingTranslations = {};
    // CRUFT: there's no public API for registering factories at runtime.
    // See http://discuss.emberjs.com/t/whats-the-correct-way-to-register-new-factories-at-runtime/8018
    const registry = container.registry || container._registry;
    registry.register(key, existingTranslations);
  }

  Ember.merge(existingTranslations, newTranslations);
}
