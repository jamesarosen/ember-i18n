import { ZERO, ONE, TWO, FEW, MANY, OTHER } from './constants';

export default {
  rtl: true,

  pluralForm: function(n) {
    const mod100 = n % 100;

    if (n === 0) { return ZERO; }
    if (n === 1) { return ONE; }
    if (n === 2) { return TWO; }
    if (mod100 >= 3 && mod100 <= 10) { return FEW; }
    if (mod100 >= 11 && mod100 <= 99) { return MANY; }
    return OTHER;
  }
};
