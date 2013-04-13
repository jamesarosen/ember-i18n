class i18n
  _uuid: 0
  uuid: ->
    @incrementProperty '_uuid'
    @_uuid

  resolveKey: (key, count) ->
    return key if !count? || !(locale = Em.I18n2.Config.locale)
    suffix = CLDR.pluralForm(count, locale)
    keyWithCount = "#{key}.#{suffix}"
    return key if !Em.I18n2.Translations.get(keyWithCount)?
    keyWithCount

Em.I18n2 = i18n.create()
