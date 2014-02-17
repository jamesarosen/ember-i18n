(function(window) {
  var I18n, assert, findTemplate, get, set, isBinding, lookupKey, pluralForm,
      keyExists, runAfterRender, compileTemplate;

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

  runAfterRender = (function() {
    if (Em.run.queues.indexOf('afterRender') === -1) {
      // Ember 0.9 doesn't have an afterRender queue.
      return function runAfterRender(callback) {
        return Em.run.once(callback);
      };
    }

    return function runAfterRender(callback) {
      return Em.run.scheduleOnce('afterRender', callback);
    };
  }());

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

  compileTemplate = (function() {
    if (typeof Handlebars.compile === 'function') {
      return function compileWithHandlebars(template) {
        return Handlebars.compile(template);
      };
    } else {
      return function cannotCompileTemplate(template) {
        error('The default Ember.I18n.compile function requires the full Handlebars. Either include the full Handlebars or override Ember.I18n.compile.');
      };
    }
  }());

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

    TranslateableProperties: Em.Mixin.create({
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

  // CRUFT: in v2, which requires Ember 1.0+, Ember.uuid will always be
  //        available, so this function can be cleaned up.
  var uniqueElementId = (function(){
    var id = Ember.uuid || 0;
    return function() {
      var elementId = 'i18n-' + id++;
      return elementId;
    };
  })();

  Handlebars.registerHelper('t', function(key, options) {
    var attrs, context, data, elementID, result, tagName, view;
    context = this;
    attrs = options.hash;
    data = options.data;
    view = data.view;
    tagName = attrs.tagName || 'span';
    delete attrs.tagName;
    elementID = uniqueElementId();

    Em.keys(attrs).forEach(function(property) {
      var bindPath, currentValue, invoker, isBindingMatch, normalized, normalizedPath, observer, propertyName, root, _ref;
      isBindingMatch = property.match(isBinding);

      if (isBindingMatch) {
        propertyName = isBindingMatch[1];
        bindPath = attrs[property];
        currentValue = get(context, bindPath, options);
        attrs[propertyName] = currentValue;
        invoker = null;
        normalized = Ember.Handlebars.normalizePath(context, bindPath, data);
        _ref = [normalized.root, normalized.path], root = _ref[0], normalizedPath = _ref[1];

        observer = function() {
          var elem, newValue;
          if (view.get('state') !== 'inDOM') {
            Em.removeObserver(root, normalizedPath, invoker);
            return;
          }
          newValue = get(context, bindPath, options);
          elem = view.$("#" + elementID);
          attrs[propertyName] = newValue;
          return elem.html(I18n.t(key, attrs));
        };

        invoker = function() {
          return runAfterRender(observer);
        };

        return Em.addObserver(root, normalizedPath, invoker);
      }
    });

    result = '<%@ id="%@">%@</%@>'.fmt(tagName, elementID, I18n.t(key, attrs), tagName);
    return new Handlebars.SafeString(result);
  });

  var attrHelperFunction = function(options) {
    var attrs, result;
    attrs = options.hash;
    result = [];

    Em.keys(attrs).forEach(function(property) {
      var translatedValue;
      translatedValue = I18n.t(attrs[property]);
      return result.push('%@="%@"'.fmt(property, translatedValue));
    });

    return new Handlebars.SafeString(result.join(' '));
  };

  Handlebars.registerHelper('translateAttr', attrHelperFunction);
  Handlebars.registerHelper('ta', attrHelperFunction);

}).call(undefined, this);
