mixin Em.I18n2.TranslateableAttributes
  didInsertElement: ->
    result = super.apply(this, arguments)
    for key, path of this
      if match = key.match /^(.+)Translation$/
        @$().attr match[1], Em.I18n2.t(path)
    result
