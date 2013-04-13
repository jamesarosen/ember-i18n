describe 'Em.I18n2.TranslateableAttributes', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    window.Foo = Em.Object.create() # namespace
    Em.I18n2.Translations.reopen { foo: 'foo' }
    Foo.TestView = Em.View.extend Em.I18n2.TranslateableAttributes

  it 'exists', -> expect(Em.I18n2.TranslateableAttributes).toBeDefined()

  it 'translates *Translation attributes', ->
    render '{{view Foo.TestView titleTranslation="foo"}}'
    Em.run -> expect(view.$().children().first().attr('title')).toEqual 'foo'
