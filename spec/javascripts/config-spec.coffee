describe 'Em.I18n.Config', ->
  afterEach -> Em.I18n.Config.reopen { translationsKey: 'object' }

  it 'is defined', -> expect(Em.I18n.Config).toBeDefined()

  it 'is customizable', ->
    Em.I18n.Config.reopen { translationsKey: 'dot' }
    expect(Em.I18n.Config.get 'translationsKey').toEqual 'dot'
