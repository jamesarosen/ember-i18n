describe 'Em.I18n.TranslateableAttributes', ->
  bootstrap()

  beforeEach ->
    Em.I18n.Translations.reopen { foo: 'foo' }
    Foo.TestView = Em.View.extend Em.I18n.TranslateableAttributes

  it 'exists', -> expect(Em.I18n.TranslateableAttributes).toBeDefined()

  it 'translates *Translation attributes', ->
    render '{{view Foo.TestView titleTranslation="foo"}}'
    Em.run -> expect(Foo.View.$().children().first().attr('title')).toEqual 'foo'
