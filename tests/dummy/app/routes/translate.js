import Ember from "ember";

export default Ember.Route.extend({

  i18n: Ember.inject.service(),

  model: function(params) {
    return params.locale;
  },

  afterModel: function(locale) {
    this.set('i18n.locale', locale);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('dynamicKey', 'no.interpolations');
  }

});
