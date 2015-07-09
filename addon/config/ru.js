import { ONE, FEW, MANY, OTHER } from './constants';

export default {
  rtl: false,

  pluralForm: function(n) {
    const mod1 = n % 1;
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod10 === 1 && mod100 !== 11) { return ONE; }
    if (mod1 === 0 && (mod10 >= 2 && mod10 <= 4) && !(mod100 >= 12 && mod100 <= 14)) { return FEW; }
    if (mod1 === 0 && (mod10 === 0 || (mod10 >= 5 && mod10 <= 9) || (mod100 >= 11 && mod100 <= 14))) { return MANY; }
    return OTHER;
  }
};
