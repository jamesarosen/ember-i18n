import Ember from "ember";

const htmlSafe = Ember.String.htmlSafe;
const get = Ember.get;
const escapeExpression = Ember.Handlebars.Utils.escapeExpression;
const tripleStache = /\{\{\{\s*(.*?)\s*\}\}\}/g;
const doubleStache = /\{\{\s*(.*?)\s*\}\}/g;

// @public
//
// Compile a translation template.
//
// To override this, define `util:i18n/compile-template` with
// the signature
// `Function(String, Boolean) -> Function(Object) -> String`.
export default function compileTemplate(template, rtl = false) {
  return function renderTemplate(data) {
    const result = template
      .replace(tripleStache, (i, match) => get(data, match))
      .replace(doubleStache, (i, match) => escapeExpression(get(data, match)));

    const wrapped = rtl ? `\u202B${result}\u202C` : result;

    return htmlSafe(wrapped);
  };
}
