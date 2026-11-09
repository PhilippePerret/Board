# -*- encoding: utf-8 -*-
# stub: gepub 1.0.17 ruby lib

Gem::Specification.new do |s|
  s.name = "gepub".freeze
  s.version = "1.0.17".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["KOJIMA Satoshi".freeze]
  s.date = "2024-05-15"
  s.description = "gepub is a generic EPUB parser/generator. Generates and parse EPUB2 and EPUB3".freeze
  s.email = ["skoji@mac.com".freeze]
  s.executables = ["genepub".freeze, "gepuber".freeze]
  s.files = ["bin/genepub".freeze, "bin/gepuber".freeze]
  s.homepage = "http://github.com/skoji/gepub".freeze
  s.licenses = ["BSD-3-Clause".freeze]
  s.rubygems_version = "3.3.26".freeze
  s.summary = "a generic EPUB library for Ruby.".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<nokogiri>.freeze, [">= 1.8.2".freeze, "< 2.0".freeze])
  s.add_runtime_dependency(%q<rubyzip>.freeze, ["> 1.1.1".freeze, "< 2.4".freeze])
  s.add_development_dependency(%q<epubcheck-ruby>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<rake>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<rubocop>.freeze, [">= 0".freeze])
end
