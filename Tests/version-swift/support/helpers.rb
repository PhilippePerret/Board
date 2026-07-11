# Moteur "swift" : un seul process natif (ax_helper, binaire Swift compilé
# qui appelle directement l'API Accessibility AXUIElement, sans passer par
# System Events), lancé une fois et gardé ouvert (pipe bidirectionnelle
# stdin/stdout) pour toute la durée de la spec — même principe que le moteur
# "pers", mais sans le détour AppleScript/JXA -> System Events. Mêmes
# signatures que helpers_base.rb, donc aucun fichier de Tests/specs/ à
# modifier.

require_relative '../../support/helpers_base'

module BoardTest
  HELPER_BINARY = File.join(__dir__, 'ax_helper')

  @@helper_pipe = nil

  module_function

  def helper_pipe
    @@helper_pipe ||= IO.popen([HELPER_BINARY], 'r+')
  end

  # Même précaution que le moteur "pers" : tuer le process avant de fermer
  # la pipe, jamais l'inverse (IO#close attend la mort de l'enfant).
  def close_helper!
    return unless @@helper_pipe
    pid = (@@helper_pipe.pid rescue nil)
    @@helper_pipe.close_write rescue nil
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
    @@helper_pipe.close rescue nil
    @@helper_pipe = nil
  end

  def helper_call(action, needle, extra = '')
    pipe = helper_pipe
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    pipe.puts(JSON.generate('action' => action, 'needle' => needle, 'extra' => extra.to_s))
    pipe.flush
    unless IO.select([pipe], nil, nil, 15)
      close_helper!
      raise "process ax_helper ne répond pas (#{action} #{needle}) après 15s"
    end
    line = pipe.gets
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise 'process ax_helper fermé de manière inattendue' if line.nil?
    resp = JSON.parse(line)
    raise resp['error'] unless resp['ok']
    resp['result'].to_s
  end

  def click(dom_id)                        = helper_call('click', dom_id)
  def click_prefix(prefix)                 = helper_call('click-prefix', prefix)
  def set_value(dom_id, value)             = helper_call('set-value', dom_id, value)
  def set_value_prefix(prefix, value)      = helper_call('set-value-prefix', prefix, value)
  def get_value(dom_id)                    = helper_call('get-value', dom_id)
  def get_value_prefix(prefix)             = helper_call('get-value-prefix', prefix)
  def wait_for(dom_id, timeout = 5)        = helper_call('wait-for', dom_id, timeout)
  def wait_for_prefix(prefix, timeout = 5) = helper_call('wait-for-prefix', prefix, timeout)
  def exists?(dom_id)                      = helper_call('exists', dom_id) == 'true'
  def get_text(dom_id)                     = helper_call('get-text', dom_id)
  def get_text_prefix(prefix)              = helper_call('get-text-prefix', prefix)

  def order_of(*dom_ids)
    out = helper_call('order-of', dom_ids.join("\t"))
    out.empty? ? [] : out.split("\n")
  end
end

at_exit { BoardTest.close_helper! }
