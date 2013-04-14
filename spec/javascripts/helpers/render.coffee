window.render = (template, options = {}) ->
  options.template = Em.Handlebars.compile template
  Foo.View = Em.View.create(options)
  Em.run -> Foo.View.append()
