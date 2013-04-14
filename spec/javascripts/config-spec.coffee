describe 'Em.I18n.Config', ->
  afterEach -> Em.I18n.Config.reopen { locale: null }

  it 'is defined', -> expect(Em.I18n.Config).toBeDefined()

  it 'is customizable', ->
    Em.I18n.Config.reopen { locale: 'foo' }
    expect(Em.I18n.Config.get 'locale').toEqual 'foo'
