import { registerHelper } from '@ember/test';
import _translate from 'ember-i18n/test-support/-private/translate';
import _assertTranslation from 'ember-i18n/test-support/-private/assert-translation';

// example usage: find(`.header:contains(${translate('welcome_message')})`)
registerHelper('translate', function(app, key, interpolations) {
  return _translate(app.__container__, key, interpolations);
});

// example usage: expectTranslation('.header', 'welcome_message');
registerHelper('expectTranslation', function(app, element, key, interpolations){
  const text = _translate(app.__container__, key, interpolations);

  _assertTranslation(element, key, text);
});

