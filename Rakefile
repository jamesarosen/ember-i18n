require 'bundler/setup'
require 'pathname'
Bundler.require
project_dir = File.expand_path(File.dirname(__FILE__))

desc "Run JSHint checks"
task :jshint do
  hint_command = File.join project_dir, 'node_modules', 'jshint', 'bin', 'hint'
  abort "Could not find JSHint. Try `npm install`" unless File.exists?(hint_command)

  config_file = File.join project_dir, '.jshintrc'

  files = FileList.new
  files.include File.join(project_dir, 'lib', '**/*.js')
  files.include File.join(project_dir, 'spec', '**/*.js')
  files.exclude File.join(project_dir, 'spec', 'support', '**/*')

  sh "#{hint_command} #{files.join(' ')} --config #{config_file}" do |ok, res|
    fail 'JSHint found errors.' unless ok
  end

  puts "JSHint OK"
end

namespace :jasmine do
  task :require do
    require 'jasmine'
  end

  desc "Run continuous integration tests"
  task :ci => "jasmine:require" do
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
task :jasmine => 'jasmine:server'



require 'jasmine/headless/task'

Jasmine::Headless::Task.new('jasmine:headless') do |t|
  t.colors = true
end

task :default => 'jasmine:headless'
