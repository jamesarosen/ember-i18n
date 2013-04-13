describe '{{t2}}', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      foo_named: 'foo {{name}}'
      bar: '{{count}} bars'
      parent: 'parent and {{string}}'
      childA: 'childA {{valA}}'
      childB: 'childB {{valB}} {{valC}}'
      childC: 'childC {{valC}}'
      '1': 'one'
    window.Foo = Em.Object.create() # namespace
    Foo.TestView = Em.View.extend Em.I18n2.TranslateableAttributes

  it 'outputs simple translated strings', ->
    render '{{t2 foo}}'
    Em.run -> expect(view.$().text()).toEqual 'foo-v'

  it 'interpolates string as translations', ->
    render '{{t2 parent string="foo"}}'
    Em.run -> expect(view.$().text()).toEqual 'parent and foo-v'

  it "interpolates 'no translate' string as values", ->
    render '{{t2 parent string="!t foo"}}'
    Em.run -> expect(view.$().text()).toEqual 'parent and foo'

  it 'interpolates number as literals', ->
    render '{{t2 bar count="2"}}'
    Em.run -> expect(view.$().text()).toEqual '2 bars'

  it 'interpolates "translate" number as translations', ->
    render '{{t2 parent string="t 1"}}'
    Em.run -> expect(view.$().text()).toEqual 'parent and one'

  it 'interpolates bindings', ->
    Em.run -> Foo.set 'count', 3
    render '{{t2 bar countBinding="Foo.count"}}'
    Em.run -> expect(view.$().text()).toEqual '3 bars'

  it 'interpolates bindings over translations', ->
    render '{{t2 parent string="foo" stringBinding="view.baz"}}', { baz: 'bar' }
    Em.run -> expect(view.$().text()).toEqual 'parent and bar'

  describe 'recursive interpolation', ->

    describe 'translations', ->
      it 'interpolates recursively', ->
        render '{{t2 parent string="childA" valA="foo"}}'
        Em.run -> expect(view.$().text()).toEqual 'parent and childA foo-v'

      it 'applies same interpolation to same keys', ->
        render '{{t2 parent string="childB" valB="childC" valC="foo"}}'
        Em.run -> expect(view.$().text())
          .toEqual 'parent and childB childC foo-v foo-v'

    describe 'literals', ->
      it 'interpolates recursively', ->
        render '{{t2 parent string="childA" valA="123"}}'
        Em.run -> expect(view.$().text()).toEqual 'parent and childA 123'

      it 'applies same interpolation to same keys', ->
        render '{{t2 parent string="childB" valB="childC" valC="123"}}'
        Em.run -> expect(view.$().text())
          .toEqual 'parent and childB childC 123 123'

    describe 'bindings', ->
      it 'interpolates recursively', ->
        render '{{t2 parent string="childA" valABinding="view.foo"}}', { foo: 'baz'}
        Em.run -> expect(view.$().text()).toEqual 'parent and childA baz'

      it 'applies same interpolation to same keys', ->
        render '{{t2 parent string="childB" valB="childC" valCBinding="view.foo"}}', { foo: 'baz' }
        Em.run -> expect(view.$().text())
          .toEqual 'parent and childB childC baz baz'

      it 'responds to updates on bound properties', ->
        Em.run -> Foo.set 'count', 3
        render '{{t2 parent string="childA" valABinding="Foo.count"}}'
        Em.run -> Foo.set 'count', 4
        Em.run -> expect(view.$().text()).toEqual 'parent and childA 4'

      it 'does not error due to bound properties during a rerender', ->
        Em.run -> Foo.set 'count', 3
        render '{{t2 parent string="childA" valABinding="Foo.count"}}'
        expect( ->
          Em.run -> view.rerender(); Foo.set 'count', 4
        ).not.toThrow()

      it 'responds to updates on bound properties after a rerender', ->
        Em.run -> Foo.set 'count', 3
        render '{{t2 parent string="childA" valABinding="Foo.count"}}'
        Em.run -> view.rerender(); Foo.set 'count', 4
        Em.run -> expect(view.$().text()).toEqual 'parent and childA 4'

  it 'obeys a custom tag name', ->
    render '{{t2 foo tagName="h2"}}'
    Em.run -> expect(view.$('h2').html()).toEqual 'foo-v'

  it 'handles interpolations from contextual keywords', ->
    render '{{t2 foo_named nameBinding="view.foo"}}', { foo: 'baz' }
    Em.run -> expect(view.$().text()).toEqual 'foo baz'

  it 'responds to updates on bound keyword properties', ->
    render '{{t2 foo_named nameBinding="view.foo"}}', { foo: 'baz' }
    Em.run -> expect(view.$().text()).toEqual 'foo baz'
    Em.run -> view.set 'foo', 'quux'
    Em.run -> expect(view.$().text()).toEqual 'foo quux'
