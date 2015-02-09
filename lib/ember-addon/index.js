'use strict';

var path = require('path');

module.exports = {
  name: 'ember-i18n',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function(app) {
    this._super.included(app);

    this.app.import(app.bowerDirectory + '/ember-i18n/lib/i18n.js', {
      exports: {
        'ember-i18n': [
          'default'
        ]
      }
    });
    this.app.import(app.bowerDirectory + '/ember-i18n/lib/i18n-plurals.js');
  }
};
