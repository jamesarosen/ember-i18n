Handlebars.registerHelper 'translateAttr2', (attr, key, options) ->
  if typeof attr == 'object'
    options = attr
    [hash, options.hash] = [options.hash, {}]
    attrVals = for eachAttr, eachKey of hash
      translation = Em.I18n2.TranslationObject.create
        uuid:      Em.I18n2.uuid()
        key:       eachKey
        hbContext: this
        options:   options
        attr:      eachAttr
      translation.attrVal
    return new Handlebars.SafeString(attrVals.join(' '))

  translation = Em.I18n2.TranslationObject.create
    uuid:      Em.I18n2.uuid()
    key:       key
    hbContext: this
    options:   options
    attr:      attr
  return new Handlebars.SafeString(translation.attrVal)
