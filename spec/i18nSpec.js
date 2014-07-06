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
