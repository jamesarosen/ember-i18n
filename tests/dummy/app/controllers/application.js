import Ember from "ember";
import $ from "jquery";
import { translationMacro as t } from "ember-i18n";

export default Ember.Controller.extend({

  clickCount: 0,

  lastMissingTranslation: null,

  locales: Ember.A([
    { name: 'English', code: 'en' },
    { name: 'Backwards English', code: 'en-bw' },
    { name: 'Pseudo-English', code: 'en-ps' },
    { name: 'English with Zero', code: 'en-wz' },
    { name: 'Spanish', code: 'es' }
  ]),

  tMacroProperty: t('dynamic.interpolations', { clicks: 'clickCount' }),

  _onMissingTranslation: function(locale, key) {
    this.set('lastMissingTranslation', `${locale}/${key}`);
  },

  _alertOnMissingTranslations: Ember.on('init', function() {
    this._onMissingTranslation = $.proxy(this._onMissingTranslation, this);

    this.i18n.on('missing', this._onMissingTranslation);
  }),

  _cleanUp: Ember.on('willDestroy', function() {
    this.i18n.off('missing', this._onMissingTranslation);
  }),

  actions: {
    increment: function() {
      this.incrementProperty('clickCount');
    }
  }

});
