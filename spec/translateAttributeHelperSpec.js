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


describe("Bound values", function() {
  var context, view;

  beforeEach(function() {
    context = Ember.Object.create({ fooBar: 'foo.bar', isDisabled: 'foo.save.disabled' });
    view = this.renderTemplate('<a {{ta title=fooBar data-disable-with=isDisabled}}></a>', { context: context });
  });

  it('outputs translated attribute from bound values', function() {
    Ember.run(function() {
      expect(view.$('a').attr('title')).to.equal('A Foobar');
      expect(view.$('a').attr('data-disable-with')).to.equal('Saving Foo...');
    });
  });

  it('emits a warning on quoted bound keys', function() {
    var spy = sinon.spy(Ember.Logger, 'warn');
    view = this.renderTemplate('<a {{ta title="fooBar"}}></a>', { context: context });

    Ember.run(function() {
      expect(spy.callCount).to.equal(1);
      expect(spy.lastCall.args[0]).to.match(/\ quoted\ key/);
      expect(spy.lastCall.args[0]).to.match(/fooBar/);
      expect(view.$('a').attr('title')).to.equal('A Foobar');
    });

    spy.restore();
  });

  it('updates translation when bound value changes', function() {
    Ember.run(function() {
      context.set('fooBar', 'foos.zero');
    });

    Ember.run(function() {
      expect(view.$('a').attr('title')).to.equal('No Foos');
    });
  });
});