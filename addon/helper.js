import Ember from "ember";

const { assign, get, inject, Helper, observer } = Ember;

export default Ember.Helper.extend({
  i18n: inject.service(),

  compute([key, interpolationHash = {}, ...rest], interpolations) {
    assign(interpolations, interpolationHash);
    
    const i18n = get(this, 'i18n');
    return i18n.t(key, interpolations);
  },

  _recomputeOnLocaleChange: observer('i18n.locale', function() {
    this.recompute();
  })
});
