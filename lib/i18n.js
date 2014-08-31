(function(window) {
  var I18n, assert, findTemplate, get, set, isBinding, lookupKey, pluralForm,
      PlainHandlebars, EmHandlebars, keyExists,
      compileTemplate, compileWithHandlebars;

  PlainHandlebars = window.Handlebars;
  EmHandlebars = Ember.Handlebars;
  get = EmHandlebars.get;
  set = Ember.set;
  assert = Ember.assert;

  function warn(msg) { Ember.Logger.warn(msg); }

  if (typeof CLDR !== "undefined" && CLDR !== null) pluralForm = CLDR.pluralForm;

  if (pluralForm == null) {
    warn("CLDR.pluralForm not found. Ember.I18n will not support count-based inflection.");
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

  findTemplate = function(key, setOnMissing) {
    assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
    var result = lookupKey(key, I18n.translations);

    if (setOnMissing) {
      if (result == null) {
        result = I18n.translations[key] = function() { return "Missing translation: " + key; };
        result._isMissing = true;
        I18n.trigger('missing', key);
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

  compileWithHandlebars = (function() {
    if (Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS === undefined) {
      warn("Ember.I18n will no longer include Handlebars compilation by default in the future; instead, it will supply its own default compiler. Set Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS to true to opt-in now.");
    }

    if (typeof PlainHandlebars.compile === 'function') {
      return function compileWithHandlebars(template) {
        return PlainHandlebars.compile(template);
      };
    } else {
      return function cannotCompileTemplate() {
        throw new Ember.Error('The default Ember.I18n.compile function requires the full Handlebars. Either include the full Handlebars or override Ember.I18n.compile.');
      };
    }
  }());

  function compileWithoutHandlebars(template) {
    return function (data) {
      return template.replace(/\{\{(.*?)\}\}/g, function(i, match) {
        return data[match];
      });
    };
  }

  if (Ember.ENV.I18N_COMPILE_WITHOUT_HANDLEBARS === true) {
    compileTemplate = compileWithoutHandlebars;
  } else {
    compileTemplate = compileWithHandlebars;
  }

  I18n = Ember.Evented.apply({
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

    TranslateableProperties: Ember.Mixin.create({
      init: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          this.addObserver(attribute + 'Translation', this, function(){
            set(this, attribute, I18n.t(this.get(attribute + 'Translation')));
          });
          set(this, attribute, translation);
        });

        return result;
      }
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

  isBinding = /(.+)Binding$/;

  function uniqueElementId() {
    if (Ember.typeOf(Ember.uuid) === 'function') {
      return Ember.uuid();
    } else {
      return ++Ember.uuid;
    }
  }

  var TranslationView = Ember._MetamorphView.extend({

    translationKey: null,

    wrappingTagName: Ember.computed(function(propertyName, newValue) {
      if (arguments.length > 1 && newValue != null) { return newValue; }

      var useSpanByDefault;

      if (Ember.FEATURES.hasOwnProperty('I18N_TRANSLATE_HELPER_SPAN')) {
        useSpanByDefault = Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN;
      } else {
        Ember.deprecate('The {{t}} helper will no longer use a <span> tag in future versions of Ember.I18n. Set Ember.FEATURES.I18N_TRANSLATE_HELPER_SPAN to false to quiet these warnings and maintain older behavior.');
        useSpanByDefault = true;
      }

      return useSpanByDefault ? 'span' : null;
    }),

    render: function(buffer) {
      var wrappingTagName = this.get('wrappingTagName');
      var text = Ember.I18n.t(this.get('translationKey'), this.get('context'));

      if (wrappingTagName) { buffer.push('<' + wrappingTagName + ' id="' + uniqueElementId() + '">'); }
      buffer.push(text);
      if (wrappingTagName) { buffer.push('</' + wrappingTagName + '>'); }
    }

  });

  EmHandlebars.registerHelper('t', function(key, options) {
    var context = this;
    var data = options.data;
    var attrs = options.hash;
    var tagName = attrs.tagName;
    delete attrs.tagName;

    if (options.types[0] !== 'STRING') {
      warn("Ember.I18n t helper called with unquoted key: %@. In the future, this will be treated as a bound property, not a string literal.".fmt(key));
    }

    var translationView = TranslationView.create({
      context: attrs,
      translationKey: key,
      wrappingTagName: tagName
    });

    Ember.keys(attrs).forEach(function(property) {
      var isBindingMatch = property.match(isBinding);
      if (!isBindingMatch) { return; }

      var propertyName = isBindingMatch[1];
      var bindPath = attrs[property];
      var currentValue = get(context, bindPath, options);

      attrs[propertyName] = currentValue;

      var invoker = null;
      var normalized = EmHandlebars.normalizePath(context, bindPath, data);
      var _ref = [normalized.root, normalized.path], root = _ref[0];
      var normalizedPath = _ref[1];

      var observer = function() {
        if (translationView.$() == null) {
          Ember.removeObserver(root, normalizedPath, invoker);
          return;
        }
        attrs[propertyName] = get(context, bindPath, options);
        translationView.rerender();
      };

      invoker = function() {
        Ember.run.scheduleOnce('afterRender', observer);
      };

      return Ember.addObserver(root, normalizedPath, invoker);
    });

    data.view.appendChild(translationView);
  });

  var attrHelperFunction = function(options) {
    function assertValue(value) {
      assert("Translated attributes must be strings, not %@".fmt(value), Ember.typeOf(value) === 'string');
    }

    var attrs = options.hash;

    assert("You must specify at least one hash argument to translateAttr", !!Ember.keys(attrs).length);

    var view = options.data.view;
    var ret = [];
    var ctx = this || window;
    var dataId = Em.uuid();

    // For each unbound attribute passed, translate the property and emit as an attribute.
    // For each bound attribute passed, create an observer and translate the
    // current value of the property and emit as an attribute.
    Ember.keys(attrs).forEach(function(attr) {
      var path = attrs[attr];
      var normalized = EmHandlebars.normalizePath(ctx, path, options.data);
      var value = (path === 'this') ? normalized.root : get(ctx, path, options);
      var translatedValue;

      if (value) {
        if (options.hashTypes[attr] !== "ID") {
          warn("Ember.I18n ta helper called with quoted key: '" + path + "'. In the future, this will be treated as a string literal, not a bound property.");
        }

        var observer = function observer() {
          var result = get(ctx, path, options);
          var translatedValue = I18n.t(result);
          var elem = view.$("[data-bindattr-" + dataId + "='" + dataId + "']");

          assertValue(translatedValue);

          // if element is not found, remove observer
          if (!elem || elem.length === 0) {
            Ember.removeObserver(normalized.root, normalized.path, observer);
            return;
          }

          Ember.View.applyAttributeBindings(elem, attr, translatedValue);
        };

        // Add an observer to the view for when the property changes.
        // Note: don't add observer when path is 'this' or path
        // is whole keyword e.g. {{#each x in list}} ... {{bind-attr attr="x"}}
        if (path !== 'this' && !(normalized.isKeyword && normalized.path === '' )) {
          view.registerObserver(normalized.root, normalized.path, observer);
        }

        translatedValue = I18n.t(value);
      } else {
        translatedValue = I18n.t(path);
      }

      assertValue(translatedValue);
      return ret.push('%@="%@"'.fmt(attr, translatedValue));
    });

    ret.push('data-bindattr-' + dataId + '="' + dataId + '"');
    return new EmHandlebars.SafeString(ret.join(' '));
  };

  EmHandlebars.registerHelper('translateAttr', attrHelperFunction);
  EmHandlebars.registerHelper('ta', attrHelperFunction);

}).call(undefined, this);
