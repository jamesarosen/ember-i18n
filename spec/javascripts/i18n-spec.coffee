describe 'Em.I18n2', ->
  it 'is defined', -> expect(Em.I18n2).toBeDefined()

  describe '#uuid', ->
    it 'increments at each call', ->
      expect(Em.I18n2.uuid()).toEqual(Em.I18n2.uuid()-1)

  describe '#t', ->
    beforeEach ->
      Em.I18n2.Translations.reopen
        foo: 'foo'
        foo_named: 'foo {{name}}'
        foos:
          zero: 'zero foo'
          one: 'one foo'
          other: '{{count}} foos'
        nested:
          bars:
            one: 'one bar'
            other: '{{count}} bars'
        bars_all: '{{count}} bars'
      Em.I18n2.Config.reopen { locale: 'en' }

    afterEach ->
      Em.I18n2.Config.reopen { locale: null }

    it 'translates simple strings', ->
      expect(Em.I18n2.t('foo')).toEqual 'foo'

    it 'interpolates', ->
      expect(Em.I18n2.t('foo_named', { name: 'bar' })).toEqual 'foo bar'

    it 'uses the "zero" form when the language calls for it', ->
      expect(Em.I18n2.t('foos', { count: 0 })).toEqual 'zero foo'

    it 'uses the "one" form when the language calls for it', ->
      expect(Em.I18n2.t('foos', { count: 1 })).toEqual 'one foo'

    it 'interpolates count', ->
      expect(Em.I18n2.t('foos', { count: 21 })).toEqual '21 foos'

    it "works on keys that don't have count suffixes", ->
      expect(Em.I18n2.t('bars_all', { count: 22 })).toEqual '22 bars'

    it 'warns about missing translations', ->
      expect(Em.I18n2.t('missing')).toEqual 'Missing translation: missing'

    it 'works on count within objects', ->
      expect(Em.I18n2.t('nested.bars', { count: 1 })).toEqual 'one bar'
      expect(Em.I18n2.t('nested.bars', { count: 2 })).toEqual '2 bars'
