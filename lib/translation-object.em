class Em.I18n2.TranslationObject
  uuid:           null   # uuid part of element id
  key:            null   # translation key
  interpolations: null   # interpolations needed for current template
  view:           null   # view bindings will bind to this view
  hbContext:      null   # context of handlebars
  options:        null   # "options" data hash from handlebars

  context:        null   # rendering context
  tagName:        'span' # default tag name

  init: ->
    @tagName          = @options.hash.tagName if @options.hash?.tagName?
    @interpolations ||= @options.hash
    @view           ||= @options.data.view
    @context        ||= {}
    super.apply(this, arguments)

  html: ~>
    "<#{@tagName} data-ember-i18n-#{@uuid}='#{@uuid}'>#{@value}</#{@tagName}>"

  # helpers

  value: ~>
    for attr, value of @interpolations
      if match = @isBind(attr)
        # binding
        @interpolateBind match[1], value
      else if !@context["#{attr}Binding"]?
        isTranslate = @isTranslate(value)
        isNumber  = @isNumber(value)
        isLiteral = @isLiteral(value)
        if isTranslate || (!isNumber && !isLiteral) || (isNumber && isLiteral)
          # translation
          @interpolateTranslation attr, (isTranslate?[1] || value)
        else
          # literal
          @interpolateLiteral attr, (isLiteral?[1] || value)
    Em.I18n2.t(@key, @context)

  # cannot use *Binding suffix
  isBind:      (str) -> str.match /^(.+)Binding$/
  isTranslate: (str) -> str.match /^t (.+)$/
  isLiteral:   (str) -> str.match /^!t (.+)$/
  isNumber:    (str) -> !isNaN(parseFloat(str)) && isFinite(str)
  isView:      (str) -> str.match /^view\.(.+)$/

  matchInterpolations: (str) ->
    interpolation = /{{([^}]+)}}/g
    match[1] while match = interpolation.exec(str)

  getInterpolations: (template) ->
    interpolations = {}
    for interpolation in @matchInterpolations template
      if (binding = @options.hash["#{interpolation}Binding"])?
        interpolations["#{interpolation}Binding"] = binding
      else
        interpolations[interpolation] = @options.hash[interpolation]
    interpolations

  hbGet: Em.Handlebars.get || Em.Handlebars.getPath || Em.getPath # shorthand

  # cannot use *Binding suffix
  interpolateBind: (property, value) ->
    @context[property] = @hbGet(@hbContext, value, @options)
    nPath = Em.Handlebars.normalizePath(this, value, @options.data)
    { root, path } = nPath
    if @isView(value) then root = @view

    observer = =>
      if @view.get('state') != 'inDOM'
        root.removeObserver path, this, invoker
        return
      @context[property] = @hbGet(@hbContext, value, @options)
      $e = @view.$("[data-ember-i18n-#{@uuid}]")
      $e.html Em.I18n2.t(@key, @context)
    invoker = -> Em.run.once(observer)
    root.addObserver path, this, invoker

  interpolateTranslation: (property, key) ->
    template = Em.I18n2.getTemplate key, { count: @options.hash.count }
    interpolations = @getInterpolations template
    child = Em.I18n2.TranslationObject.create
      uuid:           Em.I18n2.uuid()
      key:            key
      interpolations: interpolations # limit to prevent inf. loop
      view:           @view          # preserve top level view bindings
      hbContext:      @hbContext
      options:        @options
    @context[property] = new Handlebars.SafeString(child.html)

  interpolateLiteral: (property, value) ->
    @context[property] = value
