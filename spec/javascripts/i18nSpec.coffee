describe 'SC.I18n', ->

  beforeEach ->
    this.originalTranslations = SC.I18n.translations
    SC.I18n.translations = {
      'foo.bar': 'A Foobar'
      'foo.count': 'All {{count}} Foos'
    }

  afterEach ->
    SC.I18n.translations = this.originalTranslations

  it 'should exist', ->
    expect(SC.I18n).not.toBeUndefined()

  describe '.t', ->

    it 'should translate simple strings', ->
      expect(SC.I18n.t('foo.bar')).toEqual('A Foobar')

    it 'should interpolate', ->
      expect(SC.I18n.t('foo.count', {count: 12 })).toEqual('All 12 Foos')

    it 'should warn about missing translations', ->
      expect(SC.I18n.t('nothing.here')).toEqual('Missing translation: nothing.here')
