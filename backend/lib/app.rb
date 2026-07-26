class App
class << self

  def load_all
    # Chargement de toutes les données de projets, classés
    projects_data =
      APP_DATA['projects-in'].map do |project_id|
        YAML.safe_load(IO.read(project_path(project_id)))
      end
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