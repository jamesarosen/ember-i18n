describe("{{t}}", function() {

  describe("with Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN on", function() {

    beforeEach(function() {
      Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = true;
    });

    it("emits a <span> by default", function() {
      var view = this.renderTemplate('{{t "foo.bar"}}');
      expect(view.$('span').text()).to.equal('A Foobar');
    });

    it("includes an element ID for backwards compatibility", function() {
      var view = this.renderTemplate('{{t "foo.bar"}}');
      expect(view.$('span').attr('id')).to.not.equal(undefined);
    });

    it('obeys a custom tag name', function() {
      var view = this.renderTemplate('{{t "foo.bar" tagName="h2"}}');
      expect(view.$('h2').html()).to.equal('A Foobar');
    });

  });

  describe("with Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN off", function() {

    beforeEach(function() {
      Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = false;
    });

    it("doesn't emit a <span> by default", function() {
      var view = this.renderTemplate('{{t "foo.bar"}}');
      expect(view.$('span').length).to.equal(0);
      expect(view.$().text()).to.equal('A Foobar');
    });

    it("interpolates values", function() {
      var view = this.renderTemplate('{{t "bars.all" count="597"}}');
      expect(view.$().text()).to.equal('All 597 Bars');
    });

    it("still supports setting a tagName", function() {
      var view = this.renderTemplate('{{t "foo.bar" tagName="span"}}');
      expect(view.$('span').text()).to.equal('A Foobar');
    });

    it("includes an element ID when tagName is specified for backwards compatibility", function() {
      var view = this.renderTemplate('{{t "foo.bar" tagName="span"}}');
      expect(view.$('span').attr('id')).to.not.equal(undefined);
    });

    it("updates text", function() {
      var view = this.renderTemplate('{{t "bars.all" countBinding="view.count"}}', { count: 992 });
      expect(view.$().text()).not.to.equal('All 993 Bars');
      Ember.run(view, 'set', 'count', 993);
      expect(view.$().text()).to.equal('All 993 Bars');
    });

  });

});
