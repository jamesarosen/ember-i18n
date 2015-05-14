import Ember from "ember";
import Stream from "./stream";
import Locale from "./locale";
import eachTranslatedAttribute from "./each-translated-attribute";

const get = Ember.get;

// @public
export default Ember.Object.extend(Ember.Evented, {

  // @public
  // The user's locale.
  locale: 'en',

  // @public
  //
  // Returns the translation `key` interpolated with `data`
  // in the current `locale`.
  t: function(key, data = {}) {
    const locale = this.get('_locale');
    Ember.assert("I18n: Cannot translate when locale is null", locale);

    const template = locale.getCompiledTemplate(key, get(data, 'count'));

    if (template._isMissing) {
      this.trigger('missing', this.get('locale'), key, data);
    }

    return template(data);
  },

  // @public
  //
  // Iterates over the keys in `object`, calling `fn` for each
  // key of the form `fooTranslation`. The arguments passed will be
  // the key minus the `Translation` suffix and the translation of
  // the value, if present.
  eachTranslatedAttribute: function(object, fn) {
    eachTranslatedAttribute(this, object, fn);
  },

  // @public
  addTranslations: function() {
    throw new Error("I18nService.prototype.addTranslations is not yet implemented");
  },

  _locale: Ember.computed('locale', function() {
    return new Locale(this.get('locale'), this.container);
  }),

  _buildLocaleStream: Ember.on('init', function() {
    this.localeStream = new Stream(() => {
      return this.get('locale');
    });
  }),

  _notifyLocaleStream: Ember.observer('locale', function() {
    this.localeStream.value(); // force the stream to be dirty
    this.localeStream.notify();
  })

});
