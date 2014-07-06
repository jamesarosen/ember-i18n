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
