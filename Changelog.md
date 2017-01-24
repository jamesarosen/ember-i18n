## 4.5.0

 * `{{t}}` helper supports a context object as a second ordered argument;
   named (hash) arguments override context object ones when interpolating

## 4.4.0

 * Do not observe computed properties that are not consumed
 * Update use of `ember-getowner-polyfill` to match the true polyfill changes
   made to the addon.

## 4.3.2

 * `index.js` does _has Ember.Helper_ check in `init` rather than
   `config` so the build _reliably_ includes the right helper code

## 4.3.1

 * Define no-op `ember-i18n` initializer and instance-initializer.
   These were removed in 4.3.0 because they are no longer needed,
   but some applications were declaring their own initialization
   `before` or `after` those initializers.

## 4.3.0

 * Include Ember 1.12 support only on Ember 1.12. This project now
   uses ember-cli-version-checker and broccoli-funnel to selectively
   include library files based on the Ember version.
 * Support Glimmer2 by allowing `namedArgs` to be an `EmptyObject`
 * use `Ember.String.htmlSafe` instead of
   `new Ember.Handlebars.SafeString`
 * Check the `_isMissing` flag on generated translations so
   missing translations _stay missing_
 * Reserve `locale` and `htmlSafe` attributes for future library use
 * Ignore `.ember-cli` so developers can customize their setup
 * Don't use QUnit 2+ for tests

## 4.2.2

 * set `isLocalizationFramework` for other addons
 * change `Stream` import to support latest Ember (even though
   ember-i18n doesn't _rely_ on `Stream` for Ember 1.13+, it needs
   to _import_ it)

## 4.2.1

 * use `Ember.assign` instead of `Ember.merge` if available
 * add `no` locale support

## 4.2.0

 * remove `Stream` awareness from `service:i18n` to ensure streamless
   operation on Ember 1.13+
 * correct Polish pluralization
 * pass ID to `Ember.warn` to prevent deprecation warnings
 * `missingMessage` gets called on the `service:i18n` instance
 * coerce `count` to a number
 * don't use ES2015 classes to ensure IE8 compatibility
 * use public `getOwner` API for container / registry functions

## 4.1.4

 * fix incompatibility with Ember 2.2 `Stream` class
 * `I18nService#locales` are now sorted
 * `t` macro adds `i18n.locale` as a dependency so macro-defined
   properties update when the locale changes

## 4.1.3

 * More Ember 2.1 compatibility

## 4.1.2

 * Ember 2.1 compatibility

## 4.1.1

 * prevent warnings about missing `rtl` definition for included locales
 * improve warning about missing `rtl` for app-defined locales

## 4.1.0

 * `service:i18n` now has a `locales` property that lists available locales
 * support passing an `Array` of fallback keys via `default: [...]`
 * if the app specifies an unknown locale, fall back to the configuration for
   `zh` and print a warning instead of throwing an exception
 * use `Object.keys`, not `Ember.keys` for enumerating properties
 * destroy the `Stream` created in the legacy helper (pre-Glimmer) when its
   view is destroyed
 * test against Ember 1.12

## 4.0.0

 * declare a valid SPDX license (no change in license, just in the
   string representation)
 * support apps with `podModuleSuffix`

## 4.0.0-beta.4

 * relax ember dependency to `>=1.12.0 <1.13.0 || >=1.13.1 <3.0.0`, which is
   "1.12.x, 1.13.x except 1.13.0, and 2.x".

## 4.0.0-beta.3

 * Support Ember 1.13.1+ and 2.0+. **Note** this release is not compatible with
   v1.13.0 and never will be.
 * Stop auto-injecting `service:i18n` into Components, Controllers, and Routes.
   Clients should instead use `i18n: Ember.inject.service()` as needed.
 * Fix Spanish spelling.
 * Fix `{{t}}` helper with dynamic keys.
 * Add `locale` blueprint
 * Use `Ember.Helper` if available (Ember >= 1.13)
 * Use `Ember.Service` if available (Ember >= 1.13)
 * Remove dependency on `Ember.EnumerableUtils.map` as that will be removed in
   Ember 2.0.

