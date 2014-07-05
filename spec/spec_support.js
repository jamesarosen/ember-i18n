(function() {

  if (/^2\./.test(jQuery.fn.jquery)) {
    // jQuery 2 leaks globals, but mocha.globals slows down testing
    mocha.globals([ 'jQuery*' ]);
  }

  beforeEach(function() {
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
    Ember.I18n.translations = this.originalTranslations;
    CLDR.defaultLanguage = null;
  });

}());
