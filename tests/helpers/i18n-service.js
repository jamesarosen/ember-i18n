import I18nService from 'ember-i18n/services/i18n';
import MemoryStore from 'ember-i18n/translation-stores/memory';

export default function buildService() {
  const store = MemoryStore.create();

  store.addTranslations('en', {
    'foo.bar': 'A Foobar',
    'foo.bar.named': 'A Foobar named <span>{{name}}</span>',
    'foo.bar.named.noEscape': 'A Foobar named <span>{{{link}}}</span>',
    'foo.bar.named.structured': 'A Foobar named {{contact.name}}',
    'foo.bar.named.whitespaced': 'A Foobar named {{  name  }}',
    'foo.bar.named.noEscapeWhitespaced': 'A Foobar named {{{  name  }}}',
    'foo.save.disabled': 'Saving Foo...',
    'foos.zero': 'No Foos',
    'foos.one': 'One Foo',
    'foos.other': 'All {{count}} Foos',
    'bars.all': 'All {{count}} Bars',
    baz: {
      qux: 'A qux appears'
    },
    fum: {
      one: 'A fum',
      other: '{{count}} fums'
    }
  });

  return I18nService.create({
    locale: 'en',
    store: store
  });
}
