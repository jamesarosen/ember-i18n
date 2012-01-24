(function() {
  var I18n, getPath, isBinding, isTranslatedAttribute;

  isTranslatedAttribute = /(.+)Translation$/;

  getPath = Ember.Handlebars.getPath || Ember.getPath;

  I18n = {
    compile: Handlebars.compile,
    translations: {},
    template: function(key) {
      var result;
      sc_assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
      result = I18n.translations[key];
      if (result == null) {
        result = I18n.translations[key] = I18n.compile("Missing translation: " + key);
      }
      if (!$.isFunction(result)) {
        result = I18n.translations[key] = I18n.compile(result);
      }
      return result;
    },
    t: function(key, context) {
      var template;
      template = I18n.template(key);
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

  SC.I18n = I18n;

  Em.I18n = I18n;

  Ember.I18n = I18n;

  isBinding = /(.+)Binding$/;

  Handlebars.registerHelper('t', function(key, options) {
    var attrs, context, elementID, result, tagName, view;
    context = this;
    attrs = options.hash;
    view = options.data.view;
    tagName = attrs.tagName || 'span';
    delete attrs.tagName;
    elementID = "i18n-" + (jQuery.uuid++);
    Em.keys(attrs).forEach(function(property) {
      var bindPath, currentValue, invoker, isBindingMatch, observer, propertyName;
      isBindingMatch = property.match(isBinding);
      if (isBindingMatch) {
        propertyName = isBindingMatch[1];
        bindPath = attrs[property];
        currentValue = getPath(bindPath);
        attrs[propertyName] = currentValue;
        invoker = null;
        observer = function() {
          var elem, newValue;
          newValue = getPath(context, bindPath);
          elem = view.$("#" + elementID);
          if (elem.length === 0) {
            Em.removeObserver(context, bindPath, invoker);
            return;
          }
          attrs[propertyName] = newValue;
          return elem.html(I18n.t(key, attrs));
        };
        invoker = function() {
          return Em.run.once(observer);
        };
        return Em.addObserver(context, bindPath, invoker);
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

}).call(this);
