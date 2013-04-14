Handlebars.registerHelper 't', (key, options) ->
  translation = Em.I18n.TranslationObject.create
    uuid:      Em.I18n.uuid()
    key:       key
    hbContext: this
    options:   options
  return new Handlebars.SafeString(translation.html)
