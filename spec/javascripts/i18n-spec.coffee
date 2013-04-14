describe 'Em.I18n', ->
  beforeEach ->
    Em.I18n.Translations.reopen
      foo: 'foo-v'
      foo_named: 'foo {{name}}'
      foos:
        one: 'one foo'
        other: '{{count}} foos'
      nested:
        bars:
          one: 'one bar'
          other: '{{count}} bars'
      bars_all: '{{count}} bars'
      empty: ''
    Em.I18n.Config.reopen { locale: 'en' }

  afterEach ->
    Em.I18n.Config.reopen { locale: null }

  it 'is defined', -> expect(Em.I18n).toBeDefined()

  describe '#uuid', ->
    it 'increments at each call', ->
      expect(Em.I18n.uuid()).toEqual(Em.I18n.uuid()-1)

  describe '#resolveKey', ->
    it 'resolves translation key based on locale + count', ->
      expect(Em.I18n.resolveKey('foos', 1)).toEqual 'foos.one'
      expect(Em.I18n.resolveKey('foos', 2)).toEqual 'foos.other'

    it 'resolves to base if count not given', ->
      expect(Em.I18n.resolveKey('foos')).toEqual 'foos'

    it 'resolves to base if count object not defined', ->
      expect(Em.I18n.resolveKey('foo', 1)).toEqual 'foo'

    it 'resolves to base if locale not defined', ->
      Em.I18n.Config.reopen { locale: null }
      expect(Em.I18n.resolveKey('foos', 1)).toEqual 'foos'

  describe '#getTemplate', ->
    it 'delegates to #resolveKey for pluralization', ->
      spyOn(Em.I18n, 'resolveKey').andCallThrough()
      Em.I18n.getTemplate('foo')
      expect(Em.I18n.resolveKey).toHaveBeenCalled()

    it 'returns translation template', ->
      expect(Em.I18n.getTemplate('foo_named')).toEqual 'foo {{name}}'

    it 'works with empty template', ->
      expect(Em.I18n.getTemplate('empty')).toEqual ''

    it 'warns about missing translations', ->
      expect(Em.I18n.getTemplate('missing'))
        .toEqual 'Missing translation: missing'

  describe '#t', ->
    it 'throws on non-string keys', ->
      expect(-> Em.I18n.t(1)).toThrow()

    it 'translates simple strings', ->
      expect(Em.I18n.t('foo')).toEqual 'foo-v'

    it 'interpolates', ->
      expect(Em.I18n.t('foo_named', { name: 'bar' })).toEqual 'foo bar'

    it 'uses the "one" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 1 })).toEqual 'one foo'

    it 'uses the "other" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 2 })).toEqual '2 foos'

    it 'interpolates count', ->
      expect(Em.I18n.t('foos', { count: 21 })).toEqual '21 foos'

    it "works on keys that don't have count suffixes", ->
      expect(Em.I18n.t('bars_all', { count: 22 })).toEqual '22 bars'

    it 'works on count within objects', ->
      expect(Em.I18n.t('nested.bars', { count: 1 })).toEqual 'one bar'
      expect(Em.I18n.t('nested.bars', { count: 2 })).toEqual '2 bars'
