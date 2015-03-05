describe('TranslateableProperties', function() {

  it('translates ___Translation attributes on the object', function() {
    var klass = Ember.Object.extend(Ember.I18n.TranslateableProperties);
    var subject = Ember.run(klass, 'create', { titleTranslation: 'foo.bar' });
    expect(subject.get('title')).to.equal('A Foobar');
  });

  it('updates translations when the upstream value changes', function() {
    var klass = Ember.Object.extend(Ember.I18n.TranslateableProperties);
    var subject = Ember.run(klass, 'create', { titleTranslation: 'foo.bar' });
    expect(subject.get('title')).to.equal('A Foobar');
    subject.set('titleTranslation', 'foos.zero');
    expect(subject.get('title')).to.equal('No Foos');
  });

});
