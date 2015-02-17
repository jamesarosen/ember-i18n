import newService from '../helpers/i18n-service';
import eachTranslatedAttribute from 'ember-i18n/each-translated-attribute';

module('ember-i18n/each-translated-attribute', {
  setup: function() {
    spy = sinon.spy();

    const object = {
      aKey: 'a value',
      titleTranslation: 'foo.bar',
      aNullTranslation: null
    };

    eachTranslatedAttribute(newService(), object, spy);
  }
});

test('it skips non-translated attributes', function() {
  equal(spy.calledWith('aKey'), false);
});

test('it calls the callback with translated attributes, minus the marker suffix, and their translations', function() {
  ok(spy.calledWithExactly('title', 'A Foobar'));
});

test('it calls the callback with null if the translation key is null', function() {
  ok(spy.calledWithExactly('aNull', null));
});
