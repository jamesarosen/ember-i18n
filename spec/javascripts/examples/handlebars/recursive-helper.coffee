example 'helper with recursion', ({ template, retrieval, needRerender }) ->
  # using evals in expectations. can't get either call() or apply() to work

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
      'foo bar': 'foo-bar-v'
    window.Foo = Em.Object.create() # namespace

  it 'supports basic syntax', ->
    render template.fmt('foo')
    Em.run -> expect(eval(retrieval)).toEqual 'foo-v'

  it 'supports keys with space', ->
    render template.fmt('"foo bar"')
    Em.run -> expect(eval(retrieval)).toEqual 'foo-bar-v'

  it 'interpolates string as translations', ->
    render template.fmt('parent string="foo"')
    Em.run -> expect(eval(retrieval)).toEqual 'parent and foo-v'

  it "interpolates 'no translate' string as values", ->
    render template.fmt('parent string="!t foo"')
    Em.run -> expect(eval(retrieval)).toEqual 'parent and foo'

  it 'interpolates number as literals', ->
    render template.fmt('bar count="2"')
    Em.run -> expect(eval(retrieval)).toEqual '2 bars'

  it 'interpolates "translate" number as translations', ->
    render template.fmt('parent string="t 1"')
    Em.run -> expect(eval(retrieval)).toEqual 'parent and one'

  it 'interpolates bindings', ->
    Em.run -> Foo.set 'count', 3
    render template.fmt('bar countBinding="Foo.count"')
    Em.run -> expect(eval(retrieval)).toEqual '3 bars'

  it 'interpolates bindings over translations', ->
    render template.fmt('parent string="foo" stringBinding="view.baz"'), { baz: 'bar' }
    Em.run -> expect(eval(retrieval)).toEqual 'parent and bar'

  describe 'recursive interpolation', ->

    describe 'translations', ->
      it 'interpolates recursively', ->
        render template.fmt('parent string="childA" valA="foo"')
        Em.run -> expect(eval(retrieval)).toEqual 'parent and childA foo-v'

      it 'applies same interpolation to same keys', ->
        render template.fmt('parent string="childB" valB="childC" valC="foo"')
        Em.run -> expect(eval(retrieval))
          .toEqual 'parent and childB childC foo-v foo-v'

    describe 'literals', ->
      it 'interpolates recursively', ->
        render template.fmt('parent string="childA" valA="123"')
        Em.run -> expect(eval(retrieval)).toEqual 'parent and childA 123'

      it 'applies same interpolation to same keys', ->
        render template.fmt('parent string="childB" valB="childC" valC="123"')
        Em.run -> expect(eval(retrieval))
          .toEqual 'parent and childB childC 123 123'

    describe 'bindings', ->
      it 'interpolates recursively', ->
        render template.fmt('parent string="childA" valABinding="view.foo"'), { foo: 'baz'}
        Em.run -> expect(eval(retrieval)).toEqual 'parent and childA baz'

      it 'applies same interpolation to same keys', ->
        render template.fmt('parent string="childB" valB="childC" valCBinding="view.foo"'), { foo: 'baz' }
        Em.run -> expect(eval(retrieval))
          .toEqual 'parent and childB childC baz baz'

      unless needRerender
        it 'responds to updates on bound properties', ->
          Em.run -> Foo.set 'count', 3
          render template.fmt('parent string="childA" valABinding="Foo.count"')
          Em.run -> Foo.set 'count', 4
          Em.run -> expect(eval(retrieval)).toEqual 'parent and childA 4'

      it 'does not error due to bound properties during a rerender', ->
        Em.run -> Foo.set 'count', 3
        render template.fmt('parent string="childA" valABinding="Foo.count"')
        expect( ->
          Em.run -> view.rerender(); Foo.set 'count', 4
        ).not.toThrow()

      it 'responds to updates on bound properties after a rerender', ->
        Em.run -> Foo.set 'count', 3
        render template.fmt('parent string="childA" valABinding="Foo.count"')
        Em.run -> view.rerender(); Foo.set 'count', 4
        Em.run -> expect(eval(retrieval)).toEqual 'parent and childA 4'

  it 'handles interpolations from contextual keywords', ->
    render template.fmt('foo_named nameBinding="view.foo"'), { foo: 'baz' }
    Em.run -> expect(eval(retrieval)).toEqual 'foo baz'

  it 'responds to updates on bound keyword properties', ->
    render template.fmt('foo_named nameBinding="view.foo"'), { foo: 'baz' }
    Em.run -> expect(eval(retrieval)).toEqual 'foo baz'
    Em.run ->
      view.rerender() if needRerender
      view.set 'foo', 'quux'
    Em.run -> expect(eval(retrieval)).toEqual 'foo quux'
