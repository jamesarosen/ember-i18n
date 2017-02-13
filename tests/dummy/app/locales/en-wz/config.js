export default {
  pluralForm(count) {
    if (count === 0) { return 'zero'; }
    if (count === 1) { return 'one'; }
    return 'other';
  }
};
