/* globals require */
import { A } from '@ember/array';

const matchKey = '/locales/(.+)/translations$';

export default function getLocales() {
  return Object.keys(require.entries)
    .reduce((locales, module) => {
      var match = module.match(matchKey);
      if (match) {
        locales.pushObject(match[1]);
      }
      return locales;
    }, A())
    .sort();
}
