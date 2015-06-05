import Ember from "ember";
import helper from "ember-i18n/helper";
import ENV from '../config/environment';

export default {
  name: 'ember-i18n',

  initialize: function(instance) {
    var defaultLocale = (ENV.i18n || {}).defaultLocale;
    if (defaultLocale === undefined) {
      Ember.warn('ember-i18n did not find a default locale; falling back to "en".');
      defaultLocale = 'en';
    }
    instance.container.lookup('service:i18n').set('locale', defaultLocale);

    Ember.HTMLBars._registerHelper('t', helper);
    instance.registry.injection('component', 'i18n', 'service:i18n');
    instance.registry.injection('controller', 'i18n', 'service:i18n');
    instance.registry.injection('route', 'i18n', 'service:i18n');
  }
};
