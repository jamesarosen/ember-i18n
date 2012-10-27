## Ember.I18n

Internationalization for Ember

### Requirements

Set `Em.I18n.translations` to an object containing your translation
information. If you want to support inflection based on `count`, you will
also need to include the
[CLDR.js pluralization library](https://github.com/jamesarosen/CLDR.js)
and set `CLDR.defaultLocale` to the current locale code (e.g. "de").

### Examples

Given

    Em.I18n.translations = {
      'user.edit.title': 'Edit User',
      'user.followers.title.one': 'One Follower',
      'user.followers.title.other': 'All {{count}} Followers',
      'button.add_user.title': 'Add a user',
      'button.add_user.text': 'Add',
      'button.add_user.disabled': 'Saving...'
    };

#### A simple translation:

    <h2>{{t user.edit.title}}</h2>

yields

    <h2><span id="i18n-123">Edit User</span></h2>

#### Remove the `span` by specifying a `tagName`:

    {{t user.edit.title tagName="h2"}}

yields

    <h2 id="i18n-123">Edit User</h2>

#### Set interpoloated values directly:

    <h2>{{t user.followers.title count="2"}}</h2>

yields

    <h2><span id="i18n-123">All 2 Followers</span></h2>

#### Bind interpolated values:

    <h2>{{t user.followers.title countBinding="user.followers.count"}}</h2>

yields

    <h2><span id="i18n-123">All 2 Followers</span></h2>

if `user.getPath('followers.count)` returns `2`.

#### Translate attributes in a view:

Add the mixin `Em.Button.reopen.call(Em.Button, Em.I18n.TranslateableAttributes)` and use like this:


    {{#view Em.Button titleTranslation="button.add_user.title">
      {{t button.add_user.text}}
    {{/view}}

yields

    <button title="Add a user">
      Add
    </button>

#### Translate attributes on a plain tag:

    <a {{translateAttr title="button.add_user.title"
                        data-disable-with="button.add_user.disabled"}}>
      {{t button.add_user.text}}
    </a>

yields

    <a title="Add a user" data-disable-with="Saving...">
      Add
    </a>

### Limitations

 * There is no way to pass interpolations to attribute translations. I can't
   think of a syntax to support this. It *might* be possible to look up
   interpolations from the current context.
 * `Em.I18n.translations` **must** be fully populated before Ember
   renders any views. There are no bindings on the translations themselves,
   so Ember will not know to re-render views when translations change.

### Building

To build ember-i18n from a clone of this repository, you will need to install
a few Ruby gems defined in the Gemfile and use Rake. These instructions assume
you have a recent version of Ruby and the Bundler gem.

To install the gems, use `bundle install`. This only needs to be done once.
You will also need a coffeescript compiler, if you don't already have one;
`npm install -g coffee-script` should take care of that for you. Then you
should be able to use the following Rake commands:

    rake compile # Compiles coffeescript to JS
    rake build:latest # Creates a build version, ember-i18n-latest.js, in the dist/ directory

For more detail on running tests and contributing, see [CONTRIBUTING.md](https://github.com/jamesarosen/ember-i18n/blob/master/CONTRIBUTING.md).