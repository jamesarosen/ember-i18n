# Tests should fail if we're using deprecated APIs or relying on deprecated
# behaviour.
Em.ENV.RAISE_ON_DEPRECATION = true

describe 'Em.I18n', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  Handlebars.registerHelper 'question', (value) -> "#{value}?"

  beforeEach ->
    window.TestNamespace = (Em.Object.extend
      toString: 'TestNamespace'
      count: ( (property, value) -> value ).property().cacheable()
    ).create()

    @originalTranslations = Em.I18n.translations

    Em.I18n.translations =
      foo: 'Foo'
      'foo.bar': 'A Foobar'
      'foo.bar.named': 'A Foobar named {{name}}'
      'foos.zero': 'No Foos'
      'foos.one': 'One Foo'
      'foos.other': 'All {{count}} Foos'
      'foo.withHelper': '{{question count}}'
      'bars.all': 'All {{count}} Bars'
      baz:
        qux: 'A qux appears'

      fum:
        one: 'A fum'
        other: '{{count}} fums'

      'parent': 'String and {{string}}'
      'childA': 'ChildA {{valA}}'
      'childB': 'ChildB {{valB}} {{valC}}'
      'childC': 'ChildC {{valC}}'
      '1': 'one'

    CLDR.defaultLanguage = 'ksh';

  afterEach ->
    windowMeta = Em.meta window
    view.destroy() if view
    delete window.TestNamespace
    # TODO: not very pretty: is there not a better way to reset meta?
    delete windowMeta[key] for key, _ of windowMeta
    Em.merge windowMeta, Em.EMPTY_META
    Em.I18n.translations = @originalTranslations
    CLDR.defaultLanguage = null

  it 'exists', -> expect(Em.I18n).toBeDefined()

  describe '#t', ->
    it 'translates simple strings', ->
      expect(Em.I18n.t('foo.bar')).toEqual 'A Foobar'

    it 'interpolates', ->
      expect(Em.I18n.t('foo.bar.named', { name: 'Sue' }))
        .toEqual 'A Foobar named Sue'

    it 'uses the "zero" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 0 })).toEqual 'No Foos'

    it 'uses the "one" form when the language calls for it', ->
      expect(Em.I18n.t('foos', { count: 1 })).toEqual 'One Foo'

    it 'interpolates count', ->
      expect(Em.I18n.t('foos', { count: 21 })).toEqual 'All 21 Foos'

    it "works on keys that don't have count suffixes", ->
      expect(Em.I18n.t('bars.all', { count: 532 })).toEqual 'All 532 Bars'

    it 'warns about missing translations', ->
      expect(Em.I18n.t('nth.here')).toEqual 'Missing translation: nth.here'

    describe 'using nested objects', ->
      it 'works with a simple case', ->
        expect(Em.I18n.t('baz.qux')).toEqual 'A qux appears'

      it 'works with counts', ->
        expect(Em.I18n.t('fum', { count: 1 })).toEqual 'A fum'
        expect(Em.I18n.t('fum', { count: 2 })).toEqual '2 fums'

  describe '{{t}}', ->
    it 'outputs simple translated strings', ->
      render '{{t foo.bar}}'
      Em.run -> expect(view.$().text()).toEqual 'A Foobar'

    it 'interpolates string as translations', ->
      render '{{t parent string="foo.bar"}}'
      Em.run -> expect(view.$().text()).toEqual 'String and A Foobar'

    it "interpolates 'no translate' string as values", ->
      render '{{t parent string="!t foo.bar"}}'
      Em.run -> expect(view.$().text()).toEqual 'String and foo.bar'

    it 'interpolates number as literals', ->
      render '{{t bars.all count="597"}}'
      Em.run -> expect(view.$().text()).toEqual 'All 597 Bars'

    it 'interpolates "translate" number as translations', ->
      render '{{t parent string="t 1"}}'
      Em.run -> expect(view.$().text()).toEqual 'String and one'

    it 'interpolates bindings', ->
      Em.run -> TestNamespace.set 'count', 3
      render '{{t bars.all countBinding="TestNamespace.count"}}'
      Em.run -> expect(view.$().text()).toEqual 'All 3 Bars'

    it 'interpolates bindings over translations', ->
      render '{{t parent string="foo.bar" stringBinding="view.foo"}}', { foo: 'bar' }
      Em.run -> expect(view.$().text()).toEqual 'String and bar'

    describe 'recursive interpolation', ->

      describe 'translations', ->
        it 'interpolates recursively', ->
          render '{{t parent string="childA" valA="foo.bar"}}'
          Em.run -> expect(view.$().text()).toEqual 'String and ChildA A Foobar'

        it 'applies same interpolation to same keys', ->
          render '{{t parent string="childB" valB="childC" valC="foo.bar"}}'
          Em.run -> expect(view.$().text())
            .toEqual 'String and ChildB ChildC A Foobar A Foobar'

      describe 'literals', ->
        it 'interpolates recursively', ->
          render '{{t parent string="childA" valA="123"}}'
          Em.run -> expect(view.$().text()).toEqual 'String and ChildA 123'

        it 'applies same interpolation to same keys', ->
          render '{{t parent string="childB" valB="childC" valC="123"}}'
          Em.run -> expect(view.$().text())
            .toEqual 'String and ChildB ChildC 123 123'

      describe 'bindings', ->
        it 'interpolates recursively', ->
          render '{{t parent string="childA" valABinding="view.foo"}}', { foo: 'bar'}
          Em.run -> expect(view.$().text()).toEqual 'String and ChildA bar'

        it 'applies same interpolation to same keys', ->
          render '{{t parent string="childB" valB="childC" valCBinding="view.foo"}}', { foo: 'bar' }
          Em.run -> expect(view.$().text())
            .toEqual 'String and ChildB ChildC bar bar'

        it 'responds to updates on bound properties', ->
          Em.run -> TestNamespace.set 'count', 3
          render '{{t parent string="childA" valABinding="TestNamespace.count"}}'
          Em.run -> TestNamespace.set 'count', 4
          Em.run -> expect(view.$().text()).toEqual 'String and ChildA 4'

        it 'does not error due to bound properties during a rerender', ->
          Em.run -> TestNamespace.set 'count', 3
          render '{{t parent string="childA" valABinding="TestNamespace.count"}}'
          expect( ->
            Em.run -> view.rerender(); TestNamespace.set 'count', 4
          ).not.toThrow()

        it 'responds to updates on bound properties after a rerender', ->
          Em.run -> TestNamespace.set 'count', 3
          render '{{t parent string="childA" valABinding="TestNamespace.count"}}'
          Em.run -> view.rerender(); TestNamespace.set 'count', 4
          Em.run -> expect(view.$().text()).toEqual 'String and ChildA 4'

    it 'obeys a custom tag name', ->
      render '{{t foo.bar tagName="h2"}}'
      Em.run -> expect(view.$('h2').html()).toEqual 'A Foobar'

    it 'handles interpolations from contextual keywords', ->
      render '{{t foo.bar.named nameBinding="view.foo"}}', { foo: 'bar' }
      Em.run -> expect(view.$().text()).toEqual 'A Foobar named bar'

    it 'responds to updates on bound keyword properties', ->
      render '{{t foo.bar.named nameBinding="view.foo"}}', { foo: 'bar' }
      Em.run -> expect(view.$().text()).toEqual 'A Foobar named bar'
      Em.run -> view.set 'foo', 'baz'
      Em.run -> expect(view.$().text()).toEqual 'A Foobar named baz'

  describe '{{{t}}}', ->
    it 'does not over-escape translations', ->
      Em.I18n.translations['message.load'] = '<span class="load">...</span>'
      render '<div>{{{t message.load}}}</div>'
      Em.run ->
        expect(view.$('.load').length).toEqual 1
        expect(view.$('.load').text()).toEqual '...'

    it 'supports translation templates that use helpers registered with Handlebars', ->
      render '{{t foo.withHelper count=3}}'
      Em.run ->
        expect(view.$().text()).toEqual '3?'

  describe '{{translateAttr}}', ->
    it 'outputs translated attribute strings', ->
      render '<a {{translateAttr title="foo.bar" data-foo="foo"}}></a>'
      Em.run ->
        expect(view.$('a').attr('title')).toEqual 'A Foobar'
        expect(view.$('a').data('foo')).toEqual 'Foo'

  describe 'TranslateableAttributes', ->
    beforeEach ->
      TestNamespace.TranslateableView = Em.View.extend Em.I18n.TranslateableAttributes

    it 'exists', -> expect(Em.I18n.TranslateableAttributes).toBeDefined()

    it 'translates *Translation attributes', ->
      render '{{view TestNamespace.TranslateableView titleTranslation="foo.bar"}}'
      Em.run -> expect(view.$().children().first().attr('title')).toEqual 'A Foobar'
