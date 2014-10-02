require "ember-i18n/version"

module EmberI18n
  if defined? ::Rails::Engine
    # auto wire assets as Rails Engine
    class Rails < ::Rails::Engine
    end

  elsif defined? ::Sprockets
    root_dir = File.expand_path(File.dirname(File.dirname(__FILE__)))
    # Set up asset paths for Sprockets apps
    ::Sprockets.append_path File.join(root_dir, "lib")
  end
end
