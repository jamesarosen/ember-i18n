import Ember from 'ember';

const matchKey = '/locales/(.+)/translations$';

export default function getLocales() {
  // eslint-disable-next-line no-undef
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
