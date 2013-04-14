(function(globals) {

  // CLDR Pluralization Data
  // see http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html

  // The six plural forms. Not all languages use all six forms.
  var Zero = 'zero',
      One = 'one',
      Two = 'two',
      Few = 'few',
      Many = 'many',
      Other = 'other',
      Data = {};

  function isInt(value) {
    return value << 0 === value;
  }

  function isAmong(value, array) {
    for ( var i = 0; i < array.length; ++i ) {
      if (array[i] === value) { return true; }
    }
    return false;
  }

  function define(languages, rule) {
    for ( var i = 0; i < languages.length; ++i ) {
      Data[ languages[i] ] = rule;
    }
  }

  define([
    'az', 'bm', 'my', 'zh', 'dz', 'ka', 'hu', 'ig', 'id', 'ja', 'jv', 'kea',
    'kn', 'km', 'ko', 'ses', 'lo', 'kde', 'ms', 'fa', 'root', 'sah', 'sg',
    'ii', 'th', 'bo', 'to', 'tr', 'vi', 'wo', 'yo'
  ], function(n) {
    return Other;
  });

  define([ 'gv' ], function(n) {
    if ( isAmong(n % 10, [ 1, 2 ]) || n % 20 === 0 ) { return One; }
    return Other;
  });

  define([ 'tzm' ], function(n) {
    if ( n === 0 || n === 1 ) { return One; }
    if ( isInt(n) && n >= 11 && n <= 99 ) { return One; }
    return Other;
  });

  define([ 'mk' ], function(n) {
    return n % 10 === 1 && n !== 11 ? One : Other;
  });

  define([ 'fr', 'ff', 'kab' ], function(n) {
    return n >= 0 && n < 2 ? One : Other;
  });

  define([
    'ak', 'am', 'bh', 'fil', 'guw', 'hi', 'ln', 'mg', 'nso', 'tl', 'ti', 'wa'
  ], function(n) {
    return n === 0 || n === 1 ? One : Other;
  });

  define([
    'af', 'sq', 'eu', 'bem', 'bn', 'brx', 'bg', 'ca', 'chr', 'cgg', 'da', 'dv',
    'nl', 'en', 'eo', 'et', 'ee', 'fo', 'fi', 'fur', 'gl', 'lg', 'de', 'el',
    'gu', 'ha', 'haw', 'he', 'is', 'it', 'kl', 'kk', 'ku', 'lb', 'ml', 'mr',
    'mas', 'mn', 'nah', 'ne', 'no', 'nb', 'nn', 'nyn', 'or', 'om', 'pap', 'ps',
    'pt', 'pa', 'rm', 'ssy', 'saq', 'xog', 'so', 'es', 'sw', 'sv', 'gsw',
    'syr', 'ta', 'te', 'tk', 'ur', 'wae', 'fy', 'zu'
  ], function(n) {
    return n === 1 ? One : Other;
  });

  define([ 'lv' ], function(n) {
    if (n === 0) { return Zero; }
    if (n % 10 === 1 && n % 100 !== 11) { return One; }
    return Other;
  });

  define([ 'ksh' ], function(n) {
    if (n === 0) { return Zero; }
    if (n === 1) { return One; }
    return Other;
  });

  define([ 'lag' ], function(n) {
    if (n === 0) { return Zero; }
    if (n > 0 && n < 2) { return One; }
    return Other;
  });

  define([
    'kw', 'smn', 'iu', 'ga', 'smj', 'se', 'smi', 'sms', 'sma'
  ], function(n) {
    if (n === 1) { return One; }
    if (n === 2) { return Two; }
    return Other;
  });

  define([
    'be', 'bs', 'hr', 'ru', 'sr', 'sh', 'uk'
  ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( mod10 === 1 && n % 100 !== 11 ) { return One; }

    if ( isAmong(mod10, [ 2, 3, 4 ]) &&
         !isAmong(mod100, [ 12, 13, 14 ]) ) { return Few; }

    if ( isAmong(mod10, [ 0, 5, 6, 7, 8, 9 ]) ||
         isAmong(mod100, [ 11, 12, 13, 14 ]) ) { return Many; }

    return Other;
  });

  define([ 'pl' ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( n === 1 ) { return One; }

    if ( isAmong(mod10, [ 2, 3, 4 ]) &&
         !isAmong(mod100, [ 12, 13, 14 ]) ) { return Few; }

    if ( isAmong(mod10, [ 0, 1, 5, 6, 7, 8, 9 ]) ||
         isAmong(mod100, [ 12, 13, 14 ]) ) { return Many; }

    return Other;
  });

  define([ 'lt' ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( mod10 === 1 && mod100 !== 11 ) { return One; }

    if ( isInt(n) &&
         mod10 >= 2 && mod10 <= 9 &&
         mod100 >= 12 && mod100 <= 19 ) { return Few; }

    return Other;
  });

  define([ 'shi' ], function(n) {
    if ( n >= 0 && n <= 1 ) { return One; }
    if ( isInt(n) && n >= 2 && n <= 9 ) { return Few; }
    return Other;
  });

  define([ 'mo', 'ro' ], function(n) {
    var mod100 = n % 100;

    if ( n === 1 ) { return One; }

    if ( n === 0 ||
         (isInt(n) && mod100 >= 1 && mod100 <= 19) ) { return Few; }

    return Other;
  });

  define([ 'cs', 'sk' ], function(n) {
    if ( n === 1 ) { return One; }
    if ( isAmong(n, [ 2, 3, 4 ]) ) { return Few; }
    return Other;
  });

  define([ 'sl' ], function(n) {
    var mod100 = n % 100;
    if ( mod100 === 1 ) { return One; }
    if ( mod100 === 2 ) { return Two; }
    if ( mod100 === 3 || mod100 === 4 ) { return Few; }
    return Other;
  });

  define([ 'mt' ], function(n) {
    if ( n === 1 ) { return One; }
    var mod100 = n % 100;
    if ( isInt(mod100) && mod100 >= 2 && mod100 <= 10 ) { return Few; }
    if ( isInt(mod100) && mod100 >= 11 && mod100 <= 19 ) { return Many; }
    return Other;
  });

  define([ 'ar' ], function(n) {
    if ( n === 0 ) { return Zero; }
    if ( n === 1 ) { return One; }
    if ( n === 2 ) { return Two; }
    var mod100 = n % 100;
    if ( isInt(mod100) && mod100 >= 3 && mod100 <= 10 ) { return Few; }
    if ( isInt(mod100) && mod100 >= 11 && mod100 <= 99 ) { return Many; }
    return Other;
  });

  define([ 'br', 'cy' ], function(n) {
    switch ( n ) {
      case 0: return Zero;
      case 1: return One;
      case 2: return Two;
      case 3: return Few;
      case 6: return Many;
      default: return Other;
    }
  });

  if ( globals.CLDR == null ) { globals.CLDR = {}; }

  var CLDR = globals.CLDR;

  // Look up the proper plural key for a count and language.
  // If CLDR.defaultLanguage is set, language is optional.
  //
  // For example:
  //
  //     CLDR.pluralForm(0, 'en');     // => 'other'
  //     CLDR.pluralForm(1, 'en-US');  // => 'one'
  //     CLDR.pluralForm(2.383, 'fr'); // => 'other'
  //     CLDR.pluralForm(1, 'zh');     // => 'other'
  //     CLDR.pluralForm(26, 'uk');    // => 'many'
  //
  // @return [String] the proper key (one of `CLDR.pluralForm.Zero`,
  //   `.One`, `.Two`, `.Few`, `.Many`, or `.Other`).
  CLDR.pluralForm = function(count, language) {
    if (count == null) { throw new Error("CLDR.pluralForm requires a count"); }
    language = language || CLDR.defaultLanguage;
    if (language == null) { throw new Error("CLDR.pluralForm requires a language"); }
    language = language.replace(/^(\w\w\w?)-?.*/, "$1");
    if (Data[language] == null) { throw new Error("No CLDR pluralization information for " + language); }
    return Data[language].call(CLDR, +count);
  };

  CLDR.pluralForm.Zero  = Zero;
  CLDR.pluralForm.One   = One;
  CLDR.pluralForm.Two   = Two;
  CLDR.pluralForm.Few   = Few;
  CLDR.pluralForm.Many  = Many;
  CLDR.pluralForm.Other = Other;

}(this));
// Generated by EmberScript 0.0.7
void function () {
  var i18n;
  var get$ = Ember.get;
  var set$ = Ember.set;
  i18n = Ember.Object.extend({
    _uuid: 0,
    uuid: function () {
      this.incrementProperty('_uuid');
      return get$(this, '_uuid');
    },
    resolveKey: function (key, count) {
      var keyWithCount, locale, suffix;
      if (!(null != count) || !(locale = get$(get$(get$(Em, 'I18n'), 'Config'), 'locale')))
        return key;
      suffix = CLDR.pluralForm(count, locale);
      keyWithCount = '' + key + '.' + suffix;
      if (!(null != get$(get$(Em, 'I18n'), 'Translations').get(keyWithCount)))
        return key;
      return keyWithCount;
    },
    getTemplate: function (rawKey, count) {
      var key, translation;
      key = this.resolveKey(rawKey, count);
      if (null != (translation = get$(get$(Em, 'I18n'), 'Translations').get(key))) {
        return translation;
      } else {
        return 'Missing translation: ' + key;
      }
    },
    t: function (key, context) {
      var msg;
      if (null == context)
        context = {};
      msg = 'You must provide a string translation key, not ' + typeof key;
      Em.assert(msg, typeof key === 'string');
      return Handlebars.compile(this.getTemplate(key, get$(context, 'count')))(context);
    }
  });
  set$(Em, 'I18n', i18n.create());
}.call(this);// Generated by EmberScript 0.0.7
void function () {
  var config;
  var get$ = Ember.get;
  var set$ = Ember.set;
  config = Ember.Object.extend({
    locale: null,
    translationsKey: 'object'
  });
  set$(get$(Em, 'I18n'), 'Config', config.create());
}.call(this);// Generated by EmberScript 0.0.7
void function () {
  var translations;
  var get$ = Ember.get;
  var set$ = Ember.set;
  translations = Ember.Object.extend({
    get: function (key) {
      if (get$(get$(Em, 'I18n'), 'Config').translationsKey === 'dot' && key.indexOf('.') !== -1) {
        return this[key];
      } else {
        return this._super(key);
      }
    }
  });
  set$(get$(Em, 'I18n'), 'Translations', translations.create());
}.call(this);// Generated by EmberScript 0.0.7
var get$ = Ember.get;
var set$ = Ember.set;
set$(get$(Em, 'I18n'), 'TranslationObject', Ember.Object.extend({
  uuid: null,
  key: null,
  interpolations: null,
  view: null,
  hbContext: null,
  options: null,
  attr: null,
  context: null,
  tagName: 'span',
  format: null,
  init: function () {
    if (null != (null != get$(get$(this, 'options'), 'hash') ? get$(get$(get$(this, 'options'), 'hash'), 'tagName') : void 0))
      set$(this, 'tagName', get$(get$(get$(this, 'options'), 'hash'), 'tagName'));
    this.interpolations || (this.interpolations = get$(get$(this, 'options'), 'hash'));
    this.view || (this.view = get$(get$(get$(this, 'options'), 'data'), 'view'));
    this.context || (this.context = {});
    return this._super.apply(this, arguments);
  },
  html: Ember.computed(function () {
    set$(this, 'format', 'html');
    return '<' + get$(this, 'tagName') + ' data-ember-i18n-' + get$(this, 'uuid') + "='" + get$(this, 'uuid') + "'>" + get$(this, 'value') + '</' + get$(this, 'tagName') + '>';
  }).property('tagName', 'uuid', 'value'),
  attrVal: Ember.computed(function () {
    set$(this, 'format', 'text');
    return 'data-ember-i18n-' + get$(this, 'uuid') + "='" + get$(this, 'uuid') + "' " + get$(this, 'attr') + "='" + get$(this, 'value') + "'";
  }).property('uuid', 'attr', 'value'),
  text: Ember.computed(function () {
    set$(this, 'format', 'text');
    return get$(this, 'value');
  }).property('value'),
  value: Ember.computed(function () {
    var attr, isLiteral, isNumber, isTranslate, match, value;
    for (attr in get$(this, 'interpolations')) {
      value = get$(this, 'interpolations')[attr];
      if (match = this.isBind(attr)) {
        this.interpolateBind(match[1], value);
      } else if (!(null != get$(this, 'context')['' + attr + 'Binding'])) {
        isTranslate = this.isTranslate(value);
        isNumber = this.isNumber(value);
        isLiteral = this.isLiteral(value);
        if (isTranslate || !isNumber && !isLiteral || isNumber && isLiteral) {
          this.interpolateTranslation(attr, (null != isTranslate ? isTranslate[1] : void 0) || value);
        } else {
          this.interpolateLiteral(attr, (null != isLiteral ? isLiteral[1] : void 0) || value);
        }
      }
    }
    return get$(Em, 'I18n').t(get$(this, 'key'), get$(this, 'context'));
  }).property('interpolations', '', 'context'),
  isBind: function (str) {
    return str.match(/^(.+)Binding$/);
  },
  isTranslate: function (str) {
    return str.match(/^t (.+)$/);
  },
  isLiteral: function (str) {
    return str.match(/^!t (.+)$/);
  },
  isNumber: function (str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
  },
  isView: function (str) {
    return str.match(/^view\.(.+)$/);
  },
  matchInterpolations: function (str) {
    var interpolation;
    interpolation = /{{([^}]+)}}/g;
    return function (accum$) {
      var match;
      while (match = interpolation.exec(str)) {
        accum$.push(match[1]);
      }
      return accum$;
    }.call(this, []);
  },
  getInterpolations: function (template) {
    var binding, interpolation, interpolations;
    interpolations = {};
    for (var cache$ = this.matchInterpolations(template), i$ = 0, length$ = cache$.length; i$ < length$; ++i$) {
      interpolation = cache$[i$];
      if (null != (binding = get$(get$(this, 'options'), 'hash')['' + interpolation + 'Binding'])) {
        interpolations['' + interpolation + 'Binding'] = binding;
      } else {
        interpolations[interpolation] = get$(get$(this, 'options'), 'hash')[interpolation];
      }
    }
    return interpolations;
  },
  hbGet: get$(get$(Em, 'Handlebars'), 'get') || get$(get$(Em, 'Handlebars'), 'getPath') || get$(Em, 'getPath'),
  interpolateBind: function (property, value) {
    var cache$, invoker, nPath, observer, path, root, this$;
    get$(this, 'context')[property] = this.hbGet(get$(this, 'hbContext'), value, get$(this, 'options'));
    nPath = get$(Em, 'Handlebars').normalizePath(this, value, get$(get$(this, 'options'), 'data'));
    cache$ = nPath;
    root = cache$.root;
    path = cache$.path;
    if (this.isView(value))
      root = get$(this, 'view');
    observer = (this$ = this, function () {
      var $e;
      if (get$(this$, 'view').get('state') !== 'inDOM') {
        root.removeObserver(path, this$, invoker);
        return;
      }
      get$(this$, 'context')[property] = this$.hbGet(get$(this$, 'hbContext'), value, get$(this$, 'options'));
      $e = get$(this$, 'view').$('[data-ember-i18n-' + get$(this$, 'uuid') + ']');
      switch (get$(this$, 'format')) {
      case 'html':
        return $e.html(get$(Em, 'I18n').t(get$(this$, 'key'), get$(this$, 'context')));
      case 'attrVal':
        return $e.attr(get$(this$, 'attr'), get$(Em, 'I18n').t(get$(this$, 'key'), get$(this$, 'context')));
      }
    });
    invoker = function () {
      return get$(Em, 'run').once(observer);
    };
    return root.addObserver(path, this, invoker);
  },
  interpolateTranslation: function (property, key) {
    var child, interpolations, template;
    template = get$(Em, 'I18n').getTemplate(key, { count: get$(get$(get$(this, 'options'), 'hash'), 'count') });
    interpolations = this.getInterpolations(template);
    child = get$(get$(Em, 'I18n'), 'TranslationObject').create({
      uuid: get$(Em, 'I18n').uuid(),
      key: key,
      interpolations: interpolations,
      view: get$(this, 'view'),
      hbContext: get$(this, 'hbContext'),
      options: get$(this, 'options')
    });
    return get$(this, 'context')[property] = new (get$(Handlebars, 'SafeString'))(child.get(get$(this, 'format')));
  },
  interpolateLiteral: function (property, value) {
    return get$(this, 'context')[property] = value;
  }
}));// Generated by EmberScript 0.0.7
var get$ = Ember.get;
var set$ = Ember.set;
set$(get$(Em, 'I18n'), 'TranslateableAttributes', Ember.Mixin.create({
  didInsertElement: function () {
    var key, match, path, result;
    result = this._super.apply(this, arguments);
    for (key in this) {
      path = this[key];
      if (match = key.match(/^(.+)Translation$/))
        this.$().attr(match[1], get$(Em, 'I18n').t(path));
    }
    return result;
  }
}));// Generated by EmberScript 0.0.7
var get$ = Ember.get;
Handlebars.registerHelper('t', function (key, options) {
  var translation;
  translation = get$(get$(Em, 'I18n'), 'TranslationObject').create({
    uuid: get$(Em, 'I18n').uuid(),
    key: key,
    hbContext: this,
    options: options
  });
  return new (get$(Handlebars, 'SafeString'))(get$(translation, 'html'));
});// Generated by EmberScript 0.0.7
var get$ = Ember.get;
var set$ = Ember.set;
Handlebars.registerHelper('translateAttr', function (attr, key, options) {
  var attrVals, cache$, hash, translation;
  if (typeof attr === 'object') {
    options = attr;
    cache$ = [
      get$(options, 'hash'),
      {}
    ];
    hash = cache$[0];
    set$(options, 'hash', cache$[1]);
    attrVals = function (accum$) {
      var eachAttr, eachKey, translation;
      for (eachAttr in hash) {
        eachKey = hash[eachAttr];
        translation = get$(get$(Em, 'I18n'), 'TranslationObject').create({
          uuid: get$(Em, 'I18n').uuid(),
          key: eachKey,
          hbContext: this,
          options: options,
          attr: eachAttr
        });
        accum$.push(get$(translation, 'attrVal'));
      }
      return accum$;
    }.call(this, []);
    return new (get$(Handlebars, 'SafeString'))(attrVals.join(' '));
  }
  translation = get$(get$(Em, 'I18n'), 'TranslationObject').create({
    uuid: get$(Em, 'I18n').uuid(),
    key: key,
    hbContext: this,
    options: options,
    attr: attr
  });
  return new (get$(Handlebars, 'SafeString'))(get$(translation, 'attrVal'));
});