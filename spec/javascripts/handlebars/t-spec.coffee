describe '{{t2}}', ->
  view = null

  render = (template, options = {}) ->
    options.template = Em.Handlebars.compile template
    view = Em.View.create(options)
    Em.run -> view.append()

  beforeEach ->
    window.Foo = Em.Object.create() # namespace
    Em.I18n2.Translations.reopen
      foo: 'foo-v'
      loading: '<span class="loading">...</span>'

  follow 'helper with recursion',
    template:     '{{t2 %@}}'
    retrieval:    'view.$().text()'
    needRerender: false

  it 'obeys a custom tag name', ->
    render '{{t2 foo tagName="h2"}}'
    Em.run -> expect(view.$('h2').html()).toEqual 'foo-v'

  describe '{{{t2}}}', ->
    it 'does not over-escape translations', ->
      render '<div>{{{t2 loading}}}</div>'
      Em.run ->
        expect(Foo.View.$('.loading').length).toEqual 1
        expect(Foo.View.$('.loading').text()).toEqual '...'
