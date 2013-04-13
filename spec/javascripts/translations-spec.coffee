describe 'Em.I18n2.Translations', ->
  it 'is defined', -> expect(Em.I18n2.Translations).toBeDefined()

  it 'supports simple keys', ->
    Em.I18n2.Translations.reopen { foo: 'bar' }
    expect(Em.I18n2.Translations.get('foo')).toEqual 'bar'

  it 'supports dot keys', ->
    Em.I18n2.Translations.reopen { 'foo.bar': 'bar' }
    console.log Em.I18n2.Translations
    expect(Em.I18n2.Translations.get('foo.bar')).toEqual 'bar'

  it 'supports object keys', ->
    Em.I18n2.Translations.reopen { foo: { bar: 'baz' } }
    expect(Em.I18n2.Translations.get('foo.bar')).toEqual 'baz'