## 4.0.0-beta.2

 * add repository to `package.json`
 * use get to look up i18n service
 * `t` macro works without passing an interpolations map
 * fix bug in `add-translations` when there were no existing translations
   for the locale

## 4.0.0-alpha

 * Restart project as a native Ember-CLI addon
 * Translations now recompute when locale changes
 * Move central API to `service:i18n`, which exposes `locale`, `t`, and
   `addTranslations`
 * Add `translationMacro` for defining translated computed properties
 * Remove `eachTranslatedAttribute`, `TranslateableProperties`, and
   `TranslateableAttributes`, which are better expressed as computed
   property macros
 * Built-in compiler now applies RTL Unicode markers *before* marking the
   result HTML-safe. (Previously, `rtl = true` broke HTML safety.)

## 3.0.1

 * Fix a bug where `missingMessage` held on to the first `context` it was sent for a given translation key. Now it recomputes on each invocation.

## 3.0.0

 * Compatible with Ember 1.x. Notably, compatible with Ember 1.10+, which Ember-I18n 2.9.1 was not.
 * Compatible with Handlebars 1.x and 2.x.
 * Basic Ember-CLI support. When using Ember-I18n as an Ember-CLI add-on, it installs itself as a Bower dependency and adds `i18n.js` and `i18n-plurals.js` to the app.
 * Drop built-in support for Handlebars template compilation. Ember-I18n ships with support for very basic Handlebars-style templates like `"Hello, {{person.name}}"`. The template compilation method is part of the public API and can be overridden.
 * Built-in translation compiler is more friendly to whitespace within interpolations.
 * Drop support for the external `CLDR.js` definition of pluralization rules. These rules are now included as `i18n-plurals.js`
 * `{{t}}` helper uses `registerBoundHelper`. This makes the code smaller and faster. The helper no longer supports passing `tagName`. The helper no longer obeys the `I18N_TRANSLATE_HELPER_SPAN` environment flag.
 * `eachTranslatedAttribute` gracefully handles `null` translation keys
 * Drop support for `{{translateAttr}}`. This helper was unbound. Instead use a sub-expression: `<img title="{{unbound (t 'my.img.title')}}>"`.
 * Interpolations are always escaped by default. (This was the intended behavior before, but there were bugs that caused some interpolations to come through unescaped.) Use `Ember.Handlebars.SafeString` or triple-stache notation to avoid over-escaping.
 * `TranslateableProperties` cleans up translated property observers on destroy
 * `missingMessage` takes the context as well as the translation key so users can generate more contextually-aware "missing template" messages.

## 2.9.1, 2.2.3, 2.1.1 (2014-12-24)

 * Handlebars-less template compiler escapes interpolations
   by default. Use triple-stache syntax or
   `Ember.Handlebars.SafeString` for HTML-safe interpolations.

## 2.9.0 2014-10-20

 * Ember-I18n 2.9+ is not compatible with Ember 1.9+
 * Use `Ember.$.isFunction` instead of `jQuery.isFunction`
 * Deprecate use of `tagName` in the `{{t}}` helper
 * Implement pluralization logic in this project and remove
   dependency on CLDR.js
 * Expose `I18n.missingMessage` for customising the
   "missing translation" message
 * `Makefile` ensures the environment has `node`, `npm`,
   and `phantomjs`

## 2.2.2 2014-09-16

 * Use internal UUID generation, since implementations differ
   across Ember versions
 * Select template compiler on first use so
   `Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS` is sure to have
   been set properly.
 * Fix TranslateableAttributes tests on Ember Canary
 * Better messaging during the build process

