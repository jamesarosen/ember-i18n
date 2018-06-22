/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-i18n',
  isLocalizationFramework: true,

  init() {
    this._super.init && this._super.init.apply(this, arguments);
  },
  treeFor() {
    return this._super.treeFor.apply(this, arguments);
  }
};
