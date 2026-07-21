# Moteur "pont" : canal direct vers le JS de la WKWebView (socket Unix ->
# Sources/Board/TestBridge.swift -> webView.evaluateJavaScript), sans passer
# par l'accessibilité/System Events du tout. Mêmes signatures que
# helpers_base.rb, donc aucun fichier de Tests/specs/ à modifier.
#
# "set value" fait juste el.value = X (pas de dispatchEvent 'input'/'change') :
# le frontend ne réagit pas à des événements input/change, il relit .value au
# moment du clic sur le bouton de confirmation — même comportement que les
# autres moteurs (AXValue ne synthétise pas non plus de vrai événement DOM).

require_relative '../../support/helpers_base'
require 'socket'
require 'json'

module BoardTest
  SOCKET_PATH = ENV['BOARD_TEST_BRIDGE_SOCKET']

  @@bridge_socket = nil

  module_function

  def bridge_socket
    @@bridge_socket ||= begin
      raise 'BOARD_TEST_BRIDGE_SOCKET non défini (moteur "pont")' unless SOCKET_PATH
      sock = nil
      wait_until(10, 0.1, desc: -> { "connexion impossible au socket #{SOCKET_PATH}" }) do
        begin
          sock = UNIXSocket.new(SOCKET_PATH)
          true
        rescue Errno::ENOENT, Errno::ECONNREFUSED
          false
        end
      end
      sock
    end
  end

  def close_bridge!
    @@bridge_socket&.close rescue nil
    @@bridge_socket = nil
  end

  # launch_app (helpers_base.rb) tue puis relance Board en cours de spec : la
  # pipe vers l'ancien process meurt forcément à ce moment-là (attendu, pas
  # une panne) — un seul retry après reconnexion, le temps que le nouveau
  # process ait redémarré son bridge (bridge_socket réattend déjà jusqu'à 10s).
  def bridge_eval(js, retried: false)
    sock = bridge_socket
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    begin
      sock.puts(JSON.generate('js' => js))
    rescue Errno::EPIPE, IOError
      close_bridge!
      raise 'pont : connexion perdue (Board relancé sans le socket ?)' if retried
      return bridge_eval(js, retried: true)
    end
    # Sans ce timeout, un Board planté/relancé sans le bridge fige le test
    # pour toujours (sock.gets seul n'a pas de limite) — même précaution que
    # les moteurs pers/swift.
    unless IO.select([sock], nil, nil, 15)
      close_bridge!
      raise "pont ne répond pas après 15s (#{js[0, 60]}…)" if retried
      return bridge_eval(js, retried: true)
    end
    line = sock.gets
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    if line.nil?
      close_bridge!
      raise 'pont : connexion fermée de manière inattendue' if retried
      return bridge_eval(js, retried: true)
    end
    resp = JSON.parse(line)
    raise resp['error'] unless resp['ok']
    resp['result'].to_s
  end

  # Certains éléments (ex. sélection d'une carte projet, Project.js
  # "onMouseDown") écoutent "mousedown", pas "click" — el.click() seul ne
  # déclenche qu'un événement "click" de synthèse, jamais mousedown/mouseup.
  # Simuler la séquence complète pour se comporter comme un vrai clic.
  FIRE_CLICK_JS = <<~JS
    function(el){
      ['mousedown','mouseup','click'].forEach(function(type){
        el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window}));
      });
    }
  JS

  def click(dom_id)
    bridge_eval(<<~JS)
      (function(){
        var fireClick=#{FIRE_CLICK_JS};
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        fireClick(el);
        return '';
      })()
    JS
  end

  # cmd+clic (Service.js#onClickOnProjectService, ev.metaKey) — mêmes
  # événements que click(), avec metaKey:true.
  def meta_click(dom_id)
    bridge_eval(<<~JS)
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        ['mousedown','mouseup','click'].forEach(function(type){
          el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window,metaKey:true}));
        });
        return '';
      })()
    JS
  end

  # Élément présent ET réellement affiché (ni display:none, ni
  # visibility:hidden, quel que soit le mécanisme — classe 'hidden' ou autre,
  # ex. clock-btn-invisible) — contrairement à exists?, qui ne teste que la
  # présence dans le DOM.
  def visible?(dom_id)
    bridge_eval(<<~JS) == 'true'
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if (!el) return false;
        var style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
      })()
    JS
  end

  def click_prefix(prefix)
    bridge_eval(<<~JS)
      (function(){
        var fireClick=#{FIRE_CLICK_JS};
        var p=#{prefix.to_json};
        var el=Array.from(document.querySelectorAll('[id]')).find(function(e){return e.id.indexOf(p)===0;});
        if(!el) throw new Error('introuvable (prefix): '+p);
        fireClick(el);
        return '';
      })()
    JS
  end

  def set_value(dom_id, value)
    bridge_eval(<<~JS)
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        el.value=#{value.to_s.to_json};
        return '';
      })()
    JS
  end

  def set_value_prefix(prefix, value)
    bridge_eval(<<~JS)
      (function(){
        var p=#{prefix.to_json};
        var el=Array.from(document.querySelectorAll('[id]')).find(function(e){return e.id.indexOf(p)===0;});
        if(!el) throw new Error('introuvable (prefix): '+p);
        el.value=#{value.to_s.to_json};
        return '';
      })()
    JS
  end

  def get_value(dom_id)
    bridge_eval(<<~JS)
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        return el.value;
      })()
    JS
  end

  def get_value_prefix(prefix)
    bridge_eval(<<~JS)
      (function(){
        var p=#{prefix.to_json};
        var el=Array.from(document.querySelectorAll('[id]')).find(function(e){return e.id.indexOf(p)===0;});
        if(!el) throw new Error('introuvable (prefix): '+p);
        return el.value;
      })()
    JS
  end

  def get_text(dom_id)
    bridge_eval(<<~JS)
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        return el.textContent;
      })()
    JS
  end

  def get_text_prefix(prefix)
    bridge_eval(<<~JS)
      (function(){
        var p=#{prefix.to_json};
        var el=Array.from(document.querySelectorAll('[id]')).find(function(e){return e.id.indexOf(p)===0;});
        if(!el) throw new Error('introuvable (prefix): '+p);
        return el.textContent;
      })()
    JS
  end

  def exists?(dom_id)
    bridge_eval("!!document.getElementById(#{dom_id.to_json})") == 'true'
  end

  # Surcharge de helpers_base.rb#panel_open? : lit directement la classe
  # 'closed' (SidePanel.js) au lieu de comparer des positions AX — plus
  # rapide, et évite un aller-retour osascript/System Events.
  def panel_open?(dom_id)
    bridge_eval(<<~JS) == 'true'
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        return !!el && !el.classList.contains('closed');
      })()
    JS
  end

  def has_class?(dom_id, class_name)
    bridge_eval(<<~JS) == 'true'
      (function(){
        var el=document.getElementById(#{dom_id.to_json});
        if(!el) throw new Error('introuvable: '+#{dom_id.to_json});
        return el.classList.contains(#{class_name.to_json});
      })()
    JS
  end

  def exists_prefix?(prefix)
    bridge_eval(<<~JS) == 'true'
      (function(){
        var p=#{prefix.to_json};
        return !!Array.from(document.querySelectorAll('[id]')).find(function(e){return e.id.indexOf(p)===0;});
      })()
    JS
  end

  # Pas d'attente côté JS : polling Ruby, comme wait_until ailleurs dans la
  # suite (round-trip pont largement plus rapide qu'un parcours AX, pas
  # besoin d'une attente asynchrone côté JS).
  def wait_for(dom_id, timeout = 4)
    wait_until(timeout, 0.1, desc: -> { "élément introuvable : #{dom_id}" }) { exists?(dom_id) }
    'ok'
  end

  def wait_for_prefix(prefix, timeout = 4)
    wait_until(timeout, 0.1, desc: -> { "élément introuvable (prefix) : #{prefix}" }) { exists_prefix?(prefix) }
    'ok'
  end

  # querySelectorAll avec une liste de sélecteurs CSS renvoie les éléments
  # dans l'ordre du DOM, quel que soit l'ordre des sélecteurs dans la liste —
  # exactement l'ordre réel attendu ici, sans parcours manuel.
  def order_of(*dom_ids)
    out = bridge_eval(<<~JS)
      (function(){
        var ids=#{dom_ids.to_json};
        var sel=ids.map(function(id){return '#'+CSS.escape(id);}).join(',');
        return Array.from(document.querySelectorAll(sel)).map(function(e){return e.id;}).join('\\n');
      })()
    JS
    out.empty? ? [] : out.split("\n")
  end
end

at_exit { BoardTest.close_bridge! }
