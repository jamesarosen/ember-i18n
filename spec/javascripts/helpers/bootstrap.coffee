# Tests should fail if we're using deprecated APIs or relying on deprecated
# behaviour.
Em.ENV.RAISE_ON_DEPRECATION = true

window.bootstrap = ->
  beforeEach ->
    window.Foo = Em.Object.create() # namespace

  afterEach ->
    windowMeta = Em.meta window
    Foo.View.destroy() if Foo.View
    Foo.destroy() if Foo
    # TODO: not very pretty: is there not a better way to reset meta?
    delete windowMeta[key] for key, _ of windowMeta
    Em.merge windowMeta, Em.EMPTY_META
