describe('Ember.I18n.t', function() {
  it('translates simple strings', function() {
    expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
  });

  it('interpolates', function() {
    expect(Ember.I18n.t('foo.bar.named', {
      name: 'Sue'
    })).to.equal('A Foobar named Sue');
  });

  it('uses the "zero" form when the language calls for it', function() {
    expect(Ember.I18n.t('foos', {
      count: 0
    })).to.equal('No Foos');
  });

  it('uses the "one" form when the language calls for it', function() {
    expect(Ember.I18n.t('foos', {
      count: 1
    })).to.equal('One Foo');
  });

  it('interpolates count', function() {
    expect(Ember.I18n.t('foos', {
      count: 21
    })).to.equal('All 21 Foos');
  });

  it("works on keys that don't have count suffixes", function() {
    expect(Ember.I18n.t('bars.all', {
      count: 532
    })).to.equal('All 532 Bars');
  });

  it('warns about missing translations', function() {
    expect(Ember.I18n.t('nothing.here')).to.equal('Missing translation: nothing.here');
  });

  describe('missing event', function() {
    var spy;

    afterEach(function() {
      Ember.I18n.off('missing', spy);
    });

    it('triggers missing events when translations are missing', function() {
      spy = sinon.spy();
      Ember.I18n.on('missing', spy);
      Ember.I18n.t('nothing.here');
      expect(spy.calledWithExactly('nothing.here')).to.equal(true);
    });
  });

  describe('using nested objects', function() {
    it('works with a simple case', function() {
      expect(Ember.I18n.t('baz.qux')).to.equal('A qux appears');
    });

    it('works with counts', function() {
      expect(Ember.I18n.t('fum', {
        count: 1
      })).to.equal('A fum');

      expect(Ember.I18n.t('fum', {
        count: 2
      })).to.equal('2 fums');
    });
  });

  it('prefers dotted keys to nested ones', function() {
    Ember.I18n.translations.foo = { bar: 'Nested foo.bar' };
    expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
  });
});
