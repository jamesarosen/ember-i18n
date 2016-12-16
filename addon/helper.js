import Ember from "ember";

const { get, inject, Helper, Object: EmberObject, observer } = Ember;

function mergedContext(objectContext, hashContext) {
  return EmberObject.extend({
    unknownProperty(key) {
      const fromHash = get(hashContext, key);
      return fromHash === undefined ? get(objectContext, key) : fromHash;
    }
  }).create();
}

export default Helper.extend({
  i18n: inject.service(),

  compute([key, contextObject = {}, ...rest], interpolations) {
    const mergedInterpolations = mergedContext(contextObject, interpolations);

    const i18n = get(this, 'i18n');
    return i18n.t(key, mergedInterpolations);
  },

  _recomputeOnLocaleChange: observer('i18n.locale', function() {
    this.recompute();
  })
});
