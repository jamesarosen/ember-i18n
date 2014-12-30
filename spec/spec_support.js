(function() {

  if (/^2\./.test(jQuery.fn.jquery)) {
    // jQuery 2 leaks globals, but mocha.globals slows down testing
    mocha.globals([ 'jQuery*' ]);
  }

  Ember.FEATURES = Ember.FEATURES || {};

  function renderTemplate(template, options) {
    var container = new Ember.Container();
    container.register('view:toplevel', Ember.View.extend());
    if (options == null) options = {};
    options.template = Ember.Handlebars.compile(template);
    options.container = container;
    var view = this._ember_view = Ember.View.create(options);
    Ember.run(view, 'append');
    return view;
  }

  beforeEach(function() {
    this.renderTemplate = renderTemplate.bind(this);
    this.originalTranslations = Ember.I18n.translations;
    this.originalMissingMessage = Ember.I18n.missingMessage;

    Ember.I18n.translations = {
      'foo.bar': 'A Foobar',
      'foo.bar.named': 'A Foobar named <span>{{name}}</span>',
      'foo.bar.named.noEscape': 'A Foobar named <span>{{{link}}}</span>',
      'foo.bar.named.structured': 'A Foobar named {{contact.name}}',
      'foo.bar.named.whitespaced': 'A Foobar named {{  name  }}',
      'foo.bar.named.noEscapeWhitespaced': 'A Foobar named {{{  name  }}}',
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

    Ember.I18n.locale = 'ksh';
  });

  afterEach(function() {
    if (this._ember_view) {
      Ember.run(this._ember_view, 'destroy');
      delete this._ember_view;
    }

    Ember.I18n.translations = this.originalTranslations;
    Ember.I18n.missingMessage = this.originalMissingMessage;
    Ember.I18n.locale = null;
  });

}());
