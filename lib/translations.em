class translations
  get: (key) ->
    value = this[key] || super(key)
    return undefined if typeof value == 'object'
    value

Em.I18n.Translations = translations.create()
