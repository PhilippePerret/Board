/**
 * Ce fichier déinit les données de tous les services
 * C'est-à-dire : 
 * 
 *  CUSTOM_SERVICES_DATA
 *    Services de projet personnalisés, à définir pour chaque projet.
 * 
 *  COMMON_SERVICES_DATA
 *    Services commun à tous les projets (par exemple l'ouverture du dossier
 *    du projet)
 * 
 * Quand on crée un nouveau projet :
 * 
 *  id    Doit correspondre au nom du script dans backend/scripts. Si
 *        l'extension doit être autre chose que .scpt, il faut indiquer
 *        la bonne extension dans :scType.
 *        Si l'on veut utiliser un script tout à fait différent, il faut
 *        l'indiquer dans :script (p.e. 'script: OpenAFile.rb')
 * 
 *  params
 *    Définissent les paramètres du service. 
 *    ON N'UTILISE JAMAIS LE PARAMÈTRE persist:false que ce gros con
 *    de Claude avait décidé unilatéralement d'imposer aux paramètres
 *    pour indiquer qu'ils étaient à redéfinir à chaque fois. Ces 
 *    paramètres-là sont à définir dans dynParams et nulle par 
 *    ailleurs.
 * 
 *  dynParams
 *    Alors que les +params+ sont enregistrés une fois pour toutes
 *    pour le projet donné, les +dynParams (pour "paramètres dyna-
 *    miques") sont demandés chaque fois. C'est par exemple les 
 *    fichiers à commiter et le message pour le commit
 *
 *  onError
 *    Pour définir ce qui doit se passer en cas d'erreur. C'est une 
 *    fonction à interpréter.
 *    Souvent, elle doit utiliser un ErrorsDialog pour afficher la
 *    liste des erreurs survenues.
 * 
 *  afterDefinedParams
 *    Appelée après la définition des paramètres par exemple pour les
 *    modifier.
 *    La fonction doit obligatoirement retourner la nouvelle liste 
 *    des paramètres qui remplacera la liste fournie.
 *    Se souvenir que toutes les valeurs se trouvent dans un array.
 *  
 *  bypassExec
 *    Fonction à exécuter avant d'exécuter le service (par exemple un
 *    message d'alerte.)
 *    La fonction reçoit le callback qu'elle doit rappeler pour
 *    poursuivre.
 * 
 *  beforeExec          (dict) chaque param <id param>: <valeur param>
 *    Peut traiter les paramètres avant l'exécution, pour mettre la 
 *    valeur sous une toute autre forme. 
 *    Voir par exemple l'utilisation pour create-git-issue
 *    Attention à la valeur renvoyée, suivant le script qui doit la 
 *    recevoir. Des erreurs sont facilement possibles.
 * 
 *  afterRunWithSuccess   (projet, retour)
 *    Fonction appelée après avoir exécuté le service avec succès.
 * 

*/
const COUNTDOWN_PROPERTIES = {
    front: Clock.instance.toggle.bind(Clock.instance)
  , params: [
        {id: 'session-duration' , type: 'project', if_undefined: {id: 'session-duration', q: getMsg('work-session-duration'), type: 'integer', default: 120}}
      , {id: 'work-duration'    , type: 'project', if_undefined: {id: 'work-duration', q: getMsg('work-section-duration'), type: 'integer', useLastAsDefault: true}}
    ]
}

const GITHUB_LABELS = [
  'todo', 'bug', 'improve', 'amélioration', 'documentation', 'docu', 'aide', 'help', 
  'feature', 'fonctionnalité', 'help wanted', 'erreur', 'error',
  'typo', 'correction'
] //.map(n => [n, n])

