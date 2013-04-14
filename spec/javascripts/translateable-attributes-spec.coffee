describe 'Em.I18n2.TranslateableAttributes', ->
  bootstrap()

  beforeEach ->
    Em.I18n2.Translations.reopen { foo: 'foo' }
    Foo.TestView = Em.View.extend Em.I18n2.TranslateableAttributes

  it 'exists', -> expect(Em.I18n2.TranslateableAttributes).toBeDefined()

  it 'translates *Translation attributes', ->
    render '{{view Foo.TestView titleTranslation="foo"}}'
    Em.run -> expect(Foo.View.$().children().first().attr('title')).toEqual 'foo'
