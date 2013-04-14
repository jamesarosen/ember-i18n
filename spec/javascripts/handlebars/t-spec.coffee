describe '{{t}}', ->
  bootstrap()

  beforeEach ->
    Em.I18n.Translations.reopen
      foo: 'foo-v'
      loading: '<span class="loading">...</span>'

  follow 'helper with recursion',
    template:     '{{t %@}}'
    retrieval:    'Foo.View.$().text()'
    needRerender: false

  it 'obeys a custom tag name', ->
    render '{{t foo tagName="h2"}}'
    Em.run -> expect(Foo.View.$('h2').html()).toEqual 'foo-v'

  describe '{{{t}}}', ->
    it 'does not over-escape translations', ->
      render '<div>{{{t loading}}}</div>'
      Em.run ->
        expect(Foo.View.$('.loading').length).toEqual 1
        expect(Foo.View.$('.loading').text()).toEqual '...'
