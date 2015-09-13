import Ember from "ember";
import Stream from "../stream";
import Locale from "../utils/locale";
import addTranslations from "../utils/add-translations";
import getLocales from "../utils/get-locales";

const { assert, computed, get, Evented, makeArray, observer, on, typeOf, warn } = Ember;
const Parent = Ember.Service || Ember.Object;

// @public
export default Parent.extend(Evented, {

  // @public
  // The user's locale.
  locale: null,

  // @public
  // A list of found locales.
  locales: computed(getLocales),

  // @public
  //
  // Returns the translation `key` interpolated with `data`
  // in the current `locale`.
  t: function(key, data = {}) {
    const locale = this.get('_locale');
    assert("I18n: Cannot translate when locale is null", locale);
    const count = get(data, 'count');

    const defaults = makeArray(get(data, 'default'));

    defaults.unshift(key);
    const template = locale.getCompiledTemplate(defaults, count);

    if (template._isMissing) {
      this.trigger('missing', this.get('locale'), key, data);
    }

    return template(data);
  },

  // @public
  exists: function(key, data = {}) {
    const locale = this.get('_locale');
    assert("I18n: Cannot check existance when locale is null", locale);
    const count = get(data, 'count');

    const translation = locale.findTranslation(makeArray(key), count);
    return typeOf(translation.result) !== 'undefined';
  },

  // @public
  addTranslations: function(locale, translations) {
    addTranslations(locale, translations, this.container);
    this._addLocale(locale);

    if (this.get('locale').indexOf(locale) === 0) {
      this.get('_locale').rebuild();
    }
  },

  // @private
  _initDefaults: on('init', function() {
    const ENV = this.container.lookupFactory('config:environment');

    if (this.get('locale') == null) {
      var defaultLocale = (ENV.i18n || {}).defaultLocale;
      if (defaultLocale == null) {
        warn('ember-i18n did not find a default locale; falling back to "en".');
        defaultLocale = 'en';
      }
      this.set('locale', defaultLocale);
    }
  }),

  // @private
  //
  // adds a runtime locale to the array of locales on disk
  _addLocale(locale) {
    this.get('locales').addObject(locale);
  },

  _locale: computed('locale', function() {
    const locale = this.get('locale');
    return locale ? new Locale(this.get('locale'), this.container) : null;
  }),

  _buildLocaleStream: on('init', function() {
    this.localeStream = new Stream(() => {
      return this.get('locale');
    });
  }),

  _notifyLocaleStream: observer('locale', function() {
    this.localeStream.value(); // force the stream to be dirty
    this.localeStream.notify();
  })

});
