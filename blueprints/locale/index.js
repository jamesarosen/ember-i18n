module.exports = {
  description: 'Generates new i18n locale directory with config and translations files.',

  beforeInstall: function(options) {
    if (options.args.length < 2) {
      throw new Error("ember-i18n locale generator requires a locale name.");
    }

    const locale = options.args[1];

    if (!/^[a-zA-Z0-9-]+$/.test(locale)) {
      throw new Error(locale + ' is not a valid locale name.');
    }
  }
};
