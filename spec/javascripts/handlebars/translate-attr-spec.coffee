describe '{{translateAttr2}}', ->
  bootstrap()

  beforeEach ->
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      bar: 'bar-v'

  follow 'helper with recursion',
    template:     '<a {{translateAttr2 title %@}}></a>'
    retrieval:    "Foo.View.$('a').attr('title')"
    needRerender: true

  it 'supports multiple-declaration syntax', ->
    render '<a {{translateAttr2 title="foo" data-bar="bar"}}></a>'
    Em.run ->
      expect(Foo.View.$('a').attr('title')).toEqual 'foo-v'
      expect(Foo.View.$('a').data('bar')).toEqual 'bar-v'

  it 'supports multiple instances on same tag', ->
    render '<a {{translateAttr2 title="foo"}} {{translateAttr2 data-bar="bar"}}></a>'
    Em.run ->
      expect(Foo.View.$('a').attr('title')).toEqual 'foo-v'
      expect(Foo.View.$('a').data('bar')).toEqual 'bar-v'
