import { ONE, FEW, MANY, OTHER } from "./constants";

/*
 * This configuration for Slovak language has been defined according to this document
 * http://www.unicode.org/cldr/charts/29/supplemental/language_plural_rules.html#sk
 */
export default {
  rtl: false,
  defaultPluralForm: OTHER,

  pluralForm: function(n) {
    const absN = Math.abs(n);

    if (absN === 1) { return ONE; }
    if (absN >= 2 && absN <= 4) { return FEW; }
    // check if number contains fractional part
    if (absN % 1 > 0) { return MANY; }

    return this.defaultPluralForm;
  }
};
