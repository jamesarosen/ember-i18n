describe 'Em.I18n', ->

  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile(template)
    view = Em.View.create(options)
    Em.run ->
      view.append()

  beforeEach ->
    window.TestNamespace = Em.Object.create({
      toString: "TestNamespace"

      count: ((property, value)->
        return value
      ).property().cacheable()
    })

    this.originalTranslations = Em.I18n.translations
    Em.I18n.translations = {
      'foo.bar': 'A Foobar'
      'foo.bar.named': 'A Foobar named {{name}}'
      'foo.save.disabled': 'Saving Foo...'

      'foos.zero': 'No Foos'
      'foos.one': 'One Foo'
      'foos.other': 'All {{count}} Foos'

      'bars.all': 'All {{count}} Bars'

      baz: {
        qux: 'A qux appears'
      }

      fum: {
        one: 'A fum'
        other: '{{count}} fums'
      }
    }

    CLDR.defaultLanguage = 'ksh' # has zero, one, and many

  afterEach ->
    view.destroy() if view?
    delete window.TestNamespace
    Em.I18n.translations = this.originalTranslations
    CLDR.defaultLanguage = null

  it 'should exist', ->
    expect(Em.I18n).not.toBeUndefined()

  describe '.t', ->

    it 'translates simple strings', ->
      expect(Em.I18n.t('foo.bar')).toEqual('A Foobar')

    it 'interpolates', ->
      expect(Em.I18n.t('foo.bar.named', { name: 'Sue' })).toEqual('A Foobar named Sue')

    it 'uses the "zero" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 0 })).toEqual('No Foos')

    it 'uses the "one" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 1 })).toEqual('One Foo')

    it 'interpolates count', ->
      expect(Em.I18n.t('foos', { count: 21 })).toEqual('All 21 Foos')

    it "works on keys that don't have count suffixes", ->
      expect(Em.I18n.t('bars.all', { count: 532 })).toEqual('All 532 Bars')

    it 'warns about missing translations', ->
      expect(Em.I18n.t('nothing.here')).toEqual('Missing translation: nothing.here')

    describe 'using nested objects', ->
      it 'works with a simple case', ->
        expect(Em.I18n.t('baz.qux')).toEqual('A qux appears')

      it 'works with counts', ->
        expect(Em.I18n.t('fum', { count: 1 })).toEqual('A fum')
        expect(Em.I18n.t('fum', { count: 2 })).toEqual('2 fums')

  describe '{{t}}', ->

    it 'outputs simple translated strings', ->
      render '{{t foo.bar}}'
      Em.run ->
        expect(view.$().text()).toEqual('A Foobar')

    it 'interpolates values', ->
      render '{{t bars.all count="597"}}'
      Em.run ->
        expect(view.$().text()).toEqual('All 597 Bars')

    it 'interpolates bindings', ->
      Em.run ->
        TestNamespace.set 'count', 3
      render '{{t bars.all countBinding="TestNamespace.count"}}'
      Em.run ->
        expect(view.$().text()).toEqual('All 3 Bars')

    it 'responds to updates on bound properties', ->
      Em.run ->
        TestNamespace.set 'count', 3
      render '{{t bars.all countBinding="TestNamespace.count"}}'
      Em.run ->
        TestNamespace.set 'count', 4
      Em.run ->
        expect(view.$().text()).toEqual('All 4 Bars')

    it 'does not error due to bound properties during a rerender', ->
      Em.run ->
        TestNamespace.set 'count', 3
      render '{{t bars.all countBinding="TestNamespace.count"}}'
      expect ->
        Em.run ->
          view.rerender()
          TestNamespace.set 'count', 4
      .not.toThrow()

    it 'responds to updates on bound properties after a rerender', ->
      Em.run ->
        TestNamespace.set 'count', 3
      render '{{t bars.all countBinding="TestNamespace.count"}}'
      Em.run ->
        view.rerender()
        TestNamespace.set 'count', 4
      Em.run ->
        expect(view.$().text()).toEqual('All 4 Bars')

    it 'obeys a custom tag name', ->
      render '{{t foo.bar tagName="h2"}}'
      Em.run ->
        expect(view.$('h2').html()).toEqual('A Foobar')

    it 'handles interpolations from contextual keywords', ->
      render '{{t foo.bar.named nameBinding="view.favouriteBeer" }}',
              { favouriteBeer: 'IPA' }
      Em.run ->
        expect(view.$().text()).toEqual('A Foobar named IPA')

    it 'responds to updates on bound keyword properties', ->
      render '{{t foo.bar.named nameBinding="view.favouriteBeer"}}',
              { favouriteBeer: 'Lager' }
      expect(view.$().text()).toEqual('A Foobar named Lager')
      Em.run ->
        view.set 'favouriteBeer', 'IPA'
      Em.run ->
        expect(view.$().text()).toEqual('A Foobar named IPA')

  describe '{{{t}}}', ->
    it 'does not over-escape translations', ->
      Em.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>'
      render '<div>{{{t "message.loading"}}}</div>'
      Em.run ->
        expect(view.$('.loading').length).toEqual(1)
        expect(view.$('.loading').text()).toEqual('Loading…')

  describe '{{translateAttr}}', ->

    it 'outputs translated attribute strings', ->
      render '<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}'
      Em.run ->
        expect(view.$('a').attr('title')).toEqual 'A Foobar'
        expect(view.$('a').attr('data-disable-with')).toEqual 'Saving Foo...'

  describe 'TranslatableAttributes', ->

    beforeEach ->
      TestNamespace.TranslateableView = Em.View.extend(Em.I18n.TranslateableAttributes)

    it 'exists', ->
      expect(Em.I18n.TranslateableAttributes).not.toBeUndefined()

    it 'translates ___Translation attributes', ->
      render '{{view TestNamespace.TranslateableView titleTranslation="foo.bar"}}'
      Em.run ->
        expect(view.$().children().first().attr('title')).toEqual("A Foobar")
