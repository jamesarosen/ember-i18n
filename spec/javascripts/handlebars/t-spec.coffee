describe '{{t2}}', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    Em.I18n2.Translations.reopen { foo: 'foo-v' }
    window.Foo = Em.Object.create() # namespace

  follow 'helper with recursion',
    template:     '{{t2 %@}}'
    retrieval:    'view.$().text()'
    needRerender: false

  it 'obeys a custom tag name', ->
    render '{{t2 foo tagName="h2"}}'
    Em.run -> expect(view.$('h2').html()).toEqual 'foo-v'
