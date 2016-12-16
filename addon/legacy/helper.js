import Stream from "./stream";
import { readHash } from "./stream";
import Ember from 'ember';

const assign = Ember.assign || Ember.merge;

export default function tHelper([i18nKey, contextObject = { value: () => {} }], hash, options, env) {
  const i18n = env.data.view.container.lookup('service:i18n');



  var out = new Stream(function() {
    const value = i18nKey.isStream ? i18nKey.value() : i18nKey;

    const contextObjectValue = contextObject.value();
    const mergedHash = {};
    assign(mergedHash, contextObjectValue);
    assign(mergedHash, hash);

    return value === undefined ? '' : i18n.t(value, readHash(mergedHash));
  });

  // Once the view is destroyed destroy the steam as well
  env.data.view.one('willDestroyElement', out, function() {
    this.destroy();
  });

  if (contextObject && contextObject.isStream) {
    contextObject.subscribe(out.notify, out);
  }

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
}
