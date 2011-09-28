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

  describe '{{t}}', ->

    view = null

    render = (template, options = {}) ->
      options.template = SC.Handlebars.compile(template)
      view = SC.View.create(options)
      SC.run ->
        view.append()

    afterEach ->
      view.destroy() if view?

    it 'outputs simple translated strings', ->
      render '{{t foo.bar}}'
      SC.run ->
        expect(view.$().text()).toEqual('A Foobar')

    it 'interpolates', ->
      render '{{t foo.count count="597"}}'
      SC.run ->
        expect(view.$().text()).toEqual('All 597 Foos')
