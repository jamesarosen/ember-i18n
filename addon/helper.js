import Ember from "ember";

var Helper = null;

if (Ember.Helper) {
  Helper = Ember.Helper.extend({
    i18n: Ember.inject.service(),

    _locale: Ember.computed.readOnly('i18n.locale'),

    compute: function(params, interpolations) {
      const key = params[0];
      const i18n = this.get('i18n');
      return i18n.t(key, interpolations);
    },

    _recomputeOnLocaleChange: Ember.observer('_locale', function() {
      this.recompute();
    })
  });
}

export default Helper;
