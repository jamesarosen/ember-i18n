import { ONE, OTHER } from "./constants";

export default {
  rtl: false,

  pluralForm(n) {
    if (n >= 0 && n < 2) { return ONE; }
    return OTHER;
  }
};
