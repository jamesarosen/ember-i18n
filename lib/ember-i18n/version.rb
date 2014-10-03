require 'json'

module EmberI18n
  package = File.read(File.expand_path('../../../package.json', __FILE__))

  VERSION = JSON.parse(package)['version'].strip.gsub(/[-\+]/, '.')
end
