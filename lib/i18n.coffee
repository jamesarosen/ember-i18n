isTranslatedAttribute = /(.+)Translation$/

# If we're on Ember 0.9.4 or later, we need the Ember.Handlebars
# version of get, which knows how to look up globals properly.
# If we're on Ember 1.0.0-pre2 or later, we need to use `Ember.Handlbars.get`
# instead. `Ember.Handlebars.getPath` was deprecated. 
get = Ember.Handlebars.get || Ember.Handlebars.getPath || Ember.getPath

pluralForm = CLDR.pluralForm if CLDR?

Ember.Logger.warn "CLDR.pluralForm not found. Em.I18n will not support count-based inflection." unless pluralForm?

lookupKey = (key, hash) ->
  result = hash[key]
  idx = key.indexOf('.')
  if !result and idx != -1
    firstKey = key.substr(0, idx)
    remainingKeys = key.substr(idx + 1)
    hash = hash[firstKey]
    result = lookupKey(remainingKeys, hash) if hash
  result

# If we're on pre-1.0 versions of Ember, we need ember_assert; otherwise use Ember.assert to avoid deprecation warnings.
assert = if Ember.assert? then Ember.assert else ember_assert

findTemplate = (key, setOnMissing) ->
  assert("You must provide a translation key string, not %@".fmt(key), typeof key is 'string')
  result = lookupKey(key, I18n.translations)
  if setOnMissing
    result ?= I18n.translations[key] = I18n.compile "Missing translation: " + key
  if result? and not jQuery.isFunction(result)
    result = I18n.translations[key] = I18n.compile result
  result

I18n = {
  compile: Handlebars.compile

  translations: {}

  template: (key, count) ->
    if count? && pluralForm?
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

Em.I18n = I18n
Ember.I18n = I18n

isBinding = /(.+)Binding$/

# Much of this code was adapated from Sproutcore's bindAttr helper.
Handlebars.registerHelper 't', (key, options) ->
  context = this
  attrs = options.hash
  data = options.data
  view = data.view
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
      currentValue = get context, bindPath, options
      attrs[propertyName] = currentValue

      # Set up an observer for changes:
      invoker = null

      normalized = Ember.Handlebars.normalizePath context, bindPath, data
      [root, normalizedPath] = [normalized.root, normalized.path]

      observer = ()->
        # The view is being rerendered or has been destroyed. In the former case
        # the observer will be added back, and in the latter it should be
        # removed permanently.
        if view.get('state') isnt 'inDOM'
          Em.removeObserver root, normalizedPath, invoker
          return

        newValue = get context, bindPath, options
        elem = view.$ "##{elementID}"

        attrs[propertyName] = newValue
        elem.html I18n.t key, attrs

      invoker = ->
        Em.run.once observer

      Em.addObserver root, normalizedPath, invoker

  result = '<%@ id="%@">%@</%@>'.fmt tagName, elementID, I18n.t(key, attrs), tagName
  new Handlebars.SafeString result

Handlebars.registerHelper 'translateAttr', (options) ->
  attrs = options.hash
  result = []
  Em.keys(attrs).forEach (property) ->
    translatedValue = I18n.t attrs[property]
    result.push '%@="%@"'.fmt(property, translatedValue)
  new Handlebars.SafeString result.join ' '
