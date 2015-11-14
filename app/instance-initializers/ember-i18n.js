import Ember from "ember";
import Stream from 'ember-i18n/stream';
import legacyHelper from "ember-i18n/legacy-helper";
import ENV from '../config/environment';

export default {
  name: 'ember-i18n',

  initialize(appOrAppInstance) {
    if (legacyHelper != null) {
      // Used for Ember < 1.13
      const i18n = appOrAppInstance.container.lookup('service:i18n');

      i18n.localeStream = new Stream(function() {
        return i18n.get('locale');
      });

      Ember.addObserver(i18n, 'locale', i18n, function() {
        this.localeStream.value(); // force the stream to be dirty
        this.localeStream.notify();
      });

      Ember.HTMLBars._registerHelper('t', legacyHelper);
    }
  }
};
