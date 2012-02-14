require 'bundler/setup'
require 'pathname'
Bundler.require
project_dir = File.expand_path(File.dirname(__FILE__))

def coffee(file)
  if !system("which coffee")
    $stderr.puts "You do not have a CoffeeScript compiler installed."
    $stderr.puts "You can install one with the following command:"
    $stderr.puts "    npm install -g coffee-script"
    abort
  end

  `coffee -c #{file}`
  puts "Compiled #{file}"
end

desc 'Clean up generated JS files'
task :clean do
  rm_f project_dir + '/lib/*.js'
  rm_f project_dir + '/spec/javascripts/*.js'
end

desc 'Compile coffeescript -> JS'
task :compile do
  coffee project_dir + '/lib/*.coffee'
end

namespace :spec do
  desc 'Compile spec coffeescript -> JS'
  task :compile do
    coffee project_dir + '/spec/javascripts/*.coffee'
  end
end

directory project_dir + '/dist'

desc "Build the distribution version of Em.I18n"
task :build => [ :compile, project_dir + '/dist' ] do
  version = (File.read project_dir + '/VERSION').strip
  cp project_dir + '/lib/i18n.js', project_dir + "/dist/ember-i18n-#{version}.js"
  puts "Copied i18n.js to dist/"
end

namespace :jasmine do
  task :require do
    require 'jasmine'
  end

  desc "Run continuous integration tests"
  task :ci => ["jasmine:require", 'spec:compile'] do
    if Jasmine::rspec2?
      require "rspec"
      require "rspec/core/rake_task"
    else
      require "spec"
      require 'spec/rake/spectask'
    end

    if Jasmine::rspec2?
      RSpec::Core::RakeTask.new(:jasmine_continuous_integration_runner) do |t|
        t.rspec_opts = ["--colour", "--format", "progress"]
        t.verbose = true
        t.pattern = ['spec/javascripts/support/jasmine_runner.rb']
      end
    else
      Spec::Rake::SpecTask.new(:jasmine_continuous_integration_runner) do |t|
        t.spec_opts = ["--color", "--format", "specdoc"]
        t.verbose = true
        t.spec_files = ['spec/javascripts/support/jasmine_runner.rb']
      end
    end
    Rake::Task["jasmine_continuous_integration_runner"].invoke
  end

  task :server => "jasmine:require" do
    jasmine_config_overrides = './spec/javascripts/support/jasmine_config.rb'
    require jasmine_config_overrides if File.exist?(jasmine_config_overrides)

    puts "your tests are here:"
    puts "  http://localhost:8888/"

    Jasmine::Config.new.start_server
  end
end

desc "Run specs via server"
task :jasmine => ['spec:compile', 'jasmine:server']



require 'jasmine/headless/task'

Jasmine::Headless::Task.new('jasmine:headless') do |t|
  t.colors = true
end

task :default => ['clean', 'compile', 'spec:compile', 'jasmine:headless']
