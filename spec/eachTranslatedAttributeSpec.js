describe('Ember.I18n.eachTranslatedAttribute', function() {
  var spy;

  beforeEach(function() {
    spy = sinon.spy();
    var object = { aKey: 'a value', titleTranslation: 'foo.bar', aNullTranslation: null };
    Ember.I18n.eachTranslatedAttribute(object, spy);
  });

  it('skips non-translated attributes', function() {
    expect(spy.calledWith('aKey')).to.equal(false);
  });

  it('calls the callback with translated attributes, minus the marker suffix, and their translations', function() {
    expect(spy.calledWithExactly('title', 'A Foobar')).to.equal(true);
  });

  it('calls the callback with null if the translation key is null', function() {
    expect(spy.calledWithExactly('aNull', null)).to.equal(true);
  });
});
