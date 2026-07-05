# version 1.1
require 'asciidoctor'
require 'asciidoctor/extensions'

class Combo < Asciidoctor::Extensions::InlineMacroProcessor
  use_dsl

  named :combo

  STRKEYS_TO_KEY = {
    'alt'   => '⌥',
    'cmd'   => '⌘',
    'ctrl'  => '⌃', 
    'maj'   => '⇧',
    'enter' => '↩︎',
    'fb'    => '↓',
    'fg'    => '←',
    'fh'    => '↑',
    'fd'    => '→',
  }

  def process(parent, target, attrs)
    target.split('+')
      .map {|k| %(<kbd style="font-size:1.25em;">#{STRKEYS_TO_KEY[k.downcase] || k}</kbd>) }
      .join('+')
  end
end

Asciidoctor::Extensions.register do
  inline_macro Combo
end