class translations
  get: (key) ->
    if Em.I18n2.Config*.translationsKey == 'dot' && key.indexOf('.') != -1
      this[key]
    else
      super(key)

Em.I18n2.Translations = translations.create()
