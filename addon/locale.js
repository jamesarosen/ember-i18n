import Ember from "ember";

// @private
//
// This class is the work-horse of localization look-up.
export default class Locale {

  // On Construction:
  //  1. look for translations in the locale (e.g. pt-BR) and all parent
  //     locales (e.g. pt), flatten any nested keys, and then merge them.
  //  2. walk through the configs from most specific to least specific
  //     and use the first value for `rtl` and `pluralForm`
  //  3. Default `rtl` to `false`
  //  4. Ensure `pluralForm` is defined
  constructor(id, container) {
    this.id = id;
    this.container = container;
    this.rebuild();
  }

  rebuild() {
    this.translations = getFlattenedTranslations(this.id, this.container);

    walkConfigs(this.id, this.container, (config) => {
      if (this.rtl === undefined) { this.rtl = config.rtl; }
      if (this.pluralForm === undefined) { this.pluralForm = config.pluralForm; }
    });

    if (this.rtl === undefined) { this.rtl = false; }
    if (this.pluralForm === undefined) {
      throw new Error(`No pluralForm found for ${this.id}`);
    }
  }

  getCompiledTemplate(fallbackChain, count) {
    if (this.translations === undefined) { this._init(); }

    let result;
    let i;
    for (i = 0; i < fallbackChain.length; i++) {
      let key = fallbackChain[i];
      if (count != null) {
        const inflection = this.pluralForm(count);
        result = this.translations[`${key}.${inflection}`];
      }

      if (result == null) {
        result = this.translations[key];
      }

      if (Ember.typeOf(result) === 'string') {
        result = this._compileTemplate(key, result);
      }

      if (result) {
        break;
      }
    }

    if (result == null) {
      result = this._defineMissingTranslationTemplate(fallbackChain[0]);
    }

    Ember.assert(`Template for ${fallbackChain[i]} in ${this.id} is not a function`, Ember.typeOf(result) === 'function');

    return result;
  }

  _defineMissingTranslationTemplate(key) {
    const missingMessage = this.container.lookupFactory('util:i18n/missing-message');
    const locale = this.id;

    function missingTranslation(data) { return missingMessage(locale, key, data); }

    missingTranslation._isMissing = true;
    this.translations[key] = missingTranslation;
    return missingTranslation;
  }

  _compileTemplate(key, string) {
    const compile = this.container.lookupFactory('util:i18n/compile-template');
    const template = compile(string, this.rtl);
    this.translations[key] = template;
    return template;
  }
}

function getFlattenedTranslations(id, container) {
  const result = {};

  const parentId = parentLocale(id);
  if (parentId) {
    Ember.merge(result, getFlattenedTranslations(parentId, container));
  }

  const translations = container.lookupFactory(`locale:${id}/translations`) || {};
  Ember.merge(result, withFlattenedKeys(translations));

  return result;
}

// Walk up confiugration objects from most specific to least.
function walkConfigs(id, container, fn) {
  const appConfig = container.lookupFactory(`locale:${id}/config`);
  if (appConfig) { fn(appConfig); }

  const addonConfig = container.lookupFactory(`ember-i18n@config:${id}`);
  if (addonConfig) { fn(addonConfig); }

  const parentId = parentLocale(id);
  if (parentId) { walkConfigs(parentId, container, fn); }
  
  // Fallback to en at the end, so that even if the locale is not conigured no failure will happen
  const enConfig = container.lookupFactory(`ember-i18n@config:en`);
  if (enConfig) { fn(enConfig); }
}

function parentLocale(id) {
  const lastDash = id.lastIndexOf('-');
  return lastDash > 0 ? id.substr(0, lastDash) : null;
}

function withFlattenedKeys(object) {
  const result = {};

  Ember.keys(object).forEach(function(key) {
    var value = object[key];

    if (Ember.typeOf(value) === 'object') {
      value = withFlattenedKeys(value);

      Ember.keys(value).forEach(function(suffix) {
        result[`${key}.${suffix}`] = value[suffix];
      });
    } else {
      result[key] = value;
    }
  });

  return result;
}
