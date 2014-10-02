# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'ember-i18n/version'

Gem::Specification.new do |spec|
  spec.name          = "ember-i18n"
  spec.version       = EmberI18n::VERSION
  spec.authors       = ["James A. Rosen"]
  spec.email         = ["james.a.rosen@gmail.com"]
  spec.summary       = %q{I18n support for Ember.js}
  spec.description   = %q{I18n support for Ember.js}
  spec.homepage      = "http://github.com/jamesarosen/ember-i18n"
  spec.license       = "APLv2"

  spec.files = %w(package.json lib/i18n.js lib/ember-i18n.rb vendor/cldr-1.0.0.js) + Dir['lib/ember-i18n/*.rb']
  spec.add_development_dependency "bundler", "~> 1.7"
  spec.add_development_dependency "rake", "~> 10.0"
end