## 2.2.1 2014-08-17

 * Fixed overeager warnings related to I18N_COMPILE_WITHOUT_HANDLEBARS
   and unquoted key arguments to the `{{t}}` helper.

## 2.2.0 2014-08-16

 * The `{{t}}` helper now warns if passed an unquoted key argument.
   It still uses unquoted arguments as string literals, but this
   behavior will change in the next major release.
 * Removed deprecation warning for those who've opt-in to
   `I18N_COMPILE_WITHOUT_HANDLEBARS`
 * Fixed a typo in the warning message for
   `I18N_COMPILE_WITHOUT_HANDLEBARS`
 * Remove check for `Ember.I18n.fire` as that was only
   necessary on Ember 0.9, which this library no longer supports.
 * Don't warn on missing translations. Clients that want to be notified
   can subscribe to the `missing` event on `Ember.I18n`.
 * `compileWithHandlebars` uses saved-off `warn` helper (which
   uses `Ember.Logger.warn` rather than `Ember.warn`).
 * Run separate Travis builds for each dependency set.
 * Add Sinon as a test dependency and use its spies in specs.

## 2.1.0 2014-08-08

 * Use `Ember.uuid` to generate unique IDs
 * Add a Handlebars-less compiler; enable with
   `Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS = true;`
 * `{{t}}` helper uses Metamorph tags.
 * `{{t}}` helper: allow turning off the default `<span>`
   tag; enable with
   `Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN = false;`

## 2.0.0 2014-05-28

 * Drop support for Ember 0.x.

## v1.6.4 2014-05-27

 * Use `Ember.Handlebars`, not `Handlebars` for helper management
 * The default `compileTemplate` throws an `Ember.Error` if the full
   `Ember.Handlebars` is not available
 * Check `view.$()` instead of `view.state` as Ember is deprecating the
   latter in favor in favor of `view._state`, but doesn't consider either
   to be part of the public API.
 * Convert `Em` to `Ember` for consistency

## v1.6.3 2014-02-19

 * relax CLDR and Handlebars dependencies via the `^` operator

## v1.6.2 2014-02-19

 * relax Ember dependency to ">0.9.7 <2"

## v1.6.1 2014-02-09

 * relax jQuery dependency to ">=1.7 <3"

## v1.6.0 2014-02-06

 * Add `Ember.I18n.on`
 * Emit `missing` events when translation missin
 * Add `{{ta}}` helper as shorthand for `{{translateAttr}}`
 * `TranslateableProperties` observes when the translation key changes
 * Use the `afterRender` queue if available (Ember 1+)
 * Expose `Ember.I18n.eachTranslatedAttribute`

## v1.5.0 2013-07-30

 * Add Ember warning if missing translation
 * Add `I18n.exists(key)`
 * Avoid calling `compile` for missing translations

## v1.4.1 2013-06-25

 * Don't rely on `Ember.uuid`, but use it if Ember defines it

## v1.4.0 2013-06-04

 * No more CoffeeScript
 * Use `Ember.uuid` instead of `jQuery.uuid`
 * Change license to APLv2
 * Dotted-style keys win over nested-style keys
 * Add `TranslateableProperties` mixin

## v1.3.2 2013-01-09

 * Support use with `jQuery.noconflict`

## v1.3.1 2013-01-03

 * Support defining translations in nested objects
 * Prefer `Ember.assert` to `ember_assert`
 * Add Bower support
 * Use `Ember.Handlebars.get` instead of `getPath` if on Ember 1

## v1.3.0 2012-04-20

 * Remove all references to `Sproutcore` and `SC`
 * Use correct context for `getPath` when getting the value of a bound attribute

## v1.2.0 2012-02-14

 * Add inflection support via CLDR.js

## v1.1.0 2012-01-24

 * Use MIT license
 * Make `I18n` available in the `Ember` namespace
 * Use `Ember`, not `Sproutcore`

## v1.0.0 2011-09-29

Initial version
