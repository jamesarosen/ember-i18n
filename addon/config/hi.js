import { ONE, OTHER } from "./constants";

export default {
  pluralForm: function(n) {
    if(n === 0) { return ONE; }
    if(n === 1) { return ONE; }
    return OTHER;
  }
};
