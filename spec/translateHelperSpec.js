describe('{{t}}', function() {

  beforeEach(function() {
    // compatibility mode:
    Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = true;
  });

  it('outputs simple translated strings', function() {
    var view = this.renderTemplate('{{t "foo.bar"}}');

    Ember.run(function() {
      expect(view.$().text()).to.equal('A Foobar');
    });
  });

  it('emits a warning on unquoted keys', function() {
    var spy = sinon.spy(Ember.Logger, 'warn');

    var view = this.renderTemplate('{{t foo.bar}}');

    Ember.run(function() {
      expect(spy.callCount).to.equal(1);
      expect(spy.lastCall.args[0]).to.match(/unquoted/);
      expect(spy.lastCall.args[0]).to.match(/foo\.bar/);
      expect(view.$().text()).to.equal('A Foobar');
    });
  });

  it('interpolates values', function() {
    var view = this.renderTemplate('{{t "bars.all" count="597"}}');

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 597 Bars');
    });
  });

  it('interpolates bindings', function() {
    var view = this.renderTemplate('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 3 Bars');
    });
  });

  it('responds to updates on bound properties', function() {
    var view = this.renderTemplate('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

    Ember.run(function() {
      view.set('count', 4);
    });

    Ember.run(function() {
      expect(view.$().text()).to.equal('All 4 Bars');
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

  it('handles interpolations from contextual keywords', function() {
    var view = this.renderTemplate('{{t "foo.bar.named" nameBinding="view.favouriteBeer" }}', {
      favouriteBeer: 'IPA'
    });

    Ember.run(function() {
      expect(view.$().text()).to.equal('A Foobar named IPA');
    });
  });

  it('responds to updates on bound keyword properties', function() {
    var view = this.renderTemplate('{{t "foo.bar.named" nameBinding="view.favouriteBeer"}}', {
      favouriteBeer: 'Lager'
    });

    expect(view.$().text()).to.equal('A Foobar named Lager');

    Ember.run(function() {
      view.set('favouriteBeer', 'IPA');
    });

    Ember.run(function() {
      expect(view.$().text()).to.equal('A Foobar named IPA');
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
