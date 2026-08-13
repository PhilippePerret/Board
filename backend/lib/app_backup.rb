# Backup quotidien des données user (~/Library/Application Support/Board)
# — appelé depuis le cycle de lancement de l'app (App.js), pas depuis un
# service. APP_BACKUPS_FOLDER dérivé de DATA_SUPPORT_FOLDER (usefull.rb),
# qui respecte déjà BOARD_TEST_DATA_DIR : un run de tests ne touche donc
# jamais ~/Library/Application Support/Board-backups réel.

require 'fileutils'
require 'yaml'
require 'time'

APP_BACKUPS_FOLDER = ensure_folder(File.join(
  File.dirname(DATA_SUPPORT_FOLDER),
  "#{File.basename(DATA_SUPPORT_FOLDER)}-backups"
))

APP_BACKUP_DROP_ALERT_RATIO = 0.75 # en dessous de 75% du backup précédent = alerte
APP_BACKUP_DAILY_KEPT_DAYS  = 20

def app_backup_current_data_counts
  cards = Dir.glob(File.join(PROJECT_CARD_FOLDER, '*.yaml'))
  nb_services = cards.sum do |card_path|
    data = YAML.safe_load(IO.read(card_path)) rescue nil
    next 0 unless data.is_a?(Hash)
    services = data['services'] || {}
    (services['startup'] || []).size + (services['others'] || []).size
  end
  { projects: cards.size, services: nb_services }
end

def app_backup_last_infos
  infos_files = Dir.glob(File.join(APP_BACKUPS_FOLDER, '*.infos')).sort
  return nil if infos_files.empty?
  YAML.safe_load(IO.read(infos_files.last)) rescue nil
end

# Clés (projects, services) pour lesquelles la baisse dépasse le seuil
# d'alerte par rapport au backup précédent.
def app_backup_drop_triggered(previous, current)
  return [] unless previous
  %i[projects services].select do |key|
    prev = previous[key.to_s].to_i
    prev > 0 && current[key] < prev * APP_BACKUP_DROP_ALERT_RATIO
  end
end

# Garde les APP_BACKUP_DAILY_KEPT_DAYS derniers jours tels quels, et pour
# les mois révolus avant ça, un seul backup par mois (le plus récent du
# mois).
def app_backup_apply_retention!
  archives = Dir.glob(File.join(APP_BACKUPS_FOLDER, '*.tar.gz')).sort
  cutoff = Time.now - APP_BACKUP_DAILY_KEPT_DAYS * 24 * 60 * 60

  old, recent = archives.partition { |path| File.mtime(path) < cutoff }
  by_month = old.group_by { |path| File.mtime(path).strftime('%Y-%m') }

  to_delete = []
  by_month.each_value do |paths|
    sorted = paths.sort_by { |path| File.mtime(path) }
    to_delete.concat(sorted[0...-1]) # garde le dernier du mois
  end

  to_delete.each do |archive_path|
    File.delete(archive_path)
    infos_path = archive_path.sub(/\.tar\.gz\z/, '.infos')
    File.delete(infos_path) if File.exist?(infos_path)
  end
end

def app_backup_write_archive(current)
  stamp = Time.now.strftime('%Y%m%d-%H%M%S')
  archive_path = File.join(APP_BACKUPS_FOLDER, "app-backup-#{stamp}.tar.gz")
  infos_path   = File.join(APP_BACKUPS_FOLDER, "app-backup-#{stamp}.infos")

  ok = system('tar', '-czf', archive_path,
              '-C', File.dirname(DATA_SUPPORT_FOLDER), File.basename(DATA_SUPPORT_FOLDER))
  return { ok: false, error: 'backend-app-backup-failed' } unless ok

  IO.write(infos_path, {
    'date'     => Time.now.iso8601,
    'projects' => current[:projects],
    'services' => current[:services]
  }.to_yaml)

  app_backup_apply_retention!

  { ok: true, projects: current[:projects], services: current[:services] }
end

# confirmed: true une fois que l'user a validé malgré la baisse détectée
# (bouton "Je confirme" du dialogue front) — ne re-vérifie pas.
def app_backup_run(confirmed: false)
  previous = app_backup_last_infos
  current = app_backup_current_data_counts

  if !confirmed
    triggered = app_backup_drop_triggered(previous, current)
    unless triggered.empty?
      return {
        ok: true,
        needsConfirmation: true,
        triggered: triggered.map(&:to_s),
        previousProjects: previous['projects'].to_i,
        currentProjects: current[:projects],
        previousServices: previous['services'].to_i,
        currentServices: current[:services]
      }
    end
  end

  app_backup_write_archive(current)
end

# Restaure le backup le plus récent PAR-DESSUS les données réelles
# actuelles (bouton "Revenir au backup précédent") — remplace entièrement
# DATA_SUPPORT_FOLDER par le contenu de la dernière archive.
def app_backup_restore_previous
  archives = Dir.glob(File.join(APP_BACKUPS_FOLDER, '*.tar.gz')).sort
  return { ok: false, error: 'backend-app-backup-no-previous' } if archives.empty?

  FileUtils.rm_rf(DATA_SUPPORT_FOLDER)
  ok = system('tar', '-xzf', archives.last, '-C', File.dirname(DATA_SUPPORT_FOLDER))
  return { ok: false, error: 'backend-app-backup-restore-failed' } unless ok

  { ok: true }
end
