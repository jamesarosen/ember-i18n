class translations
  get: (key) ->
    if Em.I18n.Config*.translationsKey == 'dot' && key.indexOf('.') != -1
      this[key]
    else
      super(key)

Em.I18n.Translations = translations.create()