/*******************************************************************/
/**                     SERVICES COMMUNS                          **/
/*******************************************************************/
const COMMON_SERVICES_DATA = [
  {
      id: 'open-folder-project'
    , name: getMsg('open-folder-project')
    , group: getMsg('group-tools')
    , params: [
          {id: 'path',  type: 'project'} // propriété qu'on prend au projet courant
        , {id: 'window-bounds', q: getMsg('set-window-in-finder-and-ok'), type: 'finder-window'}
        , {id: 'sidebar', name: getMsg('sidebar-setting'), q: getMsg('what-size-for-sidebar'), default: 0, type: 'integer'}
      ]
    , afterDefinedParams: (params) => {
      const [pathGroup, boundsGroup, sidebarGroup] = params
      const newBoundsGroup = boundsGroup.slice(1)  // copie, sans le path dupliqué (1er élément du groupe finder-window)
      newBoundsGroup[4] = sidebarGroup[0]          // écrase sidebarWidth (index 4 après ce retrait) par la valeur configurée
      return [pathGroup, newBoundsGroup]
    }
  },
  
  Object.assign({
      id: 'work-clock'
    , name: getMsg('start-clock')
    , group: getMsg('group-tools')
  }, COUNTDOWN_PROPERTIES), 

  // Git issue bug
  {
      id: 'create-git-issue'
    , name: getMsg('gh-save-a-error')
    , group: 'Git'
    , script: 'ExecCommand.sh'
    , params: [
          {id: 'path', type: 'project'}
        ]
    , dynParams: [
          {id: 'issue_title', type: 'string', q: getMsg('error:')}
        , {id: 'issue_body' , type: 'text'  , q: getMsg('error-precise-description:')}
    ]
    , beforeExec: (dict) => {
        return `cd ${shellEscape(dict.path)} && gh issue create -l bug -t ${shellEscape(dict.issue_title)} -b ${shellEscape(dict.issue_body)}`
      }
  },

  // Git create issue quelconque
  /**
   * TODO
   *  il faudrait avoir les étiquettes du projet en question. Pour ça, on pourrait
   *  jouer un script "invisible" qui les récupèrerait et les mettrait dans les
   *  données du projet (data github_labels)
   */
  {
      id: 'gh-issue-create'
    , name: getMsg('gh-issues-create')
    , aide: 'gh-issue-create'
    , group: 'Git'
    , script: 'ExecCommand.sh'
    , params: [
      {id: 'path', type: 'project'}
    ]
    , dynParams: [
        {id: 'issue_label', type: 'select', q: getMsg('github-label'), values: ParamDefiner.projectIssueLabelsForSelect.bind(ParamDefiner)}
      , {id: 'issue_title', type: 'string', q: getMsg('Message:')}
      , {id: 'issue_body' , type: 'text'  , q: getMsg('gh-description:')}
    ]
    , afterDefinedParams: (params) => {
        Project.current.updateLabelList(params[1][0])
      return params
    }
    , beforeExec: (dict) => {
        return `cd ${shellEscape(dict.path)} && gh issue create -l ${shellEscape(dict.issue_label)} -t ${shellEscape(dict.issue_title)} -b ${shellEscape(dict.issue_body)}`
      }
  },

  {
      id: 'git-issue-list'
    , name: getMsg('git-issue-list')
    , aide: 'gh-issue-list'
    , group: 'Git'
    , script: 'ExecCommand.sh'
    , params: [
        {id: 'path', type: 'project'}
      ]
    , dynParams: [
          {id: 'issue_label', type: 'select', q: getMsg('github-label'), values: ParamDefiner.projectIssueLabelsForSelect.bind(ParamDefiner)}
        , {id: 'issue_list', type: 'select', q: getMsg('action-on-checked-issues'), multi: true, values: ParamDefiner.issuesListOfTypeForSelect.bind(ParamDefiner)}
        , {id: 'gh_operation', type: 'select', q: getMsg('gh-operation'), values: 
          [['close', getMsg('gh-close')], ['comment', getMsg('gh-comment')], ['pin', getMsg('gh-pin')], ['unpin', getMsg('gh-unpin')]]}
        , {id: 'gh_message', type: 'string', q: getMsg('gh-message-operation')}
      ]
    , afterDefinedParams: (params) => {
      Project.current.updateLabelList(params[1][0])
      return params
    }
    , afterRunWithSuccess(projet, retour){
        console.log("Après exécution / projet / retour ", projet, retour)
      }
    , beforeExec(dict){
        const option = (function(ope){
          switch(ope){
            case 'close': return 'comment'
            case 'lock':  return 'reason'
            case 'pin': case 'unpin': return null
            default:      return 'body'
          }
        })(dict.gh_operation)
        const issues  = dict.issue_list.join(' ')
        // On doit faire la commande 
        var command
        if (option) {
          const message = shellEscape(dict.gh_message)
          command = `
            for n in ${issues}; do
              gh issue ${dict.gh_operation} "$n" --${option} ${message};
            done;
          `
        } else {
          command = `
            for n in ${issues}; do
              gh issue ${dict.gh_operation} "$n";
            done;
          `
        }
        command = command.replace(/\n\s+/g, ' ').trim()
        console.log("COMMANDE EN UNE LIGNE", command)
        return command
      }
  },

  // Labels 
  {
      id: 'git-install-labels'
    , name: getMsg('git-installing-labels')
    , group: 'Git'
    , script: 'GitOpes.rb'
    , params: [
          {id: 'git_ope', type: 'raw', value: 'update_labels'}
        , {id: 'path', type: 'project'}
      ]
    , dynParams: [
        {id: 'labels_list', type: 'select', multi: true, values: GITHUB_LABELS}
      ]
    , afterDefinedParams(params){
        params[2][0] = params[2][0].join(',')
        return params
      }
  },

  // Git commit push
  {
      id: 'git-commit'
    , name: getMsg('git-committing')
    , group: 'Git'
    , script: 'GitOpes.rb'
    , params: [
        {id: 'git_ope', type: 'raw', value: 'commit'}
      , {id: 'path', type: 'project'}
      ]
    , dynParams: [
        {id: 'files', title: getMsg('choosing-files-to', ['commit']), type: 'select', select_class: 'monospace', q: getMsg('choose-files-to', getMsg('vb-commit')), width: '840px', multi: true, values: ParamDefiner.gitGetStatusFiles.bind(ParamDefiner)}
      , {id: 'message', type: 'string', width: '740px', title: getMsg('git-commit-message-title'), q: getMsg('git-message-commit')}
      ]
    , afterDefinedParams(params){
        console.log("params de git-commit", params)
        params[2][0] = JSON.stringify(params[2][0])
        return params
      }
  },

  {
      id: 'edit-documentation'
    , name: getMsg('editing-documentation') 
    , group: getMsg('group-documentation')
    , scType: '.rb'
    , params: [
        // Ancienne forme {id: 'docu-folder', absolute: true, q: 'Sélectionner le dossier de documentation dans le Finder', type: 'path'}
        // Nouvelle forme : on récupère la valeur dans le projet, mais si elle n'existe pas
        // on se sert de if_undefined pour la déterminer
          {id: 'docu-folder', type: 'project', if_undefined: {type: 'path', q: getMsg('select-docu-folder')}}
        , {id: 'documentation-editor', type: 'app'}
      ]
  },

  // Update de la documentation
  {
      id: 'update-documentation'
    , name: getMsg('update-documentation')
    , group: getMsg('group-documentation')
    , scType: '.rb'
    , onError: (errors) => {
        const data = {
          title: getErr('docu-error-on-update'), 
          errors: errors, 
          ouiBtn: {name: getMsg('Correct'), onclick: Service.runService.bind(Service, 'edit-documentation')}
        }
        new ErrorsDialog(data).show()
      }
    , params: [
        {id: 'docu-main-file-adoc', type: 'project', if_undefined: {q: getMsg('select-docu-main-file'), type: 'path'}}
      ]
  },

  // Ouverture de la documentation
  {
      id:   'open-a-file'
    , name: getMsg('open-documentation')
    , group: getMsg('group-documentation')
    , script: 'OpenOrUpdateInBrowser.scpt'
    , params: [
        {id: 'docu-main-file-html', type: 'project', if_undefined: {q: getMsg('select-doc-main-final-file'), type: 'path'}}
      ]
    , afterDefinedParams: (params) => {
        return [[`file://${params[0][0]}`]]
    }
  },

  // Initialisation de la documentation
  {
      id:   'init-documentation'
    , name: getMsg('initing-documentation')
    , group: getMsg('group-documentation')
    , scType: '.rb'
    , params: [
        {id: 'docu_folder', absolute: true, q: getMsg('select-docu-folder-and-ok'), type: 'path'}
      ]
    , beforeExec(dict){
        return [dict.docu_folder, App.getData('docu-folder-name'), App.getData('docu-main-edit-file')]
      }
    , afterRunWithSuccess: (projet, retour) => {
        const folder = `${retour.request.params[0]}/${App.getData('docu-folder-name')}`
        const mainEditFile = `${folder}/${App.getData('docu-main-edit-file')}`
        const mainDispFile = `${folder}/${App.getData('docu-main-disp-file')}`
        // On les enregistre pour le projet
        projet.set('docu-folder', folder)
        projet.set('docu-main-file-adoc', mainEditFile)
        projet.set('docu-main-file-html', mainDispFile, true)
      }
  },
  {
      id: 'open-iterm-at-folder'
    , name: getMsg('iterm-at-folder')
    , group: 'Consoles'
    , params: [ 
          {id: 'path', type: 'project'} 
        , {id: 'code', type: 'string', q: getMsg('code-to-run-at-launch'), transient: true}
      ]
  },
  {
      id: 'open-terminal-at-folder'
    , name: getMsg('terminal-at-folder')
    , group: 'Consoles'
    , params: [
          {id: 'path', type: 'project'}
        , {id: 'code', type: 'string', q: getMsg('code-to-run-at-launch'), transient: true}
      ]
  },
  {
      id: 'open-in-vscode'
    , name: getMsg('open-in-vscode') 
    , group: 'Consoles'
    , scType: '.sh'
    , params: [
        {id: 'path', type: 'project'}
      ]
  },
  {
      id: 'edit-projet'
    , name: getMsg('editing-project-data') 
    , group: 'Prudence'
    , script: 'OpenAFile.rb'
    , params: [
        {id: 'card_path', type: 'project'}
      ]
    , afterDefinedParams: (params) => params[0]
    , bypassExec: (callback) => {
        message(true, getMsg('alert-before-edit-projet'))
        const timerbeforeexec = setTimeout(() => {
          clearTimeout(timerbeforeexec)
          callback()
        }, 3000)
      }
  }
]

