import Ember from "ember";

export default Ember.Controller.extend({

  i18n: Ember.inject.service(),
  clickCount: 0,
  contextClickCount: 0,
  contextWithHashClickCount: 0,
  hashClickCount: 0,

  contextObject: Ember.computed('contextClickCount', function() {
    return {
      clicks: this.get('contextClickCount')
    };
  }),

  contextObjectWithHash: Ember.computed('contextWithHashClickCount', function() {
    return {
      clicks: this.get('contextWithHashClickCount')
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

    incrementContextObjectWithHash() {
      this.incrementProperty('contextWithHashClickCount');
    },

    incrementContextHash() {
      this.incrementProperty('hashClickCount');
    },

    changeDynamicKey(newKey) {
      this.set('dynamicKey', newKey);
    },

    switchLocale(locale) {
      this.set('i18n.locale', locale);
    }
  }

});
