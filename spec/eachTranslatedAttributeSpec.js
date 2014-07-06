describe('Ember.I18n.eachTranslatedAttribute', function() {
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
