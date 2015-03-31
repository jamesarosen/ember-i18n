describe('Ember.I18n.t', function() {
  it('translates simple strings', function() {
    expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
  });

  it('interpolates', function() {
    expect(Ember.I18n.t('foo.bar.named', {
      name: '<Sue>'
    })).to.equal('A Foobar named <span>&lt;Sue&gt;</span>');
  });

  it('interpolates escaped', function() {
    expect(Ember.I18n.t('foo.bar.named.noEscape', {
      link: '<a href="#">Sue</a>'
    })).to.equal('A Foobar named <span><a href="#">Sue</a></span>');
  });

  it('interpolates structures correctly', function() {
    expect(Ember.I18n.t('foo.bar.named.structured', {
      contact: { name: 'Sue' }
    })).to.equal('A Foobar named Sue');
  });

  it('interpolates whitespaced values correctly', function() {
    expect(Ember.I18n.t('foo.bar.named.whitespaced', {
      name: 'Sue'
    })).to.equal('A Foobar named Sue');

    expect(Ember.I18n.t('foo.bar.named.noEscapeWhitespaced', {
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

  describe('rtl markers', function() {
    afterEach(function() {
      Ember.I18n.rtl = undefined;
    });

    it('leaves markers off by default', function() {
      expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
    });

    it('adds rtl markers if I18n.rtl is set', function() {
      Ember.I18n.rtl = true;
      expect(Ember.I18n.t('foo.bar')).to.equal('\u202BA Foobar\u202C');
    });
  });

  describe('missing message', function(){
    beforeEach(function() {
      this.oldMissingMessage = Ember.I18n.missingMessage;
    });

    afterEach(function() {
      Ember.I18n.missingMessage = this.oldMissingMessage;
    });

    it('can be set to a custom message', function() {
      Ember.I18n.missingMessage = function(key) { return "there.is." + key + ".to.see"; };
      expect(Ember.I18n.t('nothing.here')).to.equal('there.is.nothing.here.to.see');
    });

    describe('translation context', function() {
      beforeEach(function() {
        Ember.I18n.missingMessage = function(key, context) {
          var values = Object.keys(context).map(function(key) { return context[key]; });
          return key + ':' + (values.join(','));
        };
      });

      it('is passed to the function', function() {
        expect(Ember.I18n.t('foo', { arg1: 'bar', arg2: 'qux' })).to.equal('foo:bar,qux');
      });

      it('is passed with new values when the translation is called again', function() {
        Ember.I18n.t('foo', { arg1: 'bar', arg2: 'qux' });
        expect(Ember.I18n.t('foo', { arg1: 'qux', arg2: 'baz' })).to.equal('foo:qux,baz');
      });
    });
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
      expect(spy.calledWith('nothing.here')).to.equal(true);
    });

    it('triggers missing events with the context included', function() {
      spy = sinon.spy();
      Ember.I18n.on('missing', spy);
      var context = { arg1: 'bar', arg2: 'qux' };

      Ember.I18n.t('nothing.here', context);
      expect(spy.calledWithExactly('nothing.here', context)).to.equal(true);
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
