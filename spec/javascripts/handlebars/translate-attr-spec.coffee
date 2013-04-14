describe '{{translateAttr}}', ->
  bootstrap()

  beforeEach ->
    Em.I18n.Translations.reopen
      foo: 'foo-v'
      bar: 'bar-v'

  follow 'helper with recursion',
    template:     '<a {{translateAttr title %@}}></a>'
    retrieval:    "Foo.View.$('a').attr('title')"
    needRerender: true

  it 'supports multiple-declaration syntax', ->
    render '<a {{translateAttr title="foo" data-bar="bar"}}></a>'
    Em.run ->
      expect(Foo.View.$('a').attr('title')).toEqual 'foo-v'
      expect(Foo.View.$('a').data('bar')).toEqual 'bar-v'

  it 'supports multiple instances on same tag', ->
    render '<a {{translateAttr title="foo"}} {{translateAttr data-bar="bar"}}></a>'
    Em.run ->
      expect(Foo.View.$('a').attr('title')).toEqual 'foo-v'
      expect(Foo.View.$('a').data('bar')).toEqual 'bar-v'
