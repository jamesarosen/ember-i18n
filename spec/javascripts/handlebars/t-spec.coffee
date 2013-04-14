describe '{{t2}}', ->
  bootstrap()

  beforeEach ->
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      loading: '<span class="loading">...</span>'

  follow 'helper with recursion',
    template:     '{{t2 %@}}'
    retrieval:    'Foo.View.$().text()'
    needRerender: false

  it 'obeys a custom tag name', ->
    render '{{t2 foo tagName="h2"}}'
    Em.run -> expect(Foo.View.$('h2').html()).toEqual 'foo-v'

  describe '{{{t2}}}', ->
    it 'does not over-escape translations', ->
      render '<div>{{{t2 loading}}}</div>'
      Em.run ->
        expect(Foo.View.$('.loading').length).toEqual 1
        expect(Foo.View.$('.loading').text()).toEqual '...'
