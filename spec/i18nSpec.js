(function () {

  describe('Ember.I18n', function () {

    it('exists', function() {
      expect(Ember.I18n).to.not.equal(undefined);
    });

    describe('.exists', function() {
      it('returns true for present keys', function() {
        expect(Ember.I18n.exists('foo.bar')).to.equal(true);
      });

      it('returns false for absent keys', function() {
        expect(Ember.I18n.exists('chumble.fuzz')).to.equal(false);
      });

      it("returns false for absent keys even if they've been used", function() {
        Ember.I18n.t('yakka foob');
        expect(Ember.I18n.exists('yakka foob')).to.equal(false);
      });
    });

    describe('.t', function() {
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
        var observer;

        afterEach(function() {
            Ember.I18n.off('missing', observer);
        });

        it('triggers missing events when translations are missing', function() {
          var didCall = false;
          observer = function(key) {
            expect(key).to.equal('nothing.here');
            didCall = true;
          };
          Ember.I18n.on('missing', observer);
          Ember.I18n.t('nothing.here');
          expect(didCall).to.equal(true);
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

    describe('{{translateAttr}}', function() {
      it('outputs translated attribute strings', function() {
        var view = this.renderTemplate('<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}></a>');
        Ember.run(function() {
          expect(view.$('a').attr('title')).to.equal('A Foobar');
          expect(view.$('a').attr('data-disable-with')).to.equal('Saving Foo...');
        });
      });
    });

    describe('{{ta}}', function() {
      it('outputs translated attribute strings', function() {
        var view = this.renderTemplate('<a {{ta title="foo.bar" data-disable-with="foo.save.disabled"}}></a>');
        Ember.run(function() {
          expect(view.$('a').attr('title')).to.equal('A Foobar');
          expect(view.$('a').attr('data-disable-with')).to.equal('Saving Foo...');
        });
      });
    });

    describe('{{ta}} == {{translateAttr}}', function() {
      it('check that {{ta}} and {{translateAttr}} outputs the same', function() {
        var view = this.renderTemplate('<a {{ta title="foo.bar" data-disable-with="foo.save.disabled"}}></a><span {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}></span>');
        Ember.run(function() {
          expect(view.$('a').attr('title')).to.equal(view.$('span').attr('title'));
          expect(view.$('a').attr('data-disable-with')).to.equal(view.$('span').attr('data-disable-with'));
        });
      });
    });

    describe('eachTranslatedAttribute', function() {
      var calledWith;

      beforeEach(function() {
        calledWith = {};
        var object = { aKey: 'a value', titleTranslation: 'foo.bar' };
        Ember.I18n.eachTranslatedAttribute(object, function(attributeName, translation) {
          calledWith[attributeName] = translation;
        });
      });

      it('skips non-translated attributes', function() {
        expect(calledWith.aKey).to.equal(undefined);
      });

      it('calls the callback with translated attributes, minus the marker suffix, and their translations', function() {
        expect(calledWith.title).to.equal('A Foobar');
      });
    });

    describe('TranslateableProperties', function() {

      it('translates ___Translation attributes on the object', function() {
        var subject = Ember.Object.extend(Ember.I18n.TranslateableProperties).create({
          titleTranslation: 'foo.bar'
        });
        expect(subject.get('title')).to.equal('A Foobar');
      });

    });

    describe('TranslateableProperties update', function() {

      it('translates ___Translation attributes on the object and updates them when set', function() {
        var subject = Ember.Object.extend(Ember.I18n.TranslateableProperties).create({
          titleTranslation: 'foo.bar'
        });
        expect(subject.get('title')).to.equal('A Foobar');
        subject.set('titleTranslation', 'foos.zero');
        expect(subject.get('title')).to.equal('No Foos');
      });

    });

    describe('TranslateableAttributes', function() {
      it('exists', function() {
        expect(Ember.I18n.TranslateableAttributes).to.not.equal(undefined);
      });

      it('translates ___Translation attributes on the DOM element', function() {
        Ember.View.reopen(Ember.I18n.TranslateableAttributes);
        var view = this.renderTemplate('{{view titleTranslation="foo.bar"}}');
        expect(view.$().children().first().attr('title')).to.equal("A Foobar");
      });
    });
  });

}).call(this);
