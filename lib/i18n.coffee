isTranslatedAttribute = /(.+)Translation$/

inflect = (key, quantity) ->
  return key if not quantity?
  # map between a quantity and a specific translation key
  inflectionMap = 0: 'zero', 1: 'one', many: 'many'
  key += ".#{inflectionMap[quantity] || inflectionMap['many']}"

I18n = {
  compile: Handlebars.compile

  translations: {}

  template: (key) ->
    sc_assert "You must provide a translation key string, not %@".fmt(key), typeof key == 'string'
    result = I18n.translations[key]
    result ?= I18n.translations[key] = I18n.compile "Missing translation: " + key
    unless $.isFunction(result)
      result = I18n.translations[key] = I18n.compile result
    result

  # Returns a string from the translations list
  # Features
  # - interpolation
  #     {{count}} pancakes -> 4 pancakes
  # - inflection (with interpolation)
  #      adds '.zero', '.one', '.many' to translation key
  #      en.crepe      = "Thin pancake"
  #      en.thing.zero = "No things"
  #      en.thing.one  = "One thing"
  #      en.thing.many = "Many things"
  #        OR MAYBE
  #      en.thing.many = "{{count}} {{color}} things"
  #
  # Usage:
  #
  #      t('en.crepe') -> "Thin pancake"
  #      t('en.thing', 0)  -> "No things"
  #      t('en.thing', 1)  -> "One thing"
  #      t('en.thing', { count: 12, color: "blue" }, 12) -> "12 blue things"
  t: (key, context, inflection) ->
    if context? and not isNaN(context)
      inflection = context
      context = null
    template = I18n.template inflect(key, inflection)
    template context

  # A mixin for views that supports ___Translation="some.translation.key".
  #
  # Usage:
  #
  #     {{view ... titleTranslation="some.translation.key"}}
  TranslateableAttributes: SC.Mixin.create
    didInsertElement: ->
      result = @_super.apply(this, arguments)
      for key, path of this
        isTranslatedAttributeMatch = key.match isTranslatedAttribute
        if isTranslatedAttributeMatch
          attribute = isTranslatedAttributeMatch[1]
          translatedValue = I18n.t path
          @$().attr attribute, translatedValue
      result
}

SC.I18n = I18n

isBinding = /(.+)Binding$/

# Much of this code was adapated from Sproutcore's bindAttr helper.
Handlebars.registerHelper 't', (key, options) ->
  context = this
  attrs = options.hash
  view = options.data.view
  tagName = attrs.tagName || 'span'
  delete attrs.tagName

  # Generate a unique id for this element. This will be added as a
  # data attribute to the element so it can be looked up when
  # the bound property changes.
  elementID = "i18n-#{jQuery.uuid++}"

  SC.keys(attrs).forEach (property)->
    isBindingMatch = property.match(isBinding)
    if isBindingMatch
      # Get the current values for any bound properties:
      propertyName = isBindingMatch[1]
      bindPath = attrs[property]
      currentValue = SC.getPath bindPath
      attrs[propertyName] = currentValue

      # Set up an observer for changes:
      invoker = null

      observer = ()->
        newValue = SC.getPath context, bindPath
        elem = view.$ "##{elementID}"

        # If we aren't able to find the element, it means the element
        # to which we were bound has been removed from the view.
        # In that case, we can assume the template has been re-rendered
        # and we need to clean up the observer.
        if elem.length == 0
          SC.removeObserver context, bindPath, invoker
          return

        attrs[propertyName] = newValue
        elem.html I18n.t key, attrs

      invoker = ->
        SC.run.once observer

      SC.addObserver context, bindPath, invoker

  result = '<%@ id="%@">%@</%@>'.fmt tagName, elementID, I18n.t(key, attrs), tagName
  new Handlebars.SafeString result

Handlebars.registerHelper 'translateAttr', (options) ->
  attrs = options.hash
  result = []
  SC.keys(attrs).forEach (property) ->
    translatedValue = I18n.t attrs[property]
    result.push '%@="%@"'.fmt(property, translatedValue)
  new Handlebars.SafeString result.join ' '
