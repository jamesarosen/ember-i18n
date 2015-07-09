import { ONE, OTHER } from "./constants";

export default {
  rtl: false,

  pluralForm: function(n) {
    if (n === 0) { return ONE; }
    if (n === 1) { return ONE; }
    return OTHER;
  }
};
