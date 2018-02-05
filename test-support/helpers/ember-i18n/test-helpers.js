import { registerHelper } from '@ember/test';
import _t from 'ember-i18n/test-support/-private/t';
import _assertTranslation from 'ember-i18n/test-support/-private/assert-translation';

// example usage: find(`.header:contains(${t('welcome_message')})`)
registerHelper('t', function(app, key, interpolations) {
  return _t(app.__container__, key, interpolations);
});

// example usage: expectTranslation('.header', 'welcome_message');
registerHelper('expectTranslation', function(app, element, key, interpolations){
  const text = _t(app.__container__, key, interpolations);

  _assertTranslation(element, key, text);
});

