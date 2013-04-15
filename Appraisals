EMBER_VERSIONS = %w(
1.0.0.rc2.2 1.0.0.rc2.1 1.0.0.rc2.0
1.0.0.rc1.4 1.0.0.rc1.3 1.0.0.rc1.2 1.0.0.rc1.1
1.0.0.pre4.2 1.0.0.pre4.0
0.0.5 0.0.4 0.0.3 0.0.2 0.0.1
)

EMBER_VERSIONS.each do |version|
  appraise "ember-#{version}" do
    gem 'ember-source', version
  end
end
