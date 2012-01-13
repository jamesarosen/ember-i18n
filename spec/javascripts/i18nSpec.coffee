describe 'SC.I18n', ->

  view = null

  render = (template, options = {}) ->
    options.template = SC.Handlebars.compile(template)
    view = SC.View.create(options)
    SC.run ->
      view.append()

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
      'foo.count': 'All {{count}} Foos',
      'foo.save.disabled': 'Saving Foo...'
      'foo.inflect.zero': 'Zero Inflections',
      'foo.inflect.one': 'One Inflection',
      'foo.inflect.many': 'Many Inflections',
      'foo.interpolate-and-inflect.many': '{{count}} Interpolated Inflections'
    }

  afterEach ->
    view.destroy() if view?
    delete window.TestNamespace;
    SC.I18n.translations = this.originalTranslations

  it 'should exist', ->
    expect(SC.I18n).not.toBeUndefined()

  describe '.t', ->

    it 'should translate simple strings', ->
      expect(SC.I18n.t('foo.bar')).toEqual('A Foobar')

    it 'should interpolate', ->
      expect(SC.I18n.t('foo.count', { count: 12 })).toEqual('All 12 Foos')

    it 'should inflect with an empty quantity', ->
      expect(SC.I18n.t('foo.inflect', 0)).toEqual('Zero Inflections')

    it 'should inflect with a singlar quantity', ->
      expect(SC.I18n.t('foo.inflect', 1)).toEqual('One Inflection')

    it 'should inflect with a plural quantity', ->
      expect(SC.I18n.t('foo.inflect', 12)).toEqual('Many Inflections')

    it 'should interpolate and inflect', ->
      quantity = 42
      expect(SC.I18n.t('foo.interpolate-and-inflect', { count: quantity }, quantity)).toEqual("#{quantity} Interpolated Inflections")

    it 'should still work when passing interpolation values to a translation WITHOUT interpolation fields', ->
      expect(SC.I18n.t('foo.inflect', { count: 'Ignore Me' }, 0)).toEqual('Zero Inflections')

    it 'should warn about missing translations', ->
      expect(SC.I18n.t('nothing.here')).toEqual('Missing translation: nothing.here')

  describe '{{t}}', ->

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

  describe '{{{t}}}', ->
    it 'does not over-escape translations', ->
      SC.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>'
      render '<div>{{{t "message.loading"}}}</div>'
      SC.run ->
        expect(view.$('.loading').length).toEqual(1)
        expect(view.$('.loading').text()).toEqual('Loading…')

  describe '{{translateAttr}}', ->

    it 'outputs translated attribute strings', ->
      render '<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}'
      SC.run ->
        expect(view.$('a').attr('title')).toEqual 'A Foobar'
        expect(view.$('a').attr('data-disable-with')).toEqual 'Saving Foo...'

  describe 'TranslatableAttributes', ->

    beforeEach ->
      TestNamespace.TranslateableView = SC.View.extend(SC.I18n.TranslateableAttributes)

    it 'exists', ->
      expect(SC.I18n.TranslateableAttributes).not.toBeUndefined()

    it 'translates ___Translation attributes', ->
      render '{{view TestNamespace.TranslateableView titleTranslation="foo.bar"}}'
      SC.run ->
        expect(view.$().children().first().attr('title')).toEqual("A Foobar")
