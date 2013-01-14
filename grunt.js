/*global module*/

module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'lib/**/*.js', 'spec/**/*Spec.js']
    },

    jshint: {
      options: {
        bitwise:        true,
        curly:          true,
        eqeqeq:         true,
        forin:          true,
        immed:          true,
        indent:         2,
        latedef:        true,
        newcap:         true,
        noarg:          true,
        noempty:        true,
        regexp:         true,
        undef:          true,
        unused:         true,
        strict:         true,
        trailing:       true,
        maxparams:      4,
        maxdepth:       4,
        maxstatements:  40,
        maxcomplexity:  40,
        maxlen:         120,

        eqnull:         true
      }
    },

    clientside: {
      jQuery: {
        main: 'node_modules/jquery/lib/node-jquery.js',
        name: 'jQuery',
        output: 'spec/support/jquery.js'
      },
      Ember: {
        main: 'node_modules/ember/ember.js',
        name: 'Ember',
        output: 'spec/support/ember.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-clientside');

  grunt.registerTask('default', 'lint clientside');

};
