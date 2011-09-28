I18n = {
  compile: Handlebars.compile

  translations: {}

  template: (key) ->
    result = I18n.translations[key]
    unless result
      result = I18n.translations[key] = I18n.compile("Missing translation: " + key)
    unless $.isFunction(result)
      result = I18n.translations[key] = I18n.compile(result)
    result

  t: (key, context) ->
    template = I18n.template(key)
    return template(context)
}

SC.I18n = I18n

Handlebars.registerHelper 't', (key, options) ->
  I18n.t key, this
