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
