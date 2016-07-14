import { ONE, OTHER } from "./constants";

export default {
  rtl: false,
  defaultPluralForm: OTHER,

  pluralForm: function(n) {
    if (n === 1) { return ONE; }
    return this.defaultPluralForm;
  }
};
