# Fork + Rewrite (14 Apr 2013)

Main Features
-------------

### Recursive dynamic translations + bindings

```coffeescript
Em.I18n.Translations.reopen
  error:        '{{model}} is invalid: {{reason}}'
  user:         'User'
  wrong_format: '{{attribute}} is wrongly formatted'
```

```coffeescript
App.FooView = Em.View.extend
  email: 'foo@bar'
```

```handlebars
{{t error model="user" reason="wrong_format" attributeBinding="view.email"}}
```

The handlebars helper will now output `User is invalid: foo@bar is wrongly
formatted`.

### Interpolations for plain tag attribute translations (also recursive)

```
Em.I18n.Translations.reopen
  'account.panel': '{{prefix}} Control Panel'
  'account.panel.prompt': 'Go to my Panel'
  'user.label': '{{role}} User'
  'role.admin': 'Admin'
```

```handlebars
<a {{translateAttr title account.panel prefix="user.label" role="role.admin"}}>
  {{t account.panel.prompt}}
</a>
```

This outputs:

```html
  <a title="Admin User Control Panel">
    Go to my panel
  <a>
```

BC Breaks + Conversion / Upgrade Guide
--------------------------------------

### Translations object

Before:

```coffeescript
Em.I18n.translations = { foo: 'bar' }
```

After:

```coffeescript
Em.I18n.Translations.reopen({ foo: 'bar' })
```

Notice the capitalization at `Translations`.

### Dot-keys vs Object-keys

A specific order for dot-keys vs object-keys conflicts is also introduced.
If you have specified:

```coffeescript
Em.I18n.Translations.reopen({ foo: { bar: 'object' }, 'foo.bar': 'dot' })
```

`{{t foo.bar}}` will now always resolve to `dot`.

### Locale definition / Pluralization

Before:

```coffeescript
CLDR.defaultLocale = 'en'
```

After

```coffeescript
Em.I18n.Config.reopen({ locale: 'en' })
```

Also, you do not need to include the [CLDR.js pluralization library](https://github.com/jamesarosen/CLDR.js) yourself; it is bundled together with `ember-i18n`.

Full change list
----------------

* The single `i18n.js` has been split into logical source files.
* `{{t}}` and `{{translateAttr}}` helper logic has been refactored
  significantly.
  * They now create `TranslationObject`s for rendering.
  * Recursion magic happens inside the `TranslationObject`: it will create
    child `TranslationObject`s.
  * Child `TranslationObject`s remember the View from the original entry point:
    this enables bindings to view properties.
  * Formatting logic (html / attr-value pairs) is also moved to the
    `TranslationObject` due to need from recursion.
  * Both support three kinds of interpolations:
    * Bindings
    * Translations (i.e. recursion)
    * Literals
  * The binding hook is now `data-ember-i18n-(uuid)=(uuid)` instead of
    `id=(uuid)`, to leave room for userland use of the element's ID.
* `Em.I18n.Translations` is now an `Em.Object`.
  * It is `Translations`, not `translations`.
  * Explicit ambiguity resolution: dot keys will now always trump object keys
    if both are specified.
* `Em.I18n.Config` introduced as a centralized holder for config values.
  * Currently there is only one config: `locale`.
* The CLDR pluralization library is now bundled with `ember-i18n` and used
  internally.
  * Direct public API access to CLDR (`CLDR.defaultLocale = 'en'`) has been
    removed in favor of the `Em.I18n.Config.locale` config.
* The whole library is now written in [ember-script](http://emberscript.com/),
  which is 99% [coffeescript](http://coffeescript.org/) with some
  ember-specific shorthands.
* New dev environment:
  * A mini rails app, to take advantage of
    * Sprockets
    * Guard
    * Jasminerice
    * `ember-rails` package
* Vanilla `jasmine` tests replaced by `guard-jasmine` + `jasminerice`.
  * Tested against all released gem versions of `ember-source` - working with
    all except `1.0.0.pre4.1` and `1.0.0.rc1.0.0`.
  * Tests are also broken apart into logical units.
  * Support rspec-esque shared examples in tests.
* `js` and `min.js` distribution files built with `sprockets`.
* Expanded `.gitignore`.
* Source gem scaffolded (at `ember-i18n-source`).
* `package.json` scaffolded, ready for npm.
* `component.json` removed; rely on bower to auto-generate one based on
  github repo name and tags..
