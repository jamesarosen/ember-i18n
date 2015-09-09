import Ember from "ember";
import legacyHelper from "ember-i18n/legacy-helper";
import ENV from '../config/environment';

export default {
  name: 'ember-i18n',

  initialize: function(instance) {
    var defaultLocale = (ENV.i18n || {}).defaultLocale;
    if (defaultLocale === undefined) {
      Ember.warn('ember-i18n did not find a default locale; falling back to "en".');
      defaultLocale = 'en';
    }
    const key = 'service:i18n';
    const i18n = instance.lookup ? instance.lookup(key) : instance.container.lookup(key);
    i18n.set('locale', defaultLocale);

    if (legacyHelper != null) {
      Ember.HTMLBars._registerHelper('t', legacyHelper);
    }
  }
};
