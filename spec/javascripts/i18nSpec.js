/*global describe, beforeEach, afterEach, it, expect*/

(function () {
  "use strict";

  var window = this, Ember = window.Ember, CLDR = window.CLDR;

  describe('Ember.I18n', function () {
    var view;

    function render(template, options) {
      if (options == null) { options = {}; }
      options.template = Ember.Handlebars.compile(template);
      view = Ember.View.create(options);
      Ember.run(function () {
        view.append();
      });
    }

    beforeEach(function () {
      window.TestNamespace = Ember.Object.create({
        toString: "TestNamespace",
        count: Ember.computed(function (property, value) {
          return value;
        }).cacheable()
      });

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

    afterEach(function () {
      if (view != null) { view.destroy(); }
      delete window.TestNamespace;
      Ember.I18n.translations = this.originalTranslations;
      CLDR.defaultLanguage = null;
    });

    it('exists', function () {
      expect(Ember.I18n).not.toBeUndefined();
    });

    describe('.t', function () {
      it('translates simple strings', function () {
        expect(Ember.I18n.t('foo.bar')).toEqual('A Foobar');
      });

      it('interpolates', function () {
        expect(Ember.I18n.t('foo.bar.named', {
          name: 'Sue'
        })).toEqual('A Foobar named Sue');
      });

      it('uses the "zero" form when the language calls for it', function () {
        expect(Ember.I18n.t('foos', {
          count: 0
        })).toEqual('No Foos');
      });

      it('uses the "one" form when the language calls for it', function () {
        expect(Ember.I18n.t('foos', {
          count: 1
        })).toEqual('One Foo');
      });

      it('interpolates count', function () {
        expect(Ember.I18n.t('foos', {
          count: 21
        })).toEqual('All 21 Foos');
      });

      it("works on keys that don't have count suffixes", function () {
        expect(Ember.I18n.t('bars.all', {
          count: 532
        })).toEqual('All 532 Bars');
      });

      it('warns about missing translations', function () {
        expect(Ember.I18n.t('nothing.here')).toEqual('Missing translation: nothing.here');
      });

      describe('using nested objects', function () {
        it('works with a simple case', function () {
          expect(Ember.I18n.t('baz.qux')).toEqual('A qux appears');
        });

        it('works with counts', function () {
          expect(Ember.I18n.t('fum', {
            count: 1
          })).toEqual('A fum');

          expect(Ember.I18n.t('fum', {
            count: 2
          })).toEqual('2 fums');
        });
      });
    });

    describe('{{t}}', function () {
      it('outputs simple translated strings', function () {
        render('{{t foo.bar}}');

        Ember.run(function () {
          expect(view.$().text()).toEqual('A Foobar');
        });
      });

      it('interpolates values', function () {
        render('{{t bars.all count="597"}}');

        Ember.run(function () {
          expect(view.$().text()).toEqual('All 597 Bars');
        });
      });

      it('interpolates bindings', function () {
        Ember.run(function () {
          window.TestNamespace.set('count', 3);
        });

        render('{{t bars.all countBinding="TestNamespace.count"}}');

        Ember.run(function () {
          expect(view.$().text()).toEqual('All 3 Bars');
        });
      });

      it('responds to updates on bound properties', function () {
        Ember.run(function () {
          window.TestNamespace.set('count', 3);
        });

        render('{{t bars.all countBinding="TestNamespace.count"}}');

        Ember.run(function () {
          window.TestNamespace.set('count', 4);
        });

        Ember.run(function () {
          expect(view.$().text()).toEqual('All 4 Bars');
        });
      });

      it('does not error due to bound properties during a rerender', function () {
        Ember.run(function () {
          window.TestNamespace.set('count', 3);
        });

        render('{{t bars.all countBinding="TestNamespace.count"}}');

        expect(function () {
          Ember.run(function () {
            view.rerender();
            window.TestNamespace.set('count', 4);
          });
        }).not.toThrow();
      });

      it('responds to updates on bound properties after a rerender', function () {
        Ember.run(function () {
          window.TestNamespace.set('count', 3);
        });

        render('{{t bars.all countBinding="TestNamespace.count"}}');

        Ember.run(function () {
          view.rerender();
          window.TestNamespace.set('count', 4);
        });

        Ember.run(function () {
          expect(view.$().text()).toEqual('All 4 Bars');
        });
      });

      it('obeys a custom tag name', function () {
        render('{{t foo.bar tagName="h2"}}');

        Ember.run(function () {
          expect(view.$('h2').html()).toEqual('A Foobar');
        });
      });

      it('handles interpolations from contextual keywords', function () {
        render('{{t foo.bar.named nameBinding="view.favouriteBeer" }}', {
          favouriteBeer: 'IPA'
        });

        Ember.run(function () {
          expect(view.$().text()).toEqual('A Foobar named IPA');
        });
      });

      it('responds to updates on bound keyword properties', function () {
        render('{{t foo.bar.named nameBinding="view.favouriteBeer"}}', {
          favouriteBeer: 'Lager'
        });

        expect(view.$().text()).toEqual('A Foobar named Lager');

        Ember.run(function () {
          view.set('favouriteBeer', 'IPA');
        });

        Ember.run(function () {
          expect(view.$().text()).toEqual('A Foobar named IPA');
        });
      });
    });

    describe('{{{t}}}', function () {
      it('does not over-escape translations', function () {
        Ember.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>';
        render('<div>{{{t "message.loading"}}}</div>');
        Ember.run(function () {
          expect(view.$('.loading').length).toEqual(1);
          expect(view.$('.loading').text()).toEqual('Loading…');
        });
      });
    });

    describe('{{translateAttr}}', function () {
      it('outputs translated attribute strings', function () {
        render('<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}');
        Ember.run(function () {
          expect(view.$('a').attr('title')).toEqual('A Foobar');
          expect(view.$('a').attr('data-disable-with')).toEqual('Saving Foo...');
        });
      });
    });

    describe('TranslatableAttributes', function () {
      beforeEach(function () {
        window.TestNamespace.TranslateableView = Ember.View.extend(Ember.I18n.TranslateableAttributes);
      });

      it('exists', function () {
        expect(Ember.I18n.TranslateableAttributes).not.toBeUndefined();
      });

      it('translates ___Translation attributes', function () {
        render('{{view TestNamespace.TranslateableView titleTranslation="foo.bar"}}');
        Ember.run(function () {
          expect(view.$().children().first().attr('title')).toEqual("A Foobar");
        });
      });
    });
  });

}).call(this);
