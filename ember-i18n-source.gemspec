# -*- encoding: utf-8 -*-
require 'json'

package = JSON.parse(File.read('package.json'))

Gem::Specification.new do |gem|
  gem.name        = 'ember-i18n-source'
  gem.version     = package['version']
  gem.authors     = ['heartsentwined']
  gem.email       = ['heartsentwined@cogito-lab.com']
  gem.date        = Time.now.strftime('%Y-%m-%d')
  gem.summary     = 'Ember-i18n source code wrapper'
  gem.description = 'Ember-i18n source code wrapper for ruby libs.'
  gem.homepage    = 'https://github.com/heartsentwined/ember-i18n'

  gem.files       = ['dist/ember-i18n.js', 'lib/ember-i18n/source.rb']

  gem.add_dependency 'ember-source', [
    '>= 0.0.1', '!= 1.0.0.pre4.1', '!= 1.0.0.rc1.0.0'
  ]

  gem.license     = 'GPL-3'
end
