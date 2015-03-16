## Ember-I18n

Internationalization for Ember

### Requirements

Ember-I18n requires

 * Ember v1.x
 * Handlebars-runtime v1.x - v2.x
 * jQuery v1.7 - v2.x

Set `Ember.I18n.translations` to an object containing your translation
information. If the values of `Ember.I18n.translations` are `Function`s,
they will be used as-is; if they are `String`s, they will first be
compiled via `Ember.I18n.compile`, which defaults to using
`Handlebars.compile`. (That means that if you haven't precompiled your
translations, you'll need to include the full Handlebars, not just
`handlebars-runtime.js` in your application.)

### Examples

Given
```javascript
Em.I18n.translations = {
  'user.edit.title': 'Edit User',
  'user.followers.title.one': 'One Follower',
  'user.followers.title.other': 'All {{count}} Followers',
  'button.add_user.title': 'Add a user',
  'button.add_user.text': 'Add',
  'button.add_user.disabled': 'Saving...'
};
```

#### A simple translation:
```html
<h2>{{t "user.edit.title"}}</h2>
```
yields
```html
<h2>
  <script id="metamorph-28-start"></script>
  Edit User
  <script id="metamorph-28-end"></script>
</h2>
```

#### A translation based on a bound key:
```html
<h2>{{t title_i18n_key}}</h2>
```
yields
```html
<h2>
  <script id="metamorph-28-start"></script>
  Add a user
  <script id="metamorph-28-end"></script>
</h2>
```
if `controller.title_i18n_key` is `'button.add_user.title'`. If
it subsequently changes to `'user.edit.title'`, the HTML will
become
```html
<h2>
  <script id="metamorph-28-start"></script>
  Edit User
  <script id="metamorph-28-end"></script>
</h2>
```

#### Set interpolated values directly:
```html
<h2>{{t "user.followers.title" count="2"}}</h2>
```
yields
```html
<h2>
  <script id="metamorph-28-start"></script>
  All 2 Followers
  <script id="metamorph-28-end"></script>
</h2>
```

#### Bind interpolated values:
```html
<h2>{{t "user.followers.title" countBinding="user.followers.count"}}</h2>
```
yields
```html
<h2>
  <script id="metamorph-28-start"></script>
  All 2 Followers
  <script id="metamorph-28-end"></script>
</h2>
```
if `user.getPath('followers.count')` returns `2`.

#### Translate properties on any object:

The `Em.I18n.TranslateableProperties` mixin automatically translates
any property ending in `"Translation"`:
```javascript
userButton = Em.Object.extend(Em.I18n.TranslateableProperties, {
  labelTranslation: 'button.add_user.title'
});

userButton.get('label');
```
yields

    "Add a user"

#### Translate attributes in a view:

Add the mixin `Em.Button.reopen(Em.I18n.TranslateableAttributes)` and use like this:

```html
{{#view Em.Button titleTranslation="button.add_user.title">
  {{t "button.add_user.text"}}
{{/view}}
```
yields
```html
<button title="Add a user">
  <script id="metamorph-28-start"></script>
  Add
  <script id="metamorph-28-end"></script>
</button>
```

#### Nested Translation Syntax:

The above translation data can also be expressed as nested JSON objects:
```javascript
Em.I18n.translations = {
  'user': {
    'edit': {
      'title': 'Edit User'
    },
    'followers': {
      'title': {
        'one': 'One Follower',
        'other': 'All {{count}} Followers'
      }
    }
  },
  'button': {
    'add_user': {
      'title': 'Add a user',
      'text': 'Add',
      'disabled': 'Saving...'
    }
  }
};
```
This format is often smaller and so makes downloading translation packs faster.

### Pluralization

If you want to support inflection based on `count`, you will
also need to include Ember-I18n's pluralization support (`lib/i18n-plurals.js`)
*after* the Ember-I18n core (`lib/i18n.js`) itself and set `Ember.I18n.locale`
to the current locale code (e.g. "de").

```javascript
Em.I18n.locale = 'en';
```

Now whenever you pass the `count` option to the `t` function, template will be pluralized:

```javascript
Em.I18n.locale = 'en';

Em.I18n.translations = {
  'dog': {
    'one': 'a dog',
    'other': '{{count}} dogs'
  }
};

Em.I18n.t('dog', { count: 1 }); // a dog
Em.I18n.t('dog', { count: 2 }); // 2 dogs
```

The suffixes 'one' and 'other' are appended automatically.

Example using pluralization in the template:

```html
{{t 'dog' count=dogs.length}} // Assuming dogs property is an array
```

Depending on the locale there could be up to 6 plural forms used, namely: 'zero', 'one', 'two', 'few', 'many', 'other'.

### Missing translations

When `t` is called with a nonexistent key, it returns the result of calling
`Ember.I18n.missingMessage` with the key and the context as arguments. The
default behavior is to return "Missing translation: [key]", but you can
customize this by overriding `missingMessage`. The below example spits out the
key along with the values of any arguments that were passed:

```javascript
Ember.I18n.missingMessage = function(key, context) {
  var values = Object.keys(context).map(function(key) { return context[key]; });
  return key + ': ' + (values.join(', '));
};

Ember.I18n.t('nothing.here', { arg1: 'foo', arg2: 'bar' });
// => "nothing.here: foo, bar"
```

When a missing translation is encountered, a `missing` event is also triggered
on `Ember.I18n`, with the key and the context as arguments. You can use this to
execute other missing-translation behaviors unrelated to the `missingMessage`,
such as logging the key somewhere.

```javascript
Ember.I18n.on('missing', function(key, context) {
  Ember.Logger.warn("Missing translation: " + key);
};
```

### Using with Ember-cli

Install ember-i18n as node module:
```
npm install ember-i18n --save-dev
```

Run generator to fetch dependencies:
```
ember generate ember-i18n
```

That's it.

### Limitations

 * There is no way to pass interpolations to attribute translations. I can't
   think of a syntax to support this. It *might* be possible to look up
   interpolations from the current context.
 * `Em.I18n.translations` **must** be fully populated before Ember
   renders any views. There are no bindings on the translations themselves,
   so Ember will not know to re-render views when translations change.

### Building

For more detail on running tests and contributing, see [CONTRIBUTING.md](https://github.com/jamesarosen/ember-i18n/blob/master/CONTRIBUTING.md).
