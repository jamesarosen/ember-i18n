ember-i18n
==========

`ember-i18n` provides internationalization support to
[ember.js](http://emberjs.com/).

Fork + Rewrite notice
=====================

This is a fork + rewrite from [jamesarosen/ember-i18n](https://github.com/jamesarosen/ember-i18n/). Check the [Changelog](https://github.com/heartsentwined/ember-i18n/blob/master/CHANGELOG.md) for rationale, new features, **BC Breaks**, etc.

Usage
=====

Config
------

Set the locale to `en`.

```coffeescript
Em.I18n.Config.reopen({ locale: 'en' }) # also supports 'en-US', etc
```

Currently, this is only used in pluralizations (see below for syntax).
You may skip this config if you do not need this feature.

Define translations
-------------------

```coffeescript
Em.I18n.Translations.reopen
  someKey:          'some-value'
  supports:
    nested:
      objects:      'foo'
  'dot.key':        'bar'
  'key with space': 'quux'
```

You can now access your translations via the dot syntax:
* `someKey`: `some-value`
* `supports.nested.objects`: `foo`
* `dot.key`: `bar`
* `"key with space"` - must be quoted: `quux`

In case of ambiguities between dot-keys and object-keys, the dot-key will
always take precedence:

```coffeescript
Em.I18n.Translations.reopen
  foo:
    bar: 'object'
  'foo.bar': 'dot'
```

`{{t foo.bar}}` will always resolve to `dot`.

This can be useful, for example, if you load a set of base translations from
a database somewhere, and you just want to override some specific keys.

Basic usage
-----------

```handlebars
<p>{{t someKey}}</p>
```

yields

```html
<p><span data-ember-i18n-1="1">some-value</span></p>
```

Custom tag
----------

```handlebars
{{t someKey tagName="p"}}
```

yields

```html
<p data-ember-i18n-1="1">some-value</p>
```

Pluralization
-------------

```coffeescript
Em.I18n.Translations.reopen
  'user.one': 'One User'
  'user.other': '{{count}} Users'
```

```handlebars
{{t user count="1"}}
{{t user count="2"}}
```

(Default `<span>` tags omitted from now on)

```html
One User
2 Users
```

`ember-i18n` will look for the translation key with count suffix. These can be
specified with both the dot-syntax and the object-syntax.

`{{count}}` is a special interpolation value used by `ember-i18n` for
pluralization. Using `{{size}}`, `{{amount}}` or anything else will not work.

For English, you will need `*.one` and `*.other`. Other possible values are:
* `*.zero`
* `*.one`
* `*.two`
* `*.few`
* `*.many`
* `*.other`

Please refer to `vendor/plurals.js` for specifications for your language.

If the expected suffix-ed key is not found, `ember-i18n` will default to the
bare key. This can be useful to "disable" pluralization for some specific
cases only:

```coffeescript
Em.I18n.Translations.reopen
  applesTotal: 'Total: {{count}} apples'
```

```handlebars
{{t applesTotal count="5"}}
```

`ember-i18n` will first try to look for `applesTotal.other`, and fallback to
`applesTotal`.

Binding
-------

```coffeescript
Em.I18n.Translations.reopen
  nameDisplay: 'My name is {{name}}'
```

```handlebars
{{t nameDisplay nameBinding="user.name"}}
```

Assume `user.name = 'Foo'`:

```html
My name is Foo
```

It works with pluralization too:

```coffeescript
Em.I18n.Translations.reopen
  starSummary:
    one:   '{{name}} has only one star'
    other: '{{name}} has {{count}} stars'
```

```handlebars
{{t starSummary nameBinding="repo.name" countBinding="repo.stars.length"}}
```

Assume `repo.name = 'Foo Repo'` and `repo.stars.length = 10`:

```html
Foo Repo has 10 stars
```

Interpolation
-------------

```coffeescript
Em.I18n.Translations.reopen
  user: '{{type}} User'
  type: { admin: 'Admin' }
```

```handlebars
{{t user type="type.admin"}}
```

```html
Admin User
```

Going more than one level deep:

```coffeescript
Em.I18n.Translations.reopen
  user: '{{type}} User'
  type: { admin: 'Admin' }
  power: { root: 'Root' }
```

```handlebars
{{t user type="type.admin" power="power.root"}}
```

```html
Root Admin User
```

If both an interpolation and a binding are specified, the binding will take
precedence - although you should not do that anyway.

Literals
--------

```coffeescript
Em.I18n.Translations.reopen
  ranking: 'No. {{rank}}'
  '2': 'two'
```

Numbers are treated as literals by default:

```handlebars
{{t ranking rank="2"}}
```

```html
No. 2
```

`2` is a literal, not an interpolation to a translation at key `2`.

Turn a number into a translation interpolation by prefixing it with `t `
("translate"): (the space after `t` is mandatory)

```handlebars
{{t ranking rank="t 2"}}
```

```html
No. two
```

Caveat with `{{count}}`: pluralization will be off if you pass in a
translation interpolation (there is no longer any number for pluralization).
`ember-i18n` will now look for the bare key (with no pluralization suffix).

```handlebars
{{t user count="t 2"}}
```

`ember-i18n` will now look for the translation template with key `user`, not
`user.other`.

The other way round: `ember-i18n` normally interprets a string as a
translation interpolation. Turn a into a literal by prefixing it with `!t `
("no translate"): (the space after `!t` is also mandatory)

```handlebars
{{t ranking rank="!t one"}}
```

```html
No. one
```

`one` is a literal, not an interpolation to a translation at key `one`.

Translate tag attributes
------------------------

The `{{translateAttr}}` helper works just like the `{{t}}` helper, and
supports all bindings, interpolations and pluralization as described above.

```coffeescript
Em.I18n.Translations.reopen
  figureCaption: 'Fig. {{number}}'
  foo: 'foo-value'
```

```handlebars
<img src="foo.png" {{translateAttr title figureCaption number="3"}}
  {{translateAttr data-foo foo}} />
```

```html
<img src="foo.png" title="Fig. 3" data-foo="foo-value" />
```

An alternative, "short-hand" form, allows you to specify multiple attributes
at once, but it does not support bindings, interpolations, or pluralization
(due to potential ambiguities).

```coffeescript
Em.I18n.Translations.reopen
  'user.new': 'Create new user'
  foo: 'foo-value'
```

```handlebars
<a {{translateAttr title="user.new" data-foo="foo"}}>
  {{t user.new}}
</a>
```

```html
<a title="Create new user" data-foo="foo-value">
  Create new user
</a>
```

Translate tag attributes on a view
----------------------------------

Add the mixin `Em.I18n.TranslateableAttributes` to the view:

```coffeescript
App.FooButtonView = Em.View.extend Em.I18n.TranslateableAttributes,
  tagName: 'button'
```

```coffeescript
Em.I18n.Translations.reopen
  user:
    edit:
      title: 'Edit user'
      text: 'Edit'
```

Specify attribute translations with a `*Translation` suffix:

```handlebars
{{#view App.FooButtonView titleTranslation="user.edit.title"}}
  {{t user.edit.text}}
{{/view}}
```

```html
<button title="Edit user">
  Edit
</button>
```

**Limitation**: `ember-i18n` does not support interpolations, bindings, or
pluralization for attribute translations on views yet, because the `{{t}}`
syntax overlaps with ember's own bindings. Any ideas?

Contributing
============

You are welcome! As usual:

1. Fork
2. Branch
3. Hack
4. **Test**
5. Commit
6. Pull request

`ember-i18n` is written in [ember-script](http://emberscript.com/), which is
99% [coffeescript](http://coffeescript.org/) with some ember-specific
shorthands.

Tests
-----

`ember-i18n` tests are written in [jasmine](http://pivotal.github.com/jasmine/),
run on a mini rails app.

1. Grab a copy of ruby. [RVM](http://rvm.io/) recommended.
2. `bundle install` to install dependencies.
3. You need [phantomjs](http://phantomjs.org/) to run tests. Example:

        # sudo apt-get install phantomjs

4. `guard-jasmine` to run tests, or `guard` for continuous integration testing.

`ember-i18n` has been setup with [guard](https://github.com/guard/guard),
which will continuously monitor lib and spec files for changes and re-run
the tests automatically.

Building distribution js files
------------------------------

`rake dist`. Or `bundle exec rake dist` if you are not using
[RVM](http://rvm.io/), or are not otherwise scoping the bundle.

License
=======

GPL 3.0
