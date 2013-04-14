class translations
  get: (key) ->
    this[key] || super(key)

Em.I18n.Translations = translations.create()
