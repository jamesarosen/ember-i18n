class Em.I18n.TranslationObject
  uuid:           null   # uuid part of element id
  key:            null   # translation key
  interpolations: null   # interpolations needed for current template
  view:           null   # view bindings will bind to this view
  hbContext:      null   # context of handlebars
  options:        null   # "options" data hash from handlebars
  attr:           null   # used in attrVal. name of attr to set.

  context:        null   # rendering context
  tagName:        'span' # default tag name
  format:         null   # 'html' or 'text'

  init: ->
    @tagName          = @options.hash.tagName if @options.hash?.tagName?
    @interpolations ||= @options.hash
    @view           ||= @options.data.view
    @context        ||= {}
    super.apply(this, arguments)

  html: ~>
    @format = 'html'
    "<#{@tagName} data-ember-i18n-#{@uuid}='#{@uuid}'>#{@value}</#{@tagName}>"

  attrVal: ~>
    @format = 'text'
    "data-ember-i18n-#{@uuid}='#{@uuid}' #{@attr}='#{@value}'"

  text: ~>
    @format = 'text'
    @value

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
    Em.I18n.t(@key, @context)

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
    nPath = Em.Handlebars.normalizePath(@hbContext, value, @options.data)
    { root, path } = nPath

    observer = =>
      if @view.get('state') != 'inDOM'
        if @isView value
          root.removeObserver path, this, invoker
        else
          Em.removeObserver root, path, invoker
        return
      @context[property] = @hbGet(@hbContext, value, @options)
      $e = @view.$("[data-ember-i18n-#{@uuid}]")
      switch @format
        when 'html'    then $e.html Em.I18n.t(@key, @context)
        when 'attrVal' then $e.attr @attr, Em.I18n.t(@key, @context)
    invoker = -> Em.run.once(observer)
    if @isView value
      root.addObserver path, this, invoker
    else
      Em.addObserver root, path, invoker

  interpolateTranslation: (property, key) ->
    template = Em.I18n.getTemplate key, { count: @options.hash.count }
    interpolations = @getInterpolations template
    child = Em.I18n.TranslationObject.create
      uuid:           Em.I18n.uuid()
      key:            key
      interpolations: interpolations # limit to prevent inf. loop
      view:           @view          # preserve top level view bindings
      hbContext:      @hbContext
      options:        @options
    @context[property] = new Handlebars.SafeString(child.get(@format))

  interpolateLiteral: (property, value) ->
    @context[property] = value
