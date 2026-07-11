# Moteur "pers" : un seul process osascript (ax_server.js, JXA), lancé
# une fois au premier appel et gardé ouvert (pipe bidirectionnelle stdin/
# stdout) pour toute la durée de la spec, au lieu d'un process osascript par
# action. Mêmes signatures que helpers_base.rb, donc aucun fichier de
# Tests/specs/ à modifier.

require_relative '../../support/helpers_base'

module BoardTest
  SERVER_SCRIPT = File.join(__dir__, 'ax_server.js')

  @@server_pipe = nil

  module_function

  def server_pipe
    @@server_pipe ||= IO.popen(['osascript', '-l', 'JavaScript', SERVER_SCRIPT], 'r+')
  end

  # IO#close sur un IO.popen attend la mort du process enfant. Si
  # ax_server.js est planté/coincé, ce close bloque à son tour pour
  # toujours — donc on tue le process AVANT de fermer, jamais l'inverse.
  def close_server!
    return unless @@server_pipe
    pid = (@@server_pipe.pid rescue nil)
    @@server_pipe.close_write rescue nil
    if pid
      begin
        Process.kill('KILL', pid)
      rescue Errno::ESRCH
      end
      begin
        Process.wait(pid)
      rescue Errno::ECHILD
      end
    end
    @@server_pipe.close rescue nil
    @@server_pipe = nil
  end

  def server_call(action, needle, extra = '')
    pipe = server_pipe
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    pipe.puts(JSON.generate('action' => action, 'needle' => needle, 'extra' => extra.to_s))
    pipe.flush
    # Sans ce timeout, un ax_server.js planté/bloqué fige le test pour
    # toujours (pipe.gets seul n'a pas de limite).
    unless IO.select([pipe], nil, nil, 15)
      close_server!
      raise "process serveur AX (ax_server.js) ne répond pas (#{action} #{needle}) après 15s"
    end
    line = pipe.gets
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise 'process serveur AX (ax_server.js) fermé de manière inattendue' if line.nil?
    resp = JSON.parse(line)
    raise resp['error'] unless resp['ok']
    resp['result'].to_s
  end

  def click(dom_id)                        = server_call('click', dom_id)
  def click_prefix(prefix)                 = server_call('click-prefix', prefix)
  def set_value(dom_id, value)             = server_call('set-value', dom_id, value)
  def set_value_prefix(prefix, value)      = server_call('set-value-prefix', prefix, value)
  def get_value(dom_id)                    = server_call('get-value', dom_id)
  def get_value_prefix(prefix)             = server_call('get-value-prefix', prefix)
  def wait_for(dom_id, timeout = 5)        = server_call('wait-for', dom_id, timeout)
  def wait_for_prefix(prefix, timeout = 5) = server_call('wait-for-prefix', prefix, timeout)
  def exists?(dom_id)                      = server_call('exists', dom_id) == 'true'
  def get_text(dom_id)                     = server_call('get-text', dom_id)
  def get_text_prefix(prefix)              = server_call('get-text-prefix', prefix)

  def order_of(*dom_ids)
    out = server_call('order-of', dom_ids.join("\t"))
    out.empty? ? [] : out.split("\n")
  end
end

at_exit { BoardTest.close_server! }
