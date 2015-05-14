import instanceInitializer from "./instance-initializer";

export default {
  name: instanceInitializer.name,

  initialize: function(registry, application) {
    if (application.instanceInitializer) { return; }

    instanceInitializer.initialize(application);
  }
};
