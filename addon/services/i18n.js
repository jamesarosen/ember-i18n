import Ember from "ember";
import Locale from "../utils/locale";
import addTranslations from "../utils/add-translations";
import getLocales from "../utils/get-locales";

const { assert, computed, get, Evented, makeArray, on, typeOf, warn, getOwner } = Ember;
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
  t(key, data = {}) {
    Ember.deprecate('locale is a reserved attribute', data['locale'] === undefined, {
      id: 'ember-i18n.reserve-locale',
      until: '5.0.0'
    });

    Ember.deprecate('htmlSafe is a reserved attribute', data['htmlSafe'] === undefined, {
      id: 'ember-i18n.reserve-htmlSafe',
      until: '5.0.0'
    });

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
  exists(key, data = {}) {
    const locale = this.get('_locale');
    assert("I18n: Cannot check existance when locale is null", locale);
    const count = get(data, 'count');

    const translation = locale.findTranslation(makeArray(key), count);
    return typeOf(translation.result) !== 'undefined' && !translation.result._isMissing;
  },

  // @public
  addTranslations(locale, translations) {
    addTranslations(locale, translations, getOwner(this));
    this._addLocale(locale);

    if (this.get('locale').indexOf(locale) === 0) {
      this.get('_locale').rebuild();
    }
  },

  // @private
  _initDefaults: on('init', function() {
    const ENV = getOwner(this)._lookupFactory('config:environment');

    if (this.get('locale') == null) {
      var defaultLocale = (ENV.i18n || {}).defaultLocale;
      if (defaultLocale == null) {
        warn('ember-i18n did not find a default locale; falling back to "en".', false, {
          id: 'ember-i18n.default-locale'
        });

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

    return locale ? new Locale(this.get('locale'), getOwner(this)) : null;
  })
});
