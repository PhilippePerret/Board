# Moteur "batch" : mêmes signatures que Tests/support/helpers_base.rb (donc
# aucun fichier de Tests/specs/**/*.rb à modifier pour en bénéficier), mais
# les actions sans valeur de retour (click, click_prefix, set_value,
# set_value_prefix) sont mises en file au lieu d'être exécutées tout de
# suite. La file est vidée en un seul appel osascript (action "batch" de
# ax.applescript) :
# - juste avant toute action qui a besoin d'une vraie valeur de retour
#   (wait_for, get_value, exists?, get_text...), pour préserver l'ordre ;
# - à la fin du process (at_exit), pour les dernières actions en attente.
#
# Le nombre de process osascript lancés diminue d'autant ; osascript_stats
# (défini dans helpers_base.rb, partagé) continue de compter un seul appel
# par flush, quel que soit le nombre d'actions qu'il contient.

require_relative '../../support/helpers_base'

module BoardTest
  QUEUE = []

  module_function

  def enqueue(action, needle, extra = nil)
    QUEUE << [action, needle, extra].compact.join("\t")
  end

  def flush_batch!
    return if QUEUE.empty?
    payload = QUEUE.join("\n")
    QUEUE.clear
    osascript(AX_SCRIPT, 'batch', payload)
  end

  def click(dom_id)                   = enqueue('click', dom_id)
  def click_prefix(prefix)            = enqueue('click-prefix', prefix)
  def set_value(dom_id, value)        = enqueue('set-value', dom_id, value)
  def set_value_prefix(prefix, value) = enqueue('set-value-prefix', prefix, value)

  def get_value(dom_id)
    flush_batch!
    osascript(AX_SCRIPT, 'get-value', dom_id)
  end

  def get_value_prefix(prefix)
    flush_batch!
    osascript(AX_SCRIPT, 'get-value-prefix', prefix)
  end

  def wait_for(dom_id, timeout = 5)
    flush_batch!
    osascript(AX_SCRIPT, 'wait-for', dom_id, timeout)
  end

  def wait_for_prefix(prefix, timeout = 5)
    flush_batch!
    osascript(AX_SCRIPT, 'wait-for-prefix', prefix, timeout)
  end

  def exists?(dom_id)
    flush_batch!
    osascript(AX_SCRIPT, 'exists', dom_id) == 'true'
  end

  def get_text(dom_id)
    flush_batch!
    osascript(AX_SCRIPT, 'get-text', dom_id)
  end

  def get_text_prefix(prefix)
    flush_batch!
    osascript(AX_SCRIPT, 'get-text-prefix', prefix)
  end

  def order_of(*dom_ids)
    flush_batch!
    out = osascript(AX_SCRIPT, 'order-of', dom_ids.join("\t"))
    out.empty? ? [] : out.split("\n")
  end

  def drag(from_dom_id, to_dom_id)
    flush_batch!
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    out = IO.popen(['osascript', '-l', 'JavaScript', DRAG_SCRIPT, from_dom_id, to_dom_id], err: [:child, :out], &:read)
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise "drag a échoué (#{from_dom_id} → #{to_dom_id}) : #{out}" unless $?.success?
    out.strip
  end
end

at_exit { BoardTest.flush_batch! }
