import Ember from "ember";

export default Ember.Route.extend({

  i18n: Ember.inject.service(),

  model: function(params) {
    return params.locale;
  },

  afterModel: function(locale) {
    this.set('i18n.locale', locale);
    this.set('dynamicKey', 'no.interpolations');
  }

});
