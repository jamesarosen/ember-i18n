import Ember from "ember";

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  clickCount: 0,
  dynamicKey: 'no.interpolations',

  actions: {
    increment: function() {
      this.incrementProperty('clickCount');
    },

    changeDynamicKey(newKey) {
      this.set('dynamicKey', newKey);
    },

    switchLocale(locale) {
      this.set('i18n.locale', locale);
    }
  }

});
