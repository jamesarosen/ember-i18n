class config
  # Locale for translations
  #
  # Currently, this is only used in pluralizations.
  # You must set this if you want to support pluralization.
  # Both 'en' (lang) and 'en-US' (lang-locale)  are valid.
  locale: null

  # Whether we should support dot-syntax or object-syntax in translations
  #
  # If you want to write
  #   Em.I18n.Translations.reopen
  #     foo:
  #       bar: 'bar-value'
  #       baz: 'baz-value'
  # then set this to 'object'.
  #
  # Otherwise, if you want to write
  #   Em.I18n.Translations.reopen
  #     'foo.bar': 'bar-value'
  #     'foo.baz': 'bar-value'
  # then set this to 'dot'.
  #
  # You cannot have both, due to ambiguities:
  #   Em.I18n.Translations.reopen
  #     'foo.bar': 'bar-value1'
  #     foo:
  #       bar: 'bar-value2'
  #   (What should 'foo.bar' resolve to?)
  #
  # Defaults to 'object'.
  translationsKey: 'object'

Em.I18n.Config = config.create()
