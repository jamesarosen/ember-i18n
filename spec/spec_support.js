(function() {

  if (/^2\./.test(jQuery.fn.jquery)) {
    // jQuery 2 leaks globals, but mocha.globals slows down testing
    mocha.globals([ 'jQuery*' ]);
  }

  Ember.FEATURES = Ember.FEATURES || {};

  function renderTemplate(template, options) {
    if (options == null) options = {};
    options.template = Ember.Handlebars.compile(template);
    var view = this._ember_view = Ember.View.create(options);
    Ember.run(view, 'append');
    return view;
  }

  beforeEach(function() {
    this.renderTemplate = renderTemplate.bind(this);
    this.originalTranslations = Ember.I18n.translations;

    Ember.I18n.translations = {
      'foo.bar': 'A Foobar',
      'foo.bar.named': 'A Foobar named {{name}}',
      'foo.save.disabled': 'Saving Foo...',
      'foos.zero': 'No Foos',
      'foos.one': 'One Foo',
      'foos.other': 'All {{count}} Foos',
      'bars.all': 'All {{count}} Bars',
      baz: {
        qux: 'A qux appears'
      },
      fum: {
        one: 'A fum',
        other: '{{count}} fums'
      }
    };

    CLDR.defaultLanguage = 'ksh';
  });

  afterEach(function() {
    if (this._ember_view) {
      Ember.run(this._ember_view, 'destroy');
      delete this._ember_view;
    }

    Ember.I18n.translations = this.originalTranslations;
    CLDR.defaultLanguage = null;
  });

}());
