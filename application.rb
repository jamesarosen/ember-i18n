require 'action_controller/railtie'
require 'jasminerice'
require 'guard/jasmine'
require 'sprockets/railtie'
require 'jquery-rails'
require 'ember-rails'
require 'json'

module EmberI18n
  class Application < Rails::Application
    routes.append do
      mount Jasminerice::Engine => '/jasmine'
    end

    package = JSON.parse(File.read('package.json'))

    config.cache_classes = true
    config.active_support.deprecation = :log
    config.assets.enabled = true
    config.assets.debug = true
    config.assets.paths << 'vendor'
    config.assets.paths << 'lib'
    config.assets.version = package['version']
    config.secret_token = '57d424e561b10deb4d1f3e7995b127e1d0e817abd3cbe89ef8418b73b72b0fa6e69279eeea354f632bc4fa0d0ebe1acff1c3774da63b6329d1eeb46bf698241e'

    config.ember.variant = :development
  end
end
