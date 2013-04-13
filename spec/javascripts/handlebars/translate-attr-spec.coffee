describe '{{translateAttr2}}', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      bar: 'bar-v'
    window.Foo = Em.Object.create() # namespace

  follow 'helper with recursion',
    template:     '<a {{translateAttr2 title %@}}></a>'
    retrieval:    "view.$('a').attr('title')"
    needRerender: true

  it 'supports multiple-declaration syntax', ->
    render '<a {{translateAttr2 title="foo" data-bar="bar"}}></a>'
    Em.run ->
      expect(view.$('a').attr('title')).toEqual 'foo-v'
      expect(view.$('a').data('bar')).toEqual 'bar-v'

  it 'supports multiple instances on same tag', ->
    render '<a {{translateAttr2 title="foo"}} {{translateAttr2 data-bar="bar"}}></a>'
    Em.run ->
      expect(view.$('a').attr('title')).toEqual 'foo-v'
      expect(view.$('a').data('bar')).toEqual 'bar-v'
