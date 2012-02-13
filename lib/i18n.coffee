isTranslatedAttribute = /(.+)Translation$/

# If we're on Ember 0.9.4 or later, we need the Ember.Handlebars
# version of getPath, which knows how to look up globals properly.
getPath = Ember.Handlebars.getPath || Ember.getPath

pluralForm = CLDR.pluralForm if CLDR?

ember_assert("Could not find CLDR.pluralForm. You can find it at https://github.com/jamesarosen/CLDR.js", pluralForm?)

findTemplate = (key, setOnMissing) ->
  ember_assert("You must provide a translation key string, not %@".fmt(key), typeof key is 'string')
  result = I18n.translations[key]
  if setOnMissing
    result ?= I18n.translations[key] = I18n.compile "Missing translation: " + key
  if result? and not $.isFunction(result)
    result = I18n.translations[key] = I18n.compile result
  result

I18n = {
  compile: Handlebars.compile

  translations: {}

  template: (key, count) ->
    if count?
      suffix = pluralForm count
      interpolatedKey = "%@.%@".fmt key, suffix
      result = findTemplate(interpolatedKey, false)
    result ?= findTemplate(key, true)

  # Returns a string from the translations list
  # Features
  # - interpolation
  #     {{count}} pancakes -> 4 pancakes
  # - inflection (with interpolation)
  #      adds '.zero', '.one', '.two', '.few', '.many', and '.other' to
  #      translation key:
  #
  #      en.crepe      = "Thin pancake"
  #      en.thing.zero = "No things"
  #      en.thing.one  = "One {{color}} thing"
  #      en.thing.other = "{{count}} {{color}} things"
  #
  # Usage:
  #
  #      t('en.crepe') -> "Thin pancake"
  #      t('en.thing', { count: 0 })  -> "No things"
  #      t('en.thing', { count: 1, color: "purple" })  -> "One purple thing"
  #      t('en.thing', { count: 12, color: "blue" }) -> "12 blue things"
  t: (key, context = {}) ->
    template = I18n.template key, context.count
    template context

  # A mixin for views that supports ___Translation="some.translation.key".
  #
  # Usage:
  #
  #     {{view ... titleTranslation="some.translation.key"}}
  TranslateableAttributes: Em.Mixin.create
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

# DEPRECATE: The use of SC.I18n is being deprecated.
SC.I18n = I18n

Em.I18n = I18n
Ember.I18n = I18n

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

  Em.keys(attrs).forEach (property)->
    isBindingMatch = property.match(isBinding)
    if isBindingMatch
      # Get the current values for any bound properties:
      propertyName = isBindingMatch[1]
      bindPath = attrs[property]
      currentValue = getPath bindPath
      attrs[propertyName] = currentValue

      # Set up an observer for changes:
      invoker = null

      observer = ()->
        newValue = getPath context, bindPath
        elem = view.$ "##{elementID}"

        # If we aren't able to find the element, it means the element
        # to which we were bound has been removed from the view.
        # In that case, we can assume the template has been re-rendered
        # and we need to clean up the observer.
        if elem.length == 0
          Em.removeObserver context, bindPath, invoker
          return

        attrs[propertyName] = newValue
        elem.html I18n.t key, attrs

      invoker = ->
        Em.run.once observer

      Em.addObserver context, bindPath, invoker

  result = '<%@ id="%@">%@</%@>'.fmt tagName, elementID, I18n.t(key, attrs), tagName
  new Handlebars.SafeString result

Handlebars.registerHelper 'translateAttr', (options) ->
  attrs = options.hash
  result = []
  Em.keys(attrs).forEach (property) ->
    translatedValue = I18n.t attrs[property]
    result.push '%@="%@"'.fmt(property, translatedValue)
  new Handlebars.SafeString result.join ' '
