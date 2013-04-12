//= require plurals
//= require_self
(function(window) {
  var I18n, assert, findTemplate, get, isBinding, isTranslatedAttribute, lookupKey, pluralForm;

  isTranslatedAttribute = /(.+)Translation$/;

  get = Ember.Handlebars.get || Ember.Handlebars.getPath || Ember.getPath;

  if (typeof CLDR !== "undefined" && CLDR !== null) pluralForm = CLDR.pluralForm;

  if (pluralForm == null) {
    Ember.Logger.warn("CLDR.pluralForm not found. Em.I18n will not support count-based inflection.");
  }

  lookupKey = function(key, hash) {
    var firstKey, idx, remainingKeys, result;
    result = hash[key];
    idx = key.indexOf('.');

    if (!result && idx !== -1) {
      firstKey = key.substr(0, idx);
      remainingKeys = key.substr(idx + 1);
      hash = hash[firstKey];
      if (hash) result = lookupKey(remainingKeys, hash);
    }

    return result;
  };

  assert = Ember.assert != null ? Ember.assert : window.ember_assert;

  findTemplate = function(key, setOnMissing) {
    assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
    var result = lookupKey(key, I18n.translations);

    if (setOnMissing) {
      if (result == null) {
        result = I18n.compile("Missing translation: " + key);
      }
    }

    if ((result != null) && !jQuery.isFunction(result)) {
      result = I18n.compile(result);
    }

    return result;
  };

  I18n = {
    uuid: 0,
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

    TranslateableAttributes: Em.Mixin.create({
      didInsertElement: function() {
        var attribute, isTranslatedAttributeMatch, key, path, result, translatedValue;
        result = this._super.apply(this, arguments);

        for (key in this) {
          path = this[key];
          isTranslatedAttributeMatch = key.match(isTranslatedAttribute);
          if (isTranslatedAttributeMatch) {
            attribute = isTranslatedAttributeMatch[1];
            translatedValue = I18n.t(path);
            this.$().attr(attribute, translatedValue);
          }
        }

        return result;
      }
    })
  };

  Ember.I18n = I18n;

  isBinding = /(.+)Binding$/;
  isTranslate = /^t (.+)$/;
  isLiteral = /^!t (.+)$/;
  isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  };
  isViewBinding = /^view\.(.+)$/;
  interpolation = /{{([^}]+)}}/g;

  Handlebars.registerHelper('t', function(key, options) {
    var attrs, context, data, elementID, result, tagName, view;
    context = this;
    attrs = options.hash;
    data = options.data;
    view = data.view;
    tagName = attrs.tagName || 'span';
    delete attrs.tagName;
    elementID = "i18n-" + (++I18n.uuid);
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
          return Em.run.once(observer);
        };

        return Em.addObserver(root, normalizedPath, invoker);
      } else {
        var translatePath;

        value = attrs[property];
        if (typeof value !== 'string') return;

        isTranslateMatch = value.match(isTranslate);
        isLiteralMatch = value.match(isLiteral);
        if (isTranslateMatch ||
            (!isNumber(value) && !isLiteralMatch) ||
            (isNumber(value) && isLiteralMatch)
         ) {
          var view2;
          translatePath = isTranslateMatch ? isTranslateMatch[1] : value;

          if (typeof attrs[property + 'Binding'] === 'undefined') {
            //invoker = null
            if (typeof Em.I18n.translations[translatePath] !== 'undefined') {
              translation = Em.I18n.translations[translatePath];
            } else {
              translation = I18n.t(translatePath, attrs);
            }
            interpolations = [];
            while (match = interpolation.exec(translation)) {
              interpolations.push(match[1]);
              interpolations.push('' + match[1] + 'Binding');
            }
            options = (function() {
              var _results = [], attr;
              for (property2 in attrs) {
                if ($.inArray(property2, interpolations) !== -1) {
                  attr = attrs[property2];
                  _results.push('' + property2 + '="' + attr + '"')
                }
              }
              return _results;
            })().join(' ');
            currentViewBindings = (function() {
              var _results = {}, attr, isBindingMatch, viewPropertyKey;
              for (property2 in attrs) {
                attr = attrs[property2];
                if ((isBindingMatch = property2.match(isBinding)) &&
                    (isViewBindingMatch = attr.match(isViewBinding))) {
                  viewPropertyKey = isViewBindingMatch[1];
                  _results[viewPropertyKey] = view.get(viewPropertyKey);
                }
              }
              return _results;
            })();
var getOwnProperties = function(model){
  var props = {};
  for(var prop in model){
    if( model.hasOwnProperty(prop)
        && prop.indexOf('__ember') < 0
        && prop.indexOf('_super') < 0
        && Ember.typeOf(model.get(prop)) !== 'function'
    ){
      props[prop] = model[prop];
    }
  }
  return props;
}
var blacklist = ['_childViews', '_outlets', '_scheduledInsert', 'buffer',
  'classNameBindings', 'classNames', 'currentState', 'layoutName',
  'lengthBeforeRender', 'state', 'templateName', 'template', 'elementId'
];
for (property3 in getOwnProperties(view)) {
  if ($.inArray(property3, blacklist) === -1) {
  //if (property3 !== 'elementId') {
    currentViewBindings[property3] = view.get(property3);
  }
}
            hbs = '{{t ' + translatePath + ' ' + options + '}}';
            template = Em.Handlebars.compile(hbs);
            //view2 = Em.View.extend(view, { template: template }).create();
          currentViewBindings.template = template;
            //view = Em.View.create({ template: template });
            view2 = Em.View.create(currentViewBindings);
            //Em.run(function() { view2.append(); });
            Em.run(function() { view2.createElement(); });
            newValue = new Handlebars.SafeString(view2.$().html());
            //Em.run(function() { view2.remove(); });
            //newValue = 'foo';
            attrs[property] = newValue;
            //normalized = Ember.Handlebars.normalizePath(context, translatePath, data);
            //_ref = [normalized.root, normalized.path], root = _ref[0], normalizedPath = _ref[1];
            //observer = function() {
              //var elem, newValue;
              //if (view.get('state') !== 'inDOM') {
                //Em.removeObserver(root, normalizedPath, invoker);
                //return;
              //}
              //newValue = I18n.t(translatePath, attrs);
              //elem = view.$('#' + elementID);
              //attrs[property] = newValue;
              //return elem.html(I18n.t(key, attrs));
            //};

            //invoker = function() {
              //return Em.run.once(observer);
            //};

            //root = Em.I18n.translations;
            //observePath = 'Em.I18n.translations.' + translatePath;
            //return Em.addObserver(Em.I18n.translations, translatePath, invoker);
          }
        } else {
          literal = isLiteralMatch ? isLiteralMatch[1] : value;
          attrs[property] = literal
        }
      }
    });

    result = '<%@ id="%@">%@</%@>'.fmt(tagName, elementID, I18n.t(key, attrs), tagName);
    return new Handlebars.SafeString(result);
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