/*******************************************************************/
/**                     SERVICES PERSONNALISÉS                    **/
/*******************************************************************/
const CUSTOM_SERVICES_DATA = [
  {
      id: 'open-file'
    , name: getMsg('open-file…')
    , group: getMsg('opening')
    , scType: '.sh'
    , params: [
        {name: getMsg('file-to-open'), id: 'path', type: 'path', q: getMsg('select-file-in-finder-and-btn') , required: true},
        {name: getMsg('app-to-use'), id: 'app', type: 'logiciel', required: true}
      ]
  },

  {
      id: 'open-finder-window'
    , name: getMsg('opening-window-in-finder')
    , group: getMsg('opening')
    /* tag::exemple-fix-param[] */
    , params: [
        {id: 'window', q: null, value: null, type: 'finder-window', required: true},
        {id: 'sidebar', q: getMsg('sidebar?') , value: null, type: 'boolean', required: false}
      ]
    /* end::exemple-fix-param[] */

    /* tag::exemple-param-order[] */
    , paramsOrder: ['path', 'x', 'y', 'width', 'height', 'sidebar-width', 'type-view', 'show-sidebar']
    /* end::exemple-param-order[] */
  },

  {
      id: 'open-URL'
    , name: 'Ouvrir l’URL…'
    , group: getMsg('opening')
    , params: [
      {id: 'url', q:'Quel URL faut-il rejoindre ?', type: 'url', required: true}
    ]
  },

  {
      id: 'file-versioning'
    , name: getMsg('versioning-file')
    , group: getMsg('lifecycle')
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true},
        {id: 'archive-folder', type: 'path-or-null', q: getMsg('select-archives-folder')}
    ]
    /* tag::exemple-dyn-params[] */
    , dynParams: [
        {id: 'nature-version', q: getMsg('versionning-which-num'), value: null, type: 'select', values: [['patch', getMsg('versionning-patch')], ['minor', getMsg('versionning-minor')], ['major', getMsg('versionning-major')]]}
      ]
    /* end::exemple-dyn-params[] */
  },

  // Minuteur pour un projet
  Object.assign({
      id: 'run-chronometre'
    , name: getMsg('countdown-timer')
    , group: getMsg('lifecycle')

  }, COUNTDOWN_PROPERTIES),

  {
      id: 'run-script-service'
    , name: getMsg('run-a-script-service') + aide('scripts-services')
    , group: getMsg('scripts')
    , front: ScriptService.run
    , params: [
        {id: 'script-service-path', q: getMsg('scserv-select-script-in-finder-and-ok'), type: 'path'}
      ]
  },

  {
      id: 'exec-bash-code'
    , name: getMsg('service-exec-bash-code')
    , group: getMsg('scripts')
    , script: 'ExecCommand.sh'
    , params: [
        {id: 'code', q: getMsg('ask-for-code-to-exec'), description: "(en bash/zsh)", type: 'string'}
      ]
  },

  {
      id: 'exec-js-code'
    , name: getMsg('service-exec-js-code')
    , group: getMsg('scripts')
    , front: Service.evalJavascript.bind(Service)
    , params: [
        {id: 'code', q: getMsg('ask-for-code-to-exec'), description: '(en javascript)', type: 'string'}
      ]
  },



  {
      id: 'run-script'
    , name: getMsg('run-a-script')
    , group: getMsg('scripts')
    , scType: '.rb'
    , params: [
        {id: 'path', value: null, type: 'path', required: true}
      ]
  },

 ]

 // Table de lookup par id (O(1)), pour Service#absData
 // dans ALL_SERVICES_DATA à l'exécution.
 const SERVICES_DATA_TABLE = {}

 function defineSomeVolatileProps(s, stype) {
  SERVICES_DATA_TABLE[s.id] = Object.assign({stype: stype}, s)
  if (s.params.some(p => p.transient)) Object.assign(s, {transient: true})
 }

 CUSTOM_SERVICES_DATA.forEach(s => {defineSomeVolatileProps(s, 'custom')})
 COMMON_SERVICES_DATA.forEach(s => {defineSomeVolatileProps(s, 'common')})

 const ALL_SERVICES_DATA = [...CUSTOM_SERVICES_DATA, ...COMMON_SERVICES_DATA]