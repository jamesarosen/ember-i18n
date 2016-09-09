import Ember from "ember";
import Stream from './stream';
import legacyHelper from "./helper";

// Used for Ember < 1.13
export default {
  name: 'ember-i18n-legacy-helper',

  initialize(registry) {
    const i18n = registry.lookup('service:i18n');

    i18n.localeStream = new Stream(function() {
      return i18n.get('locale');
    });

    Ember.addObserver(i18n, 'locale', i18n, function() {
      this.localeStream.value(); // force the stream to be dirty
      this.localeStream.notify();
    });

    Ember.HTMLBars._registerHelper('t', legacyHelper);
  }
};
