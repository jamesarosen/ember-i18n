import instanceInitializer from "../instance-initializers/ember-i18n";

export default {
  name: instanceInitializer.name,

  initialize: function() {
    var application = arguments[1] || arguments[0];
    if (application.instanceInitializer) { return; }

    instanceInitializer.initialize(application);
  }
};
