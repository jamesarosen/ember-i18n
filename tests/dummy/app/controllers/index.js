import Ember from "ember";

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  clickCount: 0,
  contextClickCount: 0,

  contextObject: Ember.computed('contextClickCount', function() {
    return {
      clicks: this.get('contextClickCount')
    };
  }),

  dynamicKey: 'no.interpolations',

  actions: {
    increment: function() {
      this.incrementProperty('clickCount');
    },

    incrementContextObject() {
      this.incrementProperty('contextClickCount');
    },

    changeDynamicKey(newKey) {
      this.set('dynamicKey', newKey);
    },

    switchLocale(locale) {
      this.set('i18n.locale', locale);
    }
  }

});
