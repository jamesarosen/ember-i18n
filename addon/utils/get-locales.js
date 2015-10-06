import Ember from 'ember';

const matchKey = '/locales/(.+)/translations$';

export default function getLocales() {
  return Object.keys(requirejs.entries)
    .reduce((locales, module) => {
      var match = module.match(matchKey);
      if (match) {
        locales.pushObject(match[1]);
      }
      return locales;
    }, Ember.A())
    .sort();
}
