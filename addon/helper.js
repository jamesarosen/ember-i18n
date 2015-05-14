import Ember from "ember";
import Stream from "./stream";
import { readHash } from "./stream";

// @public
export default function t(params, hash, options, env) {
  const i18n = env.data.view.container.lookup('service:i18n');
  const i18nKey = params[0];

  var out = new Stream(function() {
    return i18n.t(i18nKey, readHash(hash));
  });

  // observe any hash arguments that are streams:
  Ember.keys(hash).forEach(function(key) {
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
}
