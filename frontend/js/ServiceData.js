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
 *    Propriété spéciales/rares :
 *    --------------------------
 *    :if [Function] 
 *        Définit si le paramètre doit être défini ou non. Si la 
 *        fonction retourne true, le paramètre est défini normalement
 *        Sinon, il n'est pas défini et il prend la valeur null.
 *        La fonction reçoit en argument tous les "definers" courant,
 *        c'est-à-dire, dans l'ordre de la définition des paramètres,
 *        leurs propriétés et notamment la propriété :value qui 
 *        définit la valeur. Donc, par exemple, si la condition dé-
 *        pend du deuxième paramètre défini, on teste : 
 *          definers[1].value
 *    :validIf [Function]
 *        Permet de tester la valeur du paramètre avant de poursuivre
 *        et demande de la corriger le cas échéant.
 *        C'est une fonction qui reçoit trois paramètres : la valeur,
 *        le dictionnaire des valeurs définies et le callback à appe-
 *        ler en fin de processus. Cf. ci-dessous.
 * 
 *  dynParams
 *    Alors que les +params+ sont enregistrés une fois pour toutes
 *    pour le projet donné, les +dynParams (pour "paramètres dyna-
 *    miques") sont demandés chaque fois. C'est par exemple les 
 *    fichiers à commiter et le message pour le commit
 *    Propriétés spéciales/rares :
 *    :if [Function] Cf. params
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
 *    Mais chaque fonction reçoit maintenant en argument un dict de
 *    toutes les valeurs.
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
 *  afterRunWithSuccess   (projet, retour, dictValues)
 *    Fonction appelée après avoir exécuté le service avec succès.
 *    dictValues est une table de toutes les valeurs avec en clé l'id
 *    du param/dynparam et en valeur, la valeur du paramètre.
 * 

*/

// Action qu'on peut accomplir sur les Git issues
const ISSUE_ACTION_LIST = [['view', getMsg('View')], ['close', getMsg('gh-close')], ['comment', getMsg('gh-comment')], ['pin', getMsg('gh-pin')], ['unpin', getMsg('gh-unpin')]]
const ISSUE_ACTION_WITHOUT_COMS = {'view': true, 'pin': true, 'unpin': true}

const COUNTDOWN_PROPERTIES = {
    front: Clock.instance.toggle.bind(Clock.instance)
  , params: [
        {id: 'session-duration' , type: 'project', if_undefined: {id: 'session-duration', q: getMsg('work-session-duration'), type: 'integer', default: 120}}
      , {id: 'work-duration'    , type: 'project', if_undefined: {id: 'work-duration', q: getMsg('work-section-duration'), type: 'integer', useLastAsDefault: true}}
    ]
}

const GITHUB_LABELS = [
  'todo', 'bug', 'test', 'improve', 'amélioration', 'documentation', 'docu', 'aide', 'help', 
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

  {
      id: 'search-project'
    , name: getMsg('search-project')
    , group: getMsg('group-tools')
    , scType: '.rb'
    , params: [
        {id: 'path', type: 'project'}
      , {id: 'excluded-folders', type: 'excluded-folders', default: 'documentation', q: getMsg('excluded-folders-q'), width: '1040px'}
      ]
    , dynParams: [
        {id: 'extensions', type: 'select', multi: true, q: getMsg('extensions-q'), values: ParamDefiner.projectExtensionsForSelect.bind(ParamDefiner)}
      , {id: 'search-text', type: 'string', q: getMsg('search-text-q'), width: '620px'
          , validIf: (v, dictParamsValues, callback) => callback(v && v.trim() ? null : getErr('prop-cant-be-empty', [getMsg('search-text-q')]))
        }
      ]
    , afterDefinedParams(params){
        params[2][0] = JSON.stringify(params[2][0])
        return params
      }
    , afterRunWithSuccess: (projet, retour, dictParamsValues) => {
        new SearchResultsDialog({
            results:    retour.data.results ?? []
          , searchText: dictParamsValues['search-text']
          , openAction: 'open-project-search-result'
        }).show()
      }
  },



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
          {id: 'issue_title', type: 'string', q: getMsg('error:'), width: '680px', title: getMsg('gh-save-a-error')}
        , {id: 'issue_body' , type: 'text'  , q: getMsg('error-precise-description:'), width: '680px', title: getMsg('gh-save-a-error')}
    ]
    , beforeExec: (dict) => {
        return `cd ${shellEscape(dict.path)} && gh issue create -l bug -t ${shellEscape(dict.issue_title)} -b ${shellEscape(dict.issue_body)}`
      }
    , successMessage: (retour) => getMsg('gh-issue-created', [(retour.message || '').match(/\/issues\/(\d+)/)?.[1] ?? '?'])
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
      , {id: 'issue_title', type: 'string', q: getMsg('Message:'), width: '680px'}
      , {id: 'issue_body' , type: 'text'  , q: getMsg('gh-description:'), width: '680px'}
    ]
    , afterDefinedParams: (params) => {
        Project.current.updateLabelList(params[1][0])
      return params
    }
    , beforeExec: (dict) => {
        return `cd ${shellEscape(dict.path)} && gh issue create -l ${shellEscape(dict.issue_label)} -t ${shellEscape(dict.issue_title)} -b ${shellEscape(dict.issue_body)}`
      }
    , successMessage: (retour) => getMsg('gh-issue-created', [(retour.message || '').match(/\/issues\/(\d+)/)?.[1] ?? '?'])
  },

  // Travail sur une liste d'issues
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
          {id: 'issue_label', type: 'select', q: getMsg('github-label'), multi: true, values: ParamDefiner.projectIssueLabelsForSelect.bind(ParamDefiner), title: getMsg('git-issue-gestion')}
        , {id: 'issue_list', type: 'select', q: getMsg('action-on-checked-issues'), multi: true, width: '1000px', values: ParamDefiner.issuesListOfTypeForSelect.bind(ParamDefiner), title: getMsg('git-issue-gestion')}
        , {id: 'gh_operation', type: 'select', q: getMsg('gh-operation'), title: getMsg('git-issue-gestion'), values: ISSUE_ACTION_LIST}
        , {id: 'gh_message', if: (dictParamsValues) => {
            return !ISSUE_ACTION_WITHOUT_COMS[dictParamsValues.gh_operation]
            }, type: 'string', q: getMsg('gh-message-operation'), width: '600px', title: getMsg('git-issue-gestion')}
      ]
    , afterDefinedParams: (params) => {
      Project.current.updateLabelList(params[1][0])
      return params
    }
    , afterRunWithSuccess(projet, retour, dictParamsValues){
        console.log("Après exécution avec succès / projet / retour / service, dictParamsValues", projet, retour, dictParamsValues)
        if (dictParamsValues.gh_operation == 'view') {
          // <= Opération particulière, pour voir les issues sélectionnées
          // => Il faut les afficher.
          Git.view(retour.message)
        }
      }
    , successMessage: () => undefined // pas de message de confirmation pour ce service
    , beforeExec(dict){
        // En fonction de l'opération à exécuter, le message (gh_message)
        // sera utilisé différemment.
        //
        const option = (function(ope){
          switch(ope){
            case 'close': return 'comment'
            case 'lock':  return 'reason'
            // Ceux qui ne prennent pas de messages
            case 'pin': case 'unpin': case 'view': return null
            default:      return 'body'
          }
        })(dict.gh_operation)
        const issues  = dict.issue_list.join(' ')
        // On doit faire la commande
        var command
        if (dict.gh_operation == 'view') {
          command = `
            for n in ${issues}; do
              gh issue view "$n" --json number,title,body,author,labels,assignees,milestone,comments,state,url,createdAt,updatedAt;
            done;
          `
        } else if (option) {
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
        command = `cd ${shellEscape(dict.path)} && ` + command.replace(/\n\s+/g, ' ').trim()
        // console.log("COMMANDE EN UNE LIGNE", command)
        return command
      }
  },


  {
    id: 'github-pr-cycle-init'
    , name: getMsg('github-pr-cycle-init')
    , aide: 'github-pull-request-cycle'
    , group: 'Git'
    , script: 'PR_Github_Cycle.rb'
    , params: [
        {id:'path', type:'project'}
      , {id: 'phase', type:'raw', value: 'init'}
    ]
    , dynParams: [
      {id: 'confirm_init'
        , title:  getMsg('github-pr-cycle-confirming-init')
        , q:      getMsg('github-pr-cycle-confirm-init')
        , type:   'confirm'
      }
      , {id: 'branche-name', q: getMsg('github-pr-cycle-branch-name'), type: 'string', validIf: (v, dictParamsValues, callback) => callback(v.match(/^[a-z0-9_-]+$/) ? null : getErr('invalid-value', [v]))}
    ]
    // confirm_init n'est qu'une porte d'entrée (annule tout le service si
    // refusé, cf. Prompter#promptConfirm) : sa valeur ne doit JAMAIS être
    // envoyée au script backend, qui attend [path, phase, branche] en
    // positions fixes — sans ce filtre, un "oui" (true) se retrouverait
    // en 3e position à la place du nom de branche.
    , beforeExec(dict){
        return [dict.path, dict.phase, dict['branche-name']]
      }
    , afterRunWithSuccess(projet, retour, dictValue) {
        // On enregistre le branche courante.
        projet.set('git_pr_cycle_branche', dictValue['branche-name'], true)
      }
  },

  {
    id: 'github-pr-cycle-commit'
    , name: getMsg('github-pr-cycle-commit')
    , aide: 'github-pull-request-cycle'
    , group: 'Git'
    , script: 'PR_Github_Cycle.rb'
    , params: [
        {id:'path', type:'project'}
      , {id: 'phase', type:'raw', value: 'commit'}
      , { id: 'git_pr_cycle_branche', type:'project'
          , if_undefined: {type: 'cancel', title: 'github-pr-cycle-commit', q: getErr('git-commit-init-required')}}
    ]
    , dynParams: [
      {id: 'commit-title', q: getMsg('github-pr-cycle-commit-title'), type: 'string'}
      , {id: 'commit-body', q: getMsg('github-pr-cycle-commit-body'), type: 'string'}
    ]
    , onError: (error) => {
        // On passe ici quand une erreur s'est produite au commit. 
        // Cette erreur peut avoir de nombreuses causes : 
        // 1- des erreurs de syntaxe ont été trouvé dans les fichiers
        //    à commiter. Fonction première de ces erreurs.
        // 2- un erreur au commit lui-même 
        // 3- une erreur de commande inexistante 
        // 4- une autre erreur
        const msg = []
        if (Array.isArray(error) && error.length == 2) { 
          msg.push(getErr(...error))
        } else if (error.syntax && error.conflict) {
          // conflict:  [ {path: string, error: errId }]
          // syntax:    [ {path: string, error: errId | [errId, vals]} ]
          msg.push(getMsg('git-title-conflict-errors-section'))
          error.conflict.forEach(conf => {
            msg.push(`<div>${conf.path} : ${getErr(conf.error)}</div>`)
          })
          msg.push(getMsg('git-title-syntax-errors-section'))
          error.syntax.forEach(synt => {
            if ('string' == typeof synt.error) {
              msg.push(`<div>${synt.path} : ${getErr(synt.error)}</div>`)
            } else {
              msg.push(`<div>${synt.path} : ${getErr(...synt.error)}</div>`)
            }
          })
        }
        // Affichage du message d'erreur
        const divError = DCreate('DIV', {class:'error'})
        divError.innerHTML = msg.join('')
        const dataDial = {
          title: 'git-commit-title-erros'
          , message: ""
          , content: divError
          , nonBtn: null
        }
        new ErrorsDialog(dataDial).show()
    }
  },

  {
    id: 'github-pr-cycle-submit'
    , name: getMsg('github-pr-cycle-submit')
    , aide: 'github-pull-request-cycle'
    , group: 'Git'
    , script: 'PR_Github_Cycle.rb'
    , params: [
        {id:'path', type:'project'}
      , {id: 'phase', type:'raw', value: 'submit'}
      , { id: 'git_pr_cycle_branche', type:'project'
          , if_undefined: {type: 'cancel', title: 'github-pr-cycle-commit', q: getErr('git-commit-init-required')}}
    ]
    , dynParams: [
      {id: 'confirm_submit'
        , title:  getMsg('github-pr-cycle-confirming-submit')
        , q:      getMsg('github-pr-cycle-confirm-submit')
        , type:   'confirm'
      }
    ]
    , afterRunWithSuccess(dictValues, retour){
        console.log("Retour après github-pr-cycle-submit", retour, dictValues)
        message(true, getMsg('github-pr-cycle-submission-ok'))
      }

  },



  // Labels (à mettre dans tools)
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
    , repeat: true
    , params: [
        {id: 'git_ope', type: 'raw', value: 'commit'}
      , {id: 'path', type: 'project'}
      ]
    , dynParams: [
        {id: 'files', title: getMsg('choosing-files-to',['commit']), ouiBtnIf:function(dialog){return dialog.values.length > 0}, type: 'select', select_class: 'monospace', q: getMsg('choose-files-to', getMsg('vb-commit')), width: '840px', multi: true, values: ParamDefiner.gitGetStatusFiles.bind(ParamDefiner)}
      , {id: 'message', type: 'string', width: '740px', title: getMsg('git-commit-message-title'), q: getMsg('git-message-commit')}
      ]
    , afterDefinedParams(params){
        // console.log("params de git-commit", params)
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
    , successMessage: () => undefined // pas de message de confirmation pour ce service
  },

  {
      id: 'search-documentation'
    , name: getMsg('search-documentation')
    , group: getMsg('group-documentation')
    , scType: '.rb'
    , params: [
        {id: 'docu-folder', type: 'project', if_undefined: {type: 'path', q: getMsg('select-docu-folder')}}
      ]
    , dynParams: [
        {id: 'search-type', type: 'dropdown', q: getMsg('search-type-q'), values: [
            ['any',    getMsg('search-type-any')]
          , ['target', getMsg('search-type-target')]
          , ['link',   getMsg('search-type-link')]
        ]}
      , {id: 'search-text', type: 'string', q: getMsg('search-text-q'), width: '620px'
          , validIf: (v, dictParamsValues, callback) => callback(v && v.trim() ? null : getErr('prop-cant-be-empty', [getMsg('search-text-q')]))
        }
      ]
    , afterRunWithSuccess: (projet, retour, dictParamsValues) => {
        new SearchResultsDialog({
            results:    retour.data.results ?? []
          , searchText: dictParamsValues['search-text']
        }).show()
      }
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
      , {id: 'default-browser', type: 'app'}
      ]
    , afterDefinedParams: (params) => {
        return [[`file://${params[0][0]}`], [params[1][0]]]
    }
  },

  // Initialisation de la documentation
  {
      id:   'init-documentation'
    , name: getMsg('initing-documentation')
    , group: getMsg('group-documentation')
    , scType: '.rb'
    , params: [
        {id: 'docu-folder', type: 'project'
          , if_undefined: {type: 'path', q: getMsg('select-docu-folder-and-ok')}}
      ]
    , beforeExec(dict){
        return [ dict['docu-folder'] ]
      }
    , afterRunWithSuccess: (projet, retour, dictValues) => {
        const folder = dictValues['docu-folder']
        const mainEditFileName = `${folder.split('/').at(-1)}.adoc`
        const mainDispFileName = `${folder.split('/').at(-1)}.html`
        const mainEditFile = `${folder}/${mainEditFileName}`
        const mainDispFile = `${folder}/${mainDispFileName}`
        // On les enregistre pour le projet
        projet.set('docu-main-file-adoc', mainEditFile)
        projet.set('docu-main-file-html', mainDispFile, true)
      }
  },
  // Ouvrir un iTerm au dossier (pour jouer un code)
  {
      id: 'open-iterm-at-folder'
    , name: getMsg('iterm-at-folder')
    , group: 'Consoles'
    , params: [
        {id: 'path', type: 'project'}
      , {id: 'code', type: 'string', q: getMsg('code-to-run-at-launch'), noCorrection: true}
      ]
  },
  // Ouvrir un Terminal au dossier (pour jouer un code)
  {
      id: 'open-terminal-at-folder'
    , name: getMsg('terminal-at-folder')
    , group: 'Consoles'
    , params: [
        {id: 'path', type: 'project'}
      , {id: 'code', type: 'string', q: getMsg('code-to-run-at-launch'), noCorrection: true}
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
      id: 'file-create'
    , name: getMsg('create-a-file')
    , group: 'Consoles'
    , scType: '.rb'
    , params: [
        {id: 'path', type: 'project'}
      ]
    , dynParams: [
          {id: 'file_path', type: 'string', q: getMsg('ask-path-to-file-in-folder'), width: '800px'
            , validIf: (relPath, dictParamsValues, callback) => {
                const fullPath = relPath.startsWith('/') ? relPath : `${dictParamsValues.path}/${relPath}`
                Validator.fileExists(fullPath, (exists) => callback(exists ? getErr('file-already-exists-at', [relPath]) : null))
              }
          }
        , {id: 'file_content', type: 'text', q: getMsg('ask-file-content'), width: '840px', height: 'max'}
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
        new ConfirmDialog({
            title: getMsg('editing-project-data')
          , message: getMsg('alert-before-edit-projet') + "<br><br>" + getMsg('edit-projet-reload-hint', [svg('reload', 'btn')])
          , ouiBtn: {name: getMsg('OK'), onclick: callback}
          , nonBtn: {name: getMsg('Cancel')}
        }).show()
      }
    , afterRunWithSuccess: (projet) => {
        projet.dataEdited = true
        Project.affProjectButtons()
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
        {id: 'sidebar', q: getMsg('sidebar?') , value: null, default: false, type: 'boolean', required: false}
      ]
    /* end::exemple-fix-param[] */

    /* tag::exemple-param-order[] */
    , paramsOrder: ['path', 'x', 'y', 'width', 'height', 'sidebar-width', 'type-view', 'show-sidebar']
    /* end::exemple-param-order[] */
  },

  {
      id: 'open-URL'
    , name: getMsg('Open-url…')
    , group: getMsg('opening')
    , params: [
      {id: 'url', q:getMsg('which-url-to-reach'), type: 'url', required: true}
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

 function registerServiceData(s, stype) {
  SERVICES_DATA_TABLE[s.id] = Object.assign({stype: stype}, s)
 }

 CUSTOM_SERVICES_DATA.forEach(s => {registerServiceData(s, 'custom')})
 COMMON_SERVICES_DATA.forEach(s => {registerServiceData(s, 'common')})

 const ALL_SERVICES_DATA = [...CUSTOM_SERVICES_DATA, ...COMMON_SERVICES_DATA]