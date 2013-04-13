describe 'Em.I18n2.Translations', ->
  afterEach ->
    Em.I18n2.Config.reopen { translationsKey: 'object' }

  it 'is defined', -> expect(Em.I18n2.Translations).toBeDefined()

  it 'supports simple keys', ->
    Em.I18n2.Translations.reopen { foo: 'bar' }
    expect(Em.I18n2.Translations.get('foo')).toEqual 'bar'

  it 'supports object keys by default', ->
    Em.I18n2.Translations.reopen { foo: { bar: 'baz' } }
    expect(Em.I18n2.Translations.get('foo.bar')).toEqual 'baz'

  it 'supports dot keys with config', ->
    Em.I18n2.Config.reopen { translationsKey: 'dot' }
    Em.I18n2.Translations.reopen { 'foo.bar': 'bar' }
    expect(Em.I18n2.Translations.get('foo.bar')).toEqual 'bar'
