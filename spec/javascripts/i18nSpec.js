(function() {

  describe('Em.I18n', function() {
    var render, view;
    view = null;
    render = function(template, options) {
      if (options == null) options = {};
      options.template = Em.Handlebars.compile(template);
      view = Em.View.create(options);
      return Em.run(function() {
        return view.append();
      });
    };
    beforeEach(function() {
      window.TestNamespace = Em.Object.create({
        toString: "TestNamespace",
        count: (function(property, value) {
          return value;
        }).property().cacheable()
      });
      this.originalTranslations = Em.I18n.translations;
      Em.I18n.translations = {
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
      return CLDR.defaultLanguage = 'ksh';
    });
    afterEach(function() {
      if (view != null) view.destroy();
      delete window.TestNamespace;
      Em.I18n.translations = this.originalTranslations;
      return CLDR.defaultLanguage = null;
    });
    it('should exist', function() {
      return expect(Em.I18n).not.toBeUndefined();
    });
    describe('.t', function() {
      it('translates simple strings', function() {
        return expect(Em.I18n.t('foo.bar')).toEqual('A Foobar');
      });
      it('interpolates', function() {
        return expect(Em.I18n.t('foo.bar.named', {
          name: 'Sue'
        })).toEqual('A Foobar named Sue');
      });
      it('uses the "zero" form when the language calls for it', function() {
        return expect(Em.I18n.t('foos', {
          count: 0
        })).toEqual('No Foos');
      });
      it('uses the "one" form when the language calls for it', function() {
        return expect(Em.I18n.t('foos', {
          count: 1
        })).toEqual('One Foo');
      });
      it('interpolates count', function() {
        return expect(Em.I18n.t('foos', {
          count: 21
        })).toEqual('All 21 Foos');
      });
      it("works on keys that don't have count suffixes", function() {
        return expect(Em.I18n.t('bars.all', {
          count: 532
        })).toEqual('All 532 Bars');
      });
      it('warns about missing translations', function() {
        return expect(Em.I18n.t('nothing.here')).toEqual('Missing translation: nothing.here');
      });
      return describe('using nested objects', function() {
        it('works with a simple case', function() {
          return expect(Em.I18n.t('baz.qux')).toEqual('A qux appears');
        });
        return it('works with counts', function() {
          expect(Em.I18n.t('fum', {
            count: 1
          })).toEqual('A fum');
          return expect(Em.I18n.t('fum', {
            count: 2
          })).toEqual('2 fums');
        });
      });
    });
    describe('{{t}}', function() {
      it('outputs simple translated strings', function() {
        render('{{t foo.bar}}');
        return Em.run(function() {
          return expect(view.$().text()).toEqual('A Foobar');
        });
      });
      it('interpolates values', function() {
        render('{{t bars.all count="597"}}');
        return Em.run(function() {
          return expect(view.$().text()).toEqual('All 597 Bars');
        });
      });
      it('interpolates bindings', function() {
        Em.run(function() {
          return TestNamespace.set('count', 3);
        });
        render('{{t bars.all countBinding="TestNamespace.count"}}');
        return Em.run(function() {
          return expect(view.$().text()).toEqual('All 3 Bars');
        });
      });
      it('responds to updates on bound properties', function() {
        Em.run(function() {
          return TestNamespace.set('count', 3);
        });
        render('{{t bars.all countBinding="TestNamespace.count"}}');
        Em.run(function() {
          return TestNamespace.set('count', 4);
        });
        return Em.run(function() {
          return expect(view.$().text()).toEqual('All 4 Bars');
        });
      });
      it('does not error due to bound properties during a rerender', function() {
        Em.run(function() {
          return TestNamespace.set('count', 3);
        });
        render('{{t bars.all countBinding="TestNamespace.count"}}');
        return expect(function() {
          return Em.run(function() {
            view.rerender();
            return TestNamespace.set('count', 4);
          });
        }).not.toThrow();
      });
      it('responds to updates on bound properties after a rerender', function() {
        Em.run(function() {
          return TestNamespace.set('count', 3);
        });
        render('{{t bars.all countBinding="TestNamespace.count"}}');
        Em.run(function() {
          view.rerender();
          return TestNamespace.set('count', 4);
        });
        return Em.run(function() {
          return expect(view.$().text()).toEqual('All 4 Bars');
        });
      });
      it('obeys a custom tag name', function() {
        render('{{t foo.bar tagName="h2"}}');
        return Em.run(function() {
          return expect(view.$('h2').html()).toEqual('A Foobar');
        });
      });
      it('handles interpolations from contextual keywords', function() {
        render('{{t foo.bar.named nameBinding="view.favouriteBeer" }}', {
          favouriteBeer: 'IPA'
        });
        return Em.run(function() {
          return expect(view.$().text()).toEqual('A Foobar named IPA');
        });
      });
      return it('responds to updates on bound keyword properties', function() {
        render('{{t foo.bar.named nameBinding="view.favouriteBeer"}}', {
          favouriteBeer: 'Lager'
        });
        expect(view.$().text()).toEqual('A Foobar named Lager');
        Em.run(function() {
          return view.set('favouriteBeer', 'IPA');
        });
        return Em.run(function() {
          return expect(view.$().text()).toEqual('A Foobar named IPA');
        });
      });
    });
    describe('{{{t}}}', function() {
      return it('does not over-escape translations', function() {
        Em.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>';
        render('<div>{{{t "message.loading"}}}</div>');
        return Em.run(function() {
          expect(view.$('.loading').length).toEqual(1);
          return expect(view.$('.loading').text()).toEqual('Loading…');
        });
      });
    });
    describe('{{translateAttr}}', function() {
      return it('outputs translated attribute strings', function() {
        render('<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}');
        return Em.run(function() {
          expect(view.$('a').attr('title')).toEqual('A Foobar');
          return expect(view.$('a').attr('data-disable-with')).toEqual('Saving Foo...');
        });
      });
    });
    return describe('TranslatableAttributes', function() {
      beforeEach(function() {
        return TestNamespace.TranslateableView = Em.View.extend(Em.I18n.TranslateableAttributes);
      });
      it('exists', function() {
        return expect(Em.I18n.TranslateableAttributes).not.toBeUndefined();
      });
      return it('translates ___Translation attributes', function() {
        render('{{view TestNamespace.TranslateableView titleTranslation="foo.bar"}}');
        return Em.run(function() {
          return expect(view.$().children().first().attr('title')).toEqual("A Foobar");
        });
      });
    });
  });

}).call(this);
