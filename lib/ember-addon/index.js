'use strict';

var path = require('path');

module.exports = {
  name: 'ember-i18n',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  config: function(env, config) {
    return {
      EmberENV: {
        FEATURES: {
          I18N_COMPILE_WITHOUT_HANDLEBARS: true,
          I18N_TRANSLATE_HELPER_SPAN: false
        }
      }
    }
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
