describe '{{translateAttr2}}', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      foo2: 'foo2-v'
      foo_named: 'foo {{name}}'
      bar: '{{count}} bars'
      parent: 'parent and {{string}}'
      childA: 'childA {{valA}}'
      childB: 'childB {{valB}} {{valC}}'
      childC: 'childC {{valC}}'
      '1': 'one'
      'foo bar': 'foo-bar-v'
    window.Foo = Em.Object.create() # namespace

  it 'outputs translated attribute strings', ->
    render '<a {{translateAttr2 title="foo" data-foo="foo2"}}></a>'
    Em.run ->
      expect(view.$('a').attr('title')).toEqual 'foo-v'
      expect(view.$('a').data('foo')).toEqual 'foo2-v'

  it 'supports multiple instances on same tag', ->
    render '<a {{translateAttr2 title="foo"}} {{translateAttr2 data-foo="foo2"}}></a>'
    Em.run ->
      expect(view.$('a').attr('title')).toEqual 'foo-v'
      expect(view.$('a').data('foo')).toEqual 'foo2-v'

  ##### repetition starts here

  it 'supports naked long form syntax', ->
    render '<a {{translateAttr2 title foo}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'foo-v'

  it 'supports keys with space', ->
    render '<a {{translateAttr2 title "foo bar"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'foo-bar-v'

  it 'interpolates string as translations', ->
    render '<a {{translateAttr2 title parent string="foo"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and foo-v'

  it "interpolates 'no translate' string as values", ->
    render '<a {{translateAttr2 title parent string="!t foo"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and foo'

  it 'interpolates number as literals', ->
    render '<a {{translateAttr2 title bar count="2"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual '2 bars'

  it 'interpolates "translate" number as translations', ->
    render '<a {{translateAttr2 title parent string="t 1"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and one'

  it 'interpolates bindings', ->
    Em.run -> Foo.set 'count', 3
    render '<a {{translateAttr2 title bar countBinding="Foo.count"}}></a>'
    Em.run -> expect(view.$('a').attr('title')).toEqual '3 bars'

  it 'interpolates bindings over translations', ->
    render '<a {{translateAttr2 title parent string="foo" stringBinding="view.baz"}}></a>', { baz: 'bar' }
    Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and bar'

  describe 'recursive interpolation', ->

    describe 'translations', ->
      it 'interpolates recursively', ->
        render '<a {{translateAttr2 title parent string="childA" valA="foo"}}></a>'
        Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and childA foo-v'

      it 'applies same interpolation to same keys', ->
        render '<a {{translateAttr2 title parent string="childB" valB="childC" valC="foo"}}></a>'
        Em.run -> expect(view.$('a').attr('title'))
          .toEqual 'parent and childB childC foo-v foo-v'

    describe 'literals', ->
      it 'interpolates recursively', ->
        render '<a {{translateAttr2 title parent string="childA" valA="123"}}></a>'
        Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and childA 123'

      it 'applies same interpolation to same keys', ->
        render '<a {{translateAttr2 title parent string="childB" valB="childC" valC="123"}}></a>'
        Em.run -> expect(view.$('a').attr('title'))
          .toEqual 'parent and childB childC 123 123'

    describe 'bindings', ->
      it 'interpolates recursively', ->
        render '<a {{translateAttr2 title parent string="childA" valABinding="view.foo"}}></a>', { foo: 'baz'}
        Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and childA baz'

      it 'applies same interpolation to same keys', ->
        render '<a {{translateAttr2 title parent string="childB" valB="childC" valCBinding="view.foo"}}></a>', { foo: 'baz' }
        Em.run -> expect(view.$('a').attr('title'))
          .toEqual 'parent and childB childC baz baz'

      #it 'responds to updates on bound properties', ->
        #Em.run -> Foo.set 'count', 3
        #render '<a {{translateAttr2 title parent string="childA" valABinding="Foo.count"}}></a>'
        #Em.run -> Foo.set 'count', 4
        #Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and childA 4'

      it 'does not error due to bound properties during a rerender', ->
        Em.run -> Foo.set 'count', 3
        render '<a {{translateAttr2 title parent string="childA" valABinding="Foo.count"}}></a>'
        expect( ->
          Em.run -> view.rerender(); Foo.set 'count', 4
        ).not.toThrow()

      it 'responds to updates on bound properties after a rerender', ->
        Em.run -> Foo.set 'count', 3
        render '<a {{translateAttr2 title parent string="childA" valABinding="Foo.count"}}></a>'
        Em.run -> view.rerender(); Foo.set 'count', 4
        Em.run -> expect(view.$('a').attr('title')).toEqual 'parent and childA 4'

  it 'handles interpolations from contextual keywords', ->
    render '<a {{translateAttr2 title foo_named nameBinding="view.foo"}}></a>', { foo: 'baz' }
    Em.run -> expect(view.$('a').attr('title')).toEqual 'foo baz'

  # diff
  it 'responds to updates on bound keyword properties after a rerender', ->
    render '<a {{translateAttr2 title foo_named nameBinding="view.foo"}}></a>', { foo: 'baz' }
    Em.run -> expect(view.$('a').attr('title')).toEqual 'foo baz'
    Em.run -> view.rerender(); view.set 'foo', 'quux'
    Em.run -> expect(view.$('a').attr('title')).toEqual 'foo quux'
