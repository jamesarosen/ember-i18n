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

  t: (rawKey, context = {}) ->
    msg = "You must provide a string translation key, not #{typeof rawKey}"
    Em.assert msg, typeof rawKey == 'string'

    key = @resolveKey rawKey, context.count
    template =
      if (translation = Em.I18n2.Translations.get(key))?
        Handlebars.compile translation
      else
        Handlebars.compile "Missing translation: #{key}"
    template(context)

Em.I18n2 = i18n.create()
