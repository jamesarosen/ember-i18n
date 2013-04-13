class i18n
  _uuid: 0
  uuid: ->
    @incrementProperty '_uuid'
    @_uuid

Em.I18n2 = i18n.create()
