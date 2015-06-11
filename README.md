## Ember-I18n

Internationalization for Ember

### NOTE

The following documentation is for v4.0, which has not yet been released.
For documentation on the most recent release, see
[the v3.1.1 README](https://github.com/jamesarosen/ember-i18n/blob/v3.1.1/README.md).

**This version does not yet work with Glimmer or Ember v1.13**. See
the [stateful helpers RFC](https://github.com/emberjs/rfcs/pull/53) and
the [helper registration RFC](https://github.com/emberjs/rfcs/pull/58)
for more information.

### Requirements

Ember-I18n v4 requires

 * Ember v1.10 - v1.12
 * Ember-CLI
 * jQuery v1.7 - v2.x

### Installation

For ember-cli projects, run

```bash
$ ember install ember-i18n
```

For non-ember-cli projects, use
[v3.1.1](https://github.com/jamesarosen/ember-i18n/tree/v3.1.1) or earlier.

### Defining Translations

Put translation files in `app/locales/[locale]/translations.js`. Each file
should export an object. If the values are `Function`s, they will be
used as-is. If they are `String`s, they will first be compiled using
`util:i18n/compile-translation`. A default Handlebars-like implementation is
provided. See below for more information on overriding the compiler.

For example,

```js
export default {
  'user.edit.title': 'Edit User',
  'user.followers.title.one': 'One Follower',
  'user.followers.title.other': 'All {{count}} Followers',

  // nested objects work just like dotted keys
  'button': {
    'add_user': {
      'title': 'Add a user',
      'text': 'Add',
      'disabled': 'Saving...'
    }
  }
};
```

The `translations` generator will generate a new translations file for you:

```bash
$ ember generate translations es
```

### `i18n` Service

Many pieces of ember-i18n rely on the `service:i18n`. This service is automatically
injected into every Route, Controller and Component in your app. If you need it
elsewhere, you can register your own injection:

```js
// app/instance-initializers/i18n.js

export default {
  name: 'i18n',
  initialize: function(app) {
    app.inject('model', 'i18n', 'service:i18n')
  }
};
```

or you can ask for the service on a case-by-case basis:

```js
// app/services/session.js

export default Ember.Object.extend({
  i18n: Ember.inject.service()
});
```

If you want to use i18n from within an initializer you need to make sure that it runs after the
`ember-i18n` initializer has been executed.

```js
// app/instance-initializers/my-initializer.js

export default {
  name: 'my-initializer',
  after: 'ember-i18n',
  initialize: function({ container }) {
    let i18n = container.lookup('service:i18n');
    i18n.t('some.translation');
  }
};

#### Adding Translations at Runtime

If you have a translations API (so you can manage them across apps centrally
or so you can deliver only the translations you need), you can add new
translations at runtime via the `service:i18n`:

```js
this.i18n.addTranslations('en', {
  'user.profile.gravatar.help': 'Manage your avatar at gravatar.com.'
});
```

#### Setting the Locale

Set the default locale in `config/environment.js`:

```js
ENV.i18n = {
  defaultLocale: 'zh'
};
```

Override the default by setting `locale` on the `i18n` service:

```js
// app/routes/application.js

export default Ember.Route.extend({
  afterModel: function(user) {
    this.set('i18n.locale', user.get('locale'));
  }
});
```

**Note**: if you do this in an initializer and use FastBoot, you probably want to
use an [`instance-initializer`](http://emberjs.com/blog/2015/05/13/ember-1-12-released.html#toc_instance-initializers).

### Translating Text

#### `{{t}}` Helper

A simple translation:

```html
<h2>{{t "user.edit.title"}}</h2>
```
yields
```html
<h2>Edit User</h2>
```

A translation based on a bound key:

```html
<h2>{{t title_i18n_key}}</h2>
```

yields

```html
<h2>Add a user</h2>
```

if `component.title_i18n_key` is `'button.add_user.title'`. If
it subsequently changes to `'user.edit.title'`, the HTML will
become

```html
<h2>Edit User</h2>
```

A translation with interpolated values:

```html
<h2>{{t "user.followers.title" count="2"}}</h2>
```

yields

```html
<h2>All 2 Followers</h2>
```

Interpolated values can be bound:

```html
<h2>{{t "user.followers.title" count=user.followers.count}}</h2>
```

yields

```html
<h2>All 2 Followers</h2>
```

if `user.get('followers.count')` returns `2`.

#### Translation Computed Property Macro

`translationMacro` defines a computed property macro that
makes it easy to define translated computed properties. For example,

```js
import { translationMacro as t } from "ember-i18n";

export default Ember.Component.extend({

  // A simple translation.
  title: t("user.edit.title"),

  followersCount: 1,

  // A translation with interpolations. This computed property
  // depends on `count` and will send `{ count: this.get('followersCount') }`
  // in to the translation.
  followersTitle: t("user.followers.title", { count: "followersCount" })

});
```

The first argument is the translation key. The second is a hash where the keys
are interpolations in the translation and the values are paths to the values
relative to `this`.

The macro relies on `this.i18n` being the `service:i18n`. See "i18n Service"
docs for more information on where it is available.

#### `i18n.t`

If the neither the helper nor the macro works for your use-case, you can use
the i18n service directly:

```js
export default Ember.Component.extend({

  // The dependency on i18n.locale is important if you want the
  // translated value to be recomputed when the user changes their locale.
  title: Ember.computed('i18n.locale', 'user.isAdmin', function() {
    if (this.get('user.isAdmin')) {
      return this.i18n.t('admin.edit.title');
    } else {
      return this.i18n.t('user.edit.title');
    }
  })

});
```

### Pluralization

Ember-i18n includes support for inflection based on a `count` interpolation.
Pluralization rules are based on the
[Unicode Common Locale Data Repository](http://cldr.unicode.org/).

Whenever you pass the `count` option to the `t` function, template will be pluralized:

```js
// app/locales/en/translations.js:

export default {
  'dog': {
    'one': 'a dog',
    'other': '{{count}} dogs'
  }
};

// Elsewhere:

i18n.t('dog', { count: 1 }); // a dog
i18n.t('dog', { count: 2 }); // 2 dogs
```

ember-i18n converts `1` to `.one` and `2` to `.other`. Depending on the
locale, there could be up to 6 plural forms used: 'zero', 'one', 'two',
'few', 'many', 'other'.

If you want to override the inflection rules for a locale, you can define
your own in `app/locales/[locale]/config.js`. For example, to add support
for `zero` to English:

```js
// app/locales/en/config.js:

export default {
  pluralForm: function englishWithZero(n) {
    if (n === 0) { return 'zero'; }
    if (n === 1) { return 'one'; }
    return 'other';
  }
}
```

### Translation Compiler

#### Default Translation Compiler

ember-i18n includes a default compiler that acts mostly like (unbound) Handlebars.
It supports interpolations with dots in them. It emits strings that are marked as
HTML-safe.

The compiler treats interpolated values as HTML-*unsafe* by default. You can get
HTML-safe interpolations in two ways:

(1) Mark the interpolated value as HTML-safe:

```js
seeUserMessage: Ember.computed('i18n.locale', 'user.id', function() {
  var userLink = '<a href="/users/' + user.get('id') + '">' + user.get('name') + '</a>';

  return this.i18n.t('info.see-other-user', {
    userLink: Ember.String.htmlSafe(userLink)
  });
})
```

(2) Use triple-stache notation in the translation:

```js
export default {
  'info.see-other-user': "Please see {{{userLink}}}"
};
```

In general, the first method is preferred because it makes it more difficult
to accidentally introduce an XSS vulnerability.

The compiler also adds Unicode RTL markers around the output if the locale specifies it. You can
override this behavior by setting `rtl` in the locale's configuration file:

```js
// app/locales/ar/config.js:

export default {
  rtl: true
}
```

#### Overriding the Compiler

You can override the compiler by defining `util:i18n/compile-translation`.
For example, if your translation templates use `%{}` to indicate an
interpolation, you might do

```js
// app/utils/i18n/compile-translation.js

const interp = /%\{([^\}]+)\}/g;
const escape = Ember.Handlebars.Utils.escapeExpression;
const get = Ember.get;

export default function compile(template) {
  return function(context) {
    return template
      .replace(interp, function(i, match) {
        return escape(get(context, match));
      });
  };
}
```

### Missing translations

When `t` is called with a nonexistent key, it returns the result of calling
`util:i18n/missing-translation` with the key and the context as arguments. The
default behavior is to return "Missing translation: [key]", but you can
customize this by overriding the function. The below example spits out the
key along with the values of any arguments that were passed:

```js
// app/utils/i18n/missing-translation:

export default function(locale, key, context) {
  var values = Object.keys(context).map(function(key) { return context[key]; });
  return key + ': ' + (values.join(', '));
}

// Elsewhere:

t('nothing.here', { arg1: 'foo', arg2: 'bar' });
// => "nothing.here: foo, bar"
```

When a missing translation is encountered, a `missing` event is also triggered
on the `i18n` service, with the key and the context as arguments. You can use this
to execute other missing-translation behavior such as logging the key somewhere.

```js
i18n.on('missing', function(locale, key, context) {
  Ember.Logger.warn("Missing translation: " + key);
};
```
