(function(window) {
  var I18n, assert, findTemplate, get, set, isBinding, lookupKey, pluralForm,
      keyExists;

  get = Ember.Handlebars.get || Ember.Handlebars.getPath || Ember.getPath;
  set = Ember.set;

  function warn(msg) { Ember.Logger.warn(msg); }

  if (typeof CLDR !== "undefined" && CLDR !== null) pluralForm = CLDR.pluralForm;

  if (pluralForm == null) {
    warn("CLDR.pluralForm not found. Em.I18n will not support count-based inflection.");
  }

  lookupKey = function(key, hash) {
    var firstKey, idx, remainingKeys;

    if (hash[key] != null) { return hash[key]; }

    if ((idx = key.indexOf('.')) !== -1) {
      firstKey = key.substr(0, idx);
      remainingKeys = key.substr(idx + 1);
      hash = hash[firstKey];
      if (hash) { return lookupKey(remainingKeys, hash); }
    }
  };

  assert = Ember.assert != null ? Ember.assert : window.ember_assert;

  findTemplate = function(key, setOnMissing) {
    assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
    var result = lookupKey(key, I18n.translations);

    if (setOnMissing) {
      if (result == null) {
        result = I18n.translations[key] = function() { return "Missing translation: " + key; };
        result._isMissing = true;
        warn("Missing translation: " + key);
        I18n[(typeof I18n.trigger === 'function' ? 'trigger' : 'fire')]('missing', key); //Support 0.9 style .fire
      }
    }

    if ((result != null) && !jQuery.isFunction(result)) {
      result = I18n.translations[key] = I18n.compile(result);
    }

    return result;
  };

  keyExists = function(key) {
    var translation = lookupKey(key, I18n.translations);
    return translation != null && !translation._isMissing;
  };

  function eachTranslatedAttribute(object, fn) {
    var isTranslatedAttribute = /(.+)Translation$/,
        isTranslatedAttributeMatch;

    for (var key in object) {
      isTranslatedAttributeMatch = key.match(isTranslatedAttribute);
      if (isTranslatedAttributeMatch) {
        fn.call(object, isTranslatedAttributeMatch[1], I18n.t(object[key]));
      }
    }
  }

  I18n = Ember.Evented.apply({
    compile: Handlebars.compile,

    translations: {},

    template: function(key, count) {
      var interpolatedKey, result, suffix;
      if ((count != null) && (pluralForm != null)) {
        suffix = pluralForm(count);
        interpolatedKey = "%@.%@".fmt(key, suffix);
        result = findTemplate(interpolatedKey, false);
      }
      return result != null ? result : result = findTemplate(key, true);
    },

    t: function(key, context) {
      var template;
      if (context == null) context = {};
      template = I18n.template(key, context.count);
      return template(context);
    },

    exists: keyExists,

    TranslateableProperties: Em.Mixin.create({
      init: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          set(this, attribute, translation);
        });
        return result;
      }
    }),

    TranslateableAttributes: Em.Mixin.create({
      didInsertElement: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          this.$().attr(attribute, translation);
        });
        return result;
      }
    })
  });

  Ember.I18n = I18n;

  isBinding = /(.+)Binding$/;

  var THelperSupport = Ember.Mixin.create({
    render: function(buffer) {
      buffer.push(this.get('translatedText'));
    },

    translatedText: function() {
      var key = this.get('translationKey');
      if (this.get('keyIsBound')) {
        key = Ember.get(this.get('context'), key);
      }
      console.log("key", key);
      return I18n.t(key, this);
    }.property().volatile()
  });

  var TagTranslationView = Ember.View.extend(THelperSupport),
      TaglessTranslationView = Ember._MetamorphView.extend(THelperSupport);

  // CRUFT: in v2, which requires Ember 1.0+, Ember.uuid will always be
  //        available, so this function can be cleaned up.
  var uniqueElementId = (function(){
    var id = Ember.uuid || 0;
    return function() {
      var elementId = 'i18n-' + id++;
      return elementId;
    };
  })();

  Ember.Handlebars.registerHelper('t', function(key, options) {
    var View, view;
    if (options.tagName == null) {
      View = TagTranslationView.extend({ tagName: options.tagName });
    } else {
      View = TaglessTranslationView;
    }
    view = View.create(options.hash, {
      keyIsBound: options.types[0] !== "STRING",
      translationKey: key
    });
    return Ember.Handlebars.ViewHelper.helper(this, view, options);
  });

  Handlebars.registerHelper('translateAttr', function(options) {
    var attrs, result;
    attrs = options.hash;
    result = [];

    Em.keys(attrs).forEach(function(property) {
      var translatedValue;
      translatedValue = I18n.t(attrs[property]);
      return result.push('%@="%@"'.fmt(property, translatedValue));
    });

    return new Handlebars.SafeString(result.join(' '));
  });

}).call(undefined, this);
