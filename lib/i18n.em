class i18n
  _uuid: 0
  uuid: ->
    @incrementProperty '_uuid'
    @_uuid

  resolveKey: (key, count) ->
    return key if !count? || !(locale = Em.I18n.Config.locale)
    suffix = CLDR.pluralForm(count, locale)
    keyWithCount = "#{key}.#{suffix}"
    return key if !Em.I18n.Translations.get(keyWithCount)?
    keyWithCount

  getTemplate: (rawKey, count) ->
    key = @resolveKey rawKey, count
    if (translation = Em.I18n.Translations.get(key))?
      translation
    else
      "Missing translation: #{key}"

  t: (key, context = {}) ->
    msg = "You must provide a string translation key, not #{typeof key}"
    Em.assert msg, typeof key == 'string'
    Handlebars.compile(@getTemplate(key, context.count))(context)

Em.I18n = i18n.create()
