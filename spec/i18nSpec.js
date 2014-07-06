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

  });

}).call(this);
