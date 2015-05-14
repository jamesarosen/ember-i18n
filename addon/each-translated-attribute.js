import Ember from "ember";

const get = Ember.get;
const IS_TRANSLATED_ATTRIBUTE = /^(.+)Translation$/;

export default function eachTranslatedAttribute(i18n, object, fn) {
  Ember.keys(object).forEach(function(attr) {
    const match = attr.match(IS_TRANSLATED_ATTRIBUTE);

    if (match) {
      const translationKey = get(object, attr);
      const translation = translationKey == null ? null : i18n.t(translationKey);
      fn(match[1], translation);
    }
  });
}
