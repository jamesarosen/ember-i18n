## Ember.I18n

Internationalization for Ember

### Requirements

Set `Ember.I18n.translations` to an object containing your translation
information. If the values of `Ember.I18n.translations` are `Function`s,
they will be used as-is; if they are `String`s, they will first be
compiled via `Ember.I18n.compile`, which defaults to using
`Handlebars.compile`. (That means that if you haven't precompiled your
translations, you'll need to include the full Handlebars, not just
`handlebars-runtime.js` in your application.)

If you want to support inflection based on `count`, you will
also need to include the
[CLDR.js pluralization library](https://github.com/jamesarosen/CLDR.js)
and set `CLDR.defaultLanguage` to the current locale code (e.g. "de").

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

To disable missing translation warnings in console
```javascript
Ember.ENV.I18N_LOG_MISSING_TRANSLATIONS = false;
```

#### A simple translation:
```html
<h2>{{t "user.edit.title"}}</h2>
```
yields
```html
<h2><span id="i18n-123">Edit User</span></h2>
```
#### Remove the `span` by specifying a `tagName`:
```html
{{t "user.edit.title" tagName="h2"}}
```
yields
```html
<h2 id="i18n-123">Edit User</h2>
```
#### Set interpolated values directly:
```html
<h2>{{t "user.followers.title" count="2"}}</h2>
```
yields
```html
<h2><span id="i18n-123">All 2 Followers</span></h2>
```
#### Bind interpolated values:
```html
<h2>{{t "user.followers.title" countBinding="user.followers.count"}}</h2>
```
yields
```html
<h2><span id="i18n-123">All 2 Followers</span></h2>
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
  Add
</button>
```

#### Translate attributes on a plain tag:
```html
<a {{translateAttr title="button.add_user.title" data-disable-with="button.add_user.disabled"}}>
  {{t "button.add_user.text"}}
</a>
```
yields
```html
<a title="Add a user" data-disable-with="Saving...">
  Add
</a>
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

### Limitations

 * There is no way to pass interpolations to attribute translations. I can't
   think of a syntax to support this. It *might* be possible to look up
   interpolations from the current context.
 * `Em.I18n.translations` **must** be fully populated before Ember
   renders any views. There are no bindings on the translations themselves,
   so Ember will not know to re-render views when translations change.

### Building

For more detail on running tests and contributing, see [CONTRIBUTING.md](https://github.com/jamesarosen/ember-i18n/blob/master/CONTRIBUTING.md).
