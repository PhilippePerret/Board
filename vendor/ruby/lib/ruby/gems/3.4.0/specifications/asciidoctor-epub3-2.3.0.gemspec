# -*- encoding: utf-8 -*-
# stub: asciidoctor-epub3 2.3.0 ruby lib

Gem::Specification.new do |s|
  s.name = "asciidoctor-epub3".freeze
  s.version = "2.3.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Dan Allen".freeze, "Sarah White".freeze]
  s.date = "1980-01-02"
  s.description = "An extension for Asciidoctor that converts AsciiDoc documents to EPUB3 e-book format.\n".freeze
  s.email = "dan@opendevise.com".freeze
  s.executables = ["asciidoctor-epub3".freeze]
  s.files = ["bin/asciidoctor-epub3".freeze]
  s.homepage = "https://github.com/asciidoctor/asciidoctor-epub3".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.7.0".freeze)
  s.rubygems_version = "3.6.9".freeze
  s.summary = "Converts AsciiDoc documents to EPUB3 e-book format".freeze

  s.installed_by_version = "3.6.9".freeze

  s.specification_version = 4

  s.add_runtime_dependency(%q<asciidoctor>.freeze, ["~> 2.0".freeze])
  s.add_runtime_dependency(%q<gepub>.freeze, ["~> 1.0.0".freeze])
  s.add_runtime_dependency(%q<mime-types>.freeze, ["~> 3.0".freeze])
  s.add_runtime_dependency(%q<sass>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<asciidoctor-diagram>.freeze, ["~> 3.0".freeze])
  s.add_development_dependency(%q<asciidoctor-diagram-ditaamini>.freeze, ["~> 1.0".freeze])
  s.add_development_dependency(%q<asciidoctor-diagram-plantuml>.freeze, ["~> 1.2025".freeze])
  s.add_development_dependency(%q<asciimath>.freeze, ["~> 2.0".freeze])
  s.add_development_dependency(%q<coderay>.freeze, ["~> 1.1.0".freeze])
  s.add_development_dependency(%q<concurrent-ruby>.freeze, ["~> 1.0".freeze])
  s.add_development_dependency(%q<epubcheck-ruby>.freeze, ["~> 5.2.1.0".freeze])
  s.add_development_dependency(%q<pygments.rb>.freeze, ["~> 4.0.0".freeze])
  s.add_development_dependency(%q<rake>.freeze, ["~> 13.3.0".freeze])
  s.add_development_dependency(%q<rouge>.freeze, ["~> 4.6".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3.13.0".freeze])
  s.add_development_dependency(%q<rubocop>.freeze, ["~> 1.80.0".freeze])
  s.add_development_dependency(%q<rubocop-rake>.freeze, ["~> 0.7.1".freeze])
  s.add_development_dependency(%q<rubocop-rspec>.freeze, ["~> 3.3".freeze])
  s.add_development_dependency(%q<slim>.freeze, ["~> 5.0".freeze])
  s.add_development_dependency(%q<tilt>.freeze, ["~> 2.0".freeze])
end
