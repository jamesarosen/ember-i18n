import Ember from "ember";
import helper from "./helper";

export default {
  name: 'ember-i18n',

  initialize: function(instance) {
    Ember.HTMLBars._registerHelper('t', helper);
    instance.registry.injection('component', 'i18n', 'service:i18n');
    instance.registry.injection('controller', 'i18n', 'service:i18n');
  }
};
