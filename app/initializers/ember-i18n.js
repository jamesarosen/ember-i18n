import instanceInitializer from "../instance-initializers/ember-i18n";

export default {
  name: instanceInitializer.name,

  initialize: function(registry, application) {
    if (application.instanceInitializer) { return; }

    instanceInitializer.initialize(application);
  }
};
