(function() {
  var I18n, assert, findTemplate, get, set, lookupKey,
      EmHandlebars, keyExists;

  EmHandlebars = Ember.Handlebars;
  get = Ember.get;
  set = Ember.set;
  assert = Ember.assert;

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

  findTemplate = function(key) {
    assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
    var result = lookupKey(key, I18n.translations);

    if ((result != null) && !Ember.$.isFunction(result)) {
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
        var translation = object[key] == null ? null : I18n.t(object[key]);
        fn.call(object, isTranslatedAttributeMatch[1], translation);
      }
    }
  }

  var escapeExpression = EmHandlebars.Utils.escapeExpression;

  function compileTemplate(template) {
    return function(data) {
      return template
        .replace(/\{\{\{\s*(.*?)\s*\}\}\}/g, function(i, match) {
          // tripple curlies -> no-escaping
          return get(data, match);
        }).replace(/\{\{\s*(.*?)\s*\}\}/g, function(i, match) {
         return escapeExpression( get(data, match) );
        });
    };
  }

  I18n = Ember.Evented.apply({
    pluralForm: undefined,

    compile: compileTemplate,

    translations: {},

    // Ember.I18n.eachTranslatedAttribute(object, callback)
    //
    // Iterate over the keys in `object`; for each property that ends in "Translation",
    // call `callback` with the property name (minus the "Translation" suffix) and the
    // translation whose key is the property's value.
    eachTranslatedAttribute: eachTranslatedAttribute,

    template: function(key, count) {
      var interpolatedKey, result, suffix;
      if ((count != null) && (I18n.pluralForm != null)) {
        suffix = I18n.pluralForm(count);
        interpolatedKey = "%@.%@".fmt(key, suffix);
        result = findTemplate(interpolatedKey);
      }
      return result != null ? result : findTemplate(key);
    },

    t: function(key, context) {
      var template;
      if (context == null) context = {};
      template = I18n.template(key, get(context, 'count'));

      if (template == null || template._isMissing) {
        template = I18n.translations[key] = function() {
          return I18n.missingMessage(key, context);
        };
        template._isMissing = true;
        I18n.trigger('missing', key, context);
      }

      if (I18n.rtl) {
        return "\u202B" + template(context) + "\u202C";
      } else {
        return template(context);
      }
    },

    exists: keyExists,

    missingMessage: function(key) {
      return "Missing translation: " + key;
    },

    TranslateableProperties: Ember.Mixin.create({
      _translationObserver: function(sender, propWithSuffix) {
        var prop = propWithSuffix.replace(/Translation$/, '');
        set(this, prop, I18n.t(this.get(propWithSuffix)));
      },

      _addTranslationObservers: function() {
        eachTranslatedAttribute(this, function(attribute, translation) {
          this.addObserver(attribute + 'Translation', this, this._translationObserver);
          set(this, attribute, translation);
        });
      },

      _scheduleObservers: function() {
        Ember.run.scheduleOnce('render', this, this._addTranslationObservers);
      }.on('init'),

      _removeTranslationObservers: function (){
        eachTranslatedAttribute(this, function(attribute) {
          var propWithSuffix = attribute + 'Translation';
          if(this.hasObserverFor(propWithSuffix)) {
            this.removeObserver(propWithSuffix, this._translationObserver);
          }
        });
      }.on('willDestroyElement','willClearRender')
    }),

    TranslateableAttributes: Ember.Mixin.create({
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

  EmHandlebars.registerBoundHelper('t', function(key, options) {
    return new EmHandlebars.SafeString(I18n.t(key, options.hash));
  });

}).call(undefined);
