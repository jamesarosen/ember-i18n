Handlebars.registerHelper 't2', (key, options) ->
  translation = Em.I18n2.TranslationObject.create
    uuid:      Em.I18n2.uuid()
    key:       key
    hbContext: this
    options:   options
  return new Handlebars.SafeString(translation.html)
