import Ember from "ember";
import Stream from "./stream";
import { readHash } from "./stream";

var helper = null;

if (Ember.Helper == null) {
  // @public
  helper = function tHelper(params, hash, options, env) {
    const i18n = env.data.view.container.lookup('service:i18n');
    const i18nKey = params[0];

    var out = new Stream(function() {
      const value = i18nKey.isStream ? i18nKey.value() : i18nKey;
      return value === undefined ? '' : i18n.t(value, readHash(hash));
    });

    // Once the view is destroyed destroy the steam as well
    env.data.view.one('willDestroyElement', out, function() {
      this.destroy();
    });

    // observe any hash arguments that are streams:
    Object.keys(hash).forEach(function(key) {
      const value = hash[key];

      if (value && value.isStream) {
        value.subscribe(out.notify, out);
      }
    });

    // observe the locale:
    i18n.localeStream.subscribe(out.notify, out);

    // if the i18n key itself is dynamic, observe it:
    if (i18nKey.isStream) {
      i18nKey.subscribe(out.notify, out);
    }

    return out;
  };
}

export default helper;
