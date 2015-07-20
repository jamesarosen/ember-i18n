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
    this._setConfig();
  }

  _setConfig() {
    walkConfigs(this.id, this.container, (config) => {
      if (this.rtl === undefined) { this.rtl = config.rtl; }
      if (this.pluralForm === undefined) { this.pluralForm = config.pluralForm; }
    });

    const defaultConfig = this.container.lookupFactory('ember-i18n@config:zh');

    if (this.rtl === undefined) {
      Ember.warn(`ember-i18n: No RTL configuration found for ${this.id}.`);
      this.rtl = defaultConfig.rtl;
    }

    if (this.pluralForm === undefined) {
      Ember.warn(`ember-i18n: No pluralForm configuration found for ${this.id}.`);
      this.pluralForm = defaultConfig.pluralForm;
    }
  }

  getCompiledTemplate(fallbackChain, count) {
    let translation = this.findTranslation(fallbackChain, count);
    let result = translation.result;

    if (Ember.typeOf(result) === 'string') {
      result = this._compileTemplate(translation.key, result);
    }

    if (result == null) {
      result = this._defineMissingTranslationTemplate(fallbackChain[0]);
    }

    Ember.assert(`Template for ${translation.key} in ${this.id} is not a function`, Ember.typeOf(result) === 'function');

    return result;
  }

  findTranslation(fallbackChain, count) {
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

      if (result) {
        break;
      }
    }

    return {
      key: fallbackChain[i],
      result: result
    };
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
}

function parentLocale(id) {
  const lastDash = id.lastIndexOf('-');
  return lastDash > 0 ? id.substr(0, lastDash) : null;
}

function withFlattenedKeys(object) {
  const result = {};

  Object.keys(object).forEach(function(key) {
    var value = object[key];

    if (Ember.typeOf(value) === 'object') {
      value = withFlattenedKeys(value);

      Object.keys(value).forEach(function(suffix) {
        result[`${key}.${suffix}`] = value[suffix];
      });
    } else {
      result[key] = value;
    }
  });

  return result;
}
