// @public
//
// Generate a "missing template" message that will be used
// as a translation.
//
// To override this, define `util:i18n/missing-message` with
// the signature
//
// `Function(String, String, Object) -> String`.
export default function missingMessage(locale, key /*, data */) {
  return `Missing translation: ${key}`;
}
