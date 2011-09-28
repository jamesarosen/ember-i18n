describe 'SC.I18n', ->

  beforeEach ->
    window.TestNamespace = SC.Object.create({
      toString: "TestNamespace"

      count: ((property, value)->
        return value
      ).property().cacheable()
    })

    this.originalTranslations = SC.I18n.translations
    SC.I18n.translations = {
      'foo.bar': 'A Foobar'
      'foo.count': 'All {{count}} Foos'
    }

  afterEach ->  
    delete window.TestNamespace;
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

    it 'interpolates values', ->
      render '{{t foo.count count="597"}}'
      SC.run ->
        expect(view.$().text()).toEqual('All 597 Foos')

    it 'interpolates bindings', ->
      SC.run ->
        TestNamespace.set 'count', 3
      render '{{t foo.count countBinding="TestNamespace.count"}}'
      SC.run ->
        expect(view.$().text()).toEqual('All 3 Foos')

    it 'responds to updates on bound properties', ->
      SC.run ->
        TestNamespace.set 'count', 3
      render '{{t foo.count countBinding="TestNamespace.count"}}'
      SC.run ->
        TestNamespace.set 'count', 4
      SC.run ->
        expect(view.$().text()).toEqual('All 4 Foos')

    it 'obeys a custom tag name', ->
      render '{{t foo.bar tagName="h2"}}'
      SC.run ->
        expect(view.$('h2').html()).toEqual('A Foobar')
