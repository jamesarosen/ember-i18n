import Ember from "ember";
import legacyHelper from "ember-i18n/legacy-helper";
import ENV from '../config/environment';

export default {
  name: 'ember-i18n',

  initialize: function(instance) {
    if (legacyHelper != null) {
      Ember.HTMLBars._registerHelper('t', legacyHelper);
    }
  }
};
