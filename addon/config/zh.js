import { OTHER } from './constants';

export default {
  rtl: false,
  defaultPluralForm: OTHER,

  pluralForm: function(/* n */) {
    return this.defaultPluralForm;
  }
};
