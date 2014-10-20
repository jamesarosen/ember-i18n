describe('{{t}}', function() {

  it('outputs simple translated strings', function() {
    var view = this.renderTemplate('{{t "foo.bar"}}');

    Ember.run(function() {
      expect(view.$().text()).to.equal('A Foobar');
    });
  });

  it('supports bound keys', function() {
    var view = this.renderTemplate('{{t view.key}}', { key: 'foo.bar' });

    Ember.run(function() {
      expect(view.$().text()).to.equal('A Foobar');
    });

    Ember.run(view, 'set', 'key', 'foo.save.disabled');

    Ember.run(function() {
      expect(view.$().text()).to.equal('Saving Foo...');
    });
  });

  it('interpolates literal values', function() {
    var view = this.renderTemplate('{{t "bars.all" count="597"}}');

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 597 Bars');
    });
  });

  it('interpolates bound values', function() {
    var view = this.renderTemplate('{{t "foos" countBinding="view.count"}}', { count: 1 });

    Ember.run(function() {
      expect(view.$().text()).to.equal('One Foo');
    });

    Ember.run(view, 'set', 'count', 4);

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 4 Foos');
    });
  });

  it('does not error due to bound properties during a rerender', function() {
    var view = this.renderTemplate('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

    expect(function() {
      Ember.run(function() {
        view.rerender();
        view.set('count', 4);
      });
    }).to.not['throw']();
  });

  it('responds to updates on bound properties after a rerender', function() {
    var view = this.renderTemplate('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

    Ember.run(function() {
      view.rerender();
      view.set('count', 4);
    });

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 4 Bars');
    });
  });
});

describe('{{{t}}}', function() {
  it('does not over-escape translations', function() {
    Ember.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>';
    var view = this.renderTemplate('<div>{{{t "message.loading"}}}</div>');
    Ember.run(function() {
      expect(view.$('.loading').length).to.equal(1);
      expect(view.$('.loading').text()).to.equal('Loading…');
    });
  });
});
