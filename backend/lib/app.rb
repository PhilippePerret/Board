class App
class << self

  def load_all
    # Chargement de toutes les données de projets, classés
    new_projects_in = []
    projects_data =
      APP_DATA['projects-in'].map do |project_id|
        if File.exist?(project_path(project_id))
          new_projects_in << project_id
          YAML.safe_load(IO.read(project_path(project_id)))
        end
      end.compact
    APP_DATA['projects-in'] = new_projects_in
    {
      appData: APP_DATA,
      projectsData: projects_data
    }
  rescue Exception => e
    RETOUR.ok = false
    RETOUR.error = e.message
  end

end #/ << self
end