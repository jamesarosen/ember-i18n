import instanceInitializer from "../instance-initializers/ember-i18n";

export default {
  name: instanceInitializer.name,

  initialize: function() {
    const application = arguments[1] || arguments[0]; // depending on Ember version
    if (application.instanceInitializer) { return; }

    instanceInitializer.initialize(application);
  }
};
