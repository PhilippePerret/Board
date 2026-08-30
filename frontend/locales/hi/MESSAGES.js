/**
 * Pour obtenir ces emssages :
 * getMsg(id, params)
 *
 * FICHIERS LOCALISÉS (TRAITÉS INTÉGRALEMENT)
        Aide.js
        App.js
        AppData.js
        Clock.js
        Dateutils.js
        Debug.js
        Dialog.js
        Dialogs.js

 */
const MESSAGES = {
    'premier': "sans virgule"

    // --- STATIQUE (index.html) ---
    , 'Board': "बोर्ड"
    , 'Help': "सहायता"
    , 'Debug': "डिबग"
    , 'Tools': "उपकरण"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "हाँ"
    , 'btn-no': "नहीं"
    , 'OK': 'ठीक है'
    , 'GO!': 'शुरू करें!'
    , ':'   :   ' : '
    , 'new…': "नया…"
    , 'None': 'कोई नहीं'
    , 'Nonee': 'कोई नहीं'
    , 'Empty': 'खाली'
    , 'error:': "त्रुटि:"
    , 'other-value…': 'अन्य मान…'
    , 'date/at': 'को' // pour une date avec heure
    , 'date/months': "जनवरी|फ़रवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर"
    , 'date/format': "%J %_M %Y"
    , 'Cancel': "रद्द करें"
    , 'Correct': "सुधारें"
    , 'its-noted': "समझ गया"
    , 'remind-me-later': "मुझे बाद में याद दिलाएँ"
    , '(by-default)': "(डिफ़ॉल्ट)"
    , 'Color': 'रंग'
    , 'Image': 'चित्र'
    , 'Nothing': 'कुछ नहीं'
    , 'This-one': 'यह'
    , 'This-onee': "यह"
    , 'Preserve': "सुरक्षित रखें"
    , 'app-to-use': "उपयोग करने के लिए एप्लिकेशन"
    , 'choosing-files-to': "$1 के लिए फ़ाइलों का चयन"
    , 'choose-files-to': "$1 के लिए फ़ाइलें चुनें"
    , 'select-filter-placeholder': "फ़िल्टर करें…"
    , 'select-all-tooltip': "सभी का चयन करें"
    , 'select-none-tooltip': "सभी का चयन रद्द करें"
    , 'fatal-error': "गंभीर त्रुटि"
    , 'ope-aborted': 'ऑपरेशन रद्द कर दिया गया'
    , 'samples': "नमूने" // (musique)
    , 'work-duration:': 'कार्य अवधि: '
    , 'created-at:': 'बनाया गया: '
    , 'modify-at:': '/संशोधित: '
    , 'url-definition': 'URL परिभाषा'

    // Verbes
    , 'vb-commit': 'कमिट करना'
    , 'Ignore': 'अनदेखा करें'
    , 'Finish': "समाप्त करें" // dans le sens d'un ordre donné
    , 'Apply': "लागू करें"
    , 'Import': 'आयात करें'
    , 'sustract': "हटाना"
    , 'Open-url…': 'URL खोलें…'
    , 'modify-it': 'इसे संशोधित करें'
    , 'Validate': 'सत्यापित करें'

    // Logique
    , 'id-is-required': "एक पहचानकर्ता (`id`) आवश्यक है"
    , 'type-is-required': "प्रकार अवश्य परिभाषित होना चाहिए।"

    // Data
    , 'path-to-data': "डेटा का पथ"
    , 'id-in-data': 'डेटा में ID (यदि आवश्यक हो)'

    // Prompt
    , 'Parameter-definition': 'पैरामीटर परिभाषा'

    // File
    , 'add-to-file-at': "किसी भी स्थान पर फ़ाइल में जोड़ें"
    , 'which-url-to-reach': 'किस URL तक पहुँचना है?'
    , 'destination-folder-or-file': 'गंतव्य (फ़ोल्डर या फ़ाइल)'
    , 'backend-file-created': "फ़ाइल $1 बना दी गई है।"

    // App
    , 'app-config': 'एप्लिकेशन कॉन्फ़िगरेशन'
    , 'app-version': 'एप्लिकेशन संस्करण'
    , 'remember-last-project': 'अंतिम प्रोजेक्ट याद रखें'
    , 'default-browser': 'डिफ़ॉल्ट ब्राउज़र'
    , 'code-editor': 'कोड संपादक'
    , 'text-simple-editor': 'सादा पाठ संपादक'
    , 'yaml-editor': 'YAML संपादक'
    , 'docu-editor': 'दस्तावेज़ संपादक'
    , 'docu-folder-name': 'दस्तावेज़ फ़ोल्डर का नाम'
    , 'changelog-file-name': 'Changelog फ़ाइल का नाम'
    , 'todo-file-name': 'TODO फ़ाइल का नाम'
    , 'last-project-id': 'अंतिम चयनित प्रोजेक्ट'
    , 'backend-app-data-save': "एप्लिकेशन डेटा सहेजा गया।"

    // Minuteur
    , 'work-session-duration': 'एक कार्य सत्र की अवधि (मिनट)'
    , 'work-section-duration': 'एक कार्य खंड की अवधि (मिनट)'
    , 'start-clock': 'घड़ी शुरू करें'
    , 'clock-work-done': 'सत्र के दौरान किया गया कार्य: '
    , 'clock-work-is-done': "आप कार्य की समय-सीमा तक पहुँच गए हैं"
    , 'clock-10-minutes-remaining': "आपके पास 10 मिनट का कार्य समय शेष है"
    , 'of-work-on-project': " प्रोजेक्ट “$1” पर।"
    , 'clock-ask-work-restarted': "क्या कार्य फिर से शुरू हो गया है?"
    , 'clock-todo-next-session': "अगले सत्र में किया जाने वाला कार्य: "
    , 'clock-work-time': "कार्य समय:"
    , 'clock-restart': 'फिर से शुरू करें'
    , 'Confirm': 'पुष्टि करें'
    , 'End-of-session': 'सत्र समाप्ति'
    , 'Find': "खोजें"
    , 'file-opened': "फ़ाइल '$1' खुली है।"
    , 'Minuteur': "टाइमर"
    , 'Next': 'अगला'
    , 'Save': 'सहेजें'
    , 'scripts': "स्क्रिप्ट"
    , 'ask-still-working': "क्या प्रोजेक्ट “$1” पर कार्य अभी भी जारी है?"

    // --- UI ---
    , 'Window-position-and-size': 'विंडो की स्थिति और आकार'
    , 'which-widhow-app': 'किस एप्लिकेशन की अग्रभूमि विंडो को ध्यान में रखा जाना चाहिए?' + '<div class="small">इसका आकार और स्थिति क्लिपबोर्ड में कॉपी की जाएगी</div>'
    , 'window-position-and-size': "एप्लिकेशन $1 में सबसे आगे की विंडो की स्थिति और आकार:"
    , 'click-button-if-data-ok': "यदि यह डेटा सही है, तो “$1” बटन पर क्लिक करें"
    , 'countdown-timer': "टाइमर"
    , 'lifecycle': "जीवनचक्र"
    , 'open-folder-project': "प्रोजेक्ट फ़ोल्डर खोलें"
    , 'opening': "खोलना"
    , 'run-a-script': "एक स्क्रिप्ट चलाएँ"
    , 'run-a-script-service': "एक स्क्रिप्ट-सेवा चलाएँ"
    , 'Defining-a-color': "एक रंग परिभाषित करना"
    , 'choose-a-color': "नीचे दिए गए पिकर से एक रंग चुनें।"
    , 'group-tools': "उपकरण"
    , 'error-precise-description:': "त्रुटि का सटीक विवरण:"
    , 'clock-set-pause': "रोकें"

    // --- PROJETS ---
    , 'current-projects-displayed': "वर्तमान प्रोजेक्ट प्रदर्शित।"
    , 'data-project-id': 'प्रोजेक्ट ID'
    , 'data-project-icon': 'प्रोजेक्ट आइकन'
    , 'data-project-folder': 'प्रोजेक्ट फ़ोल्डर'
    , 'data-project-title': "प्रोजेक्ट शीर्षक"
    , 'data-project-nature': "प्रोजेक्ट प्रकार"
    , 'importing-new-project': "नया प्रोजेक्ट आयात करना"
    , 'data-project-standby': 'प्रोजेक्ट को स्टैंडबाय में डालें'
    , 'data-project-todoist': 'Todoist में प्रोजेक्ट ID'
    , 'data-github-account': 'Github खाता (प्रोजेक्ट का)'
    , 'data-project-createdat': "प्रोजेक्ट बनाने की तारीख"
    , 'data-project-lastmod': 'अंतिम संशोधन तिथि'
    , 'duration-work-done': 'पूर्ण किया गया कार्य समय (मिनट)'
    , 'background-img-or-color': 'पृष्ठभूमि रंग या चित्र'
    , 'githug-label-desc': "Github इश्यू लेबल"

    , 'title-project': "प्रोजेक्ट “$1”"
    , 'new-project-name': "नए प्रोजेक्ट का नाम"
    , 'name-to-give-to-project': "इस प्रोजेक्ट को दिया जाने वाला नाम"
    , 'title-data-of-project': "प्रोजेक्ट “$1” का डेटा"
    , 'select-project-folder-and-ok': "Finder में प्रोजेक्ट फ़ोल्डर चुनें, फिर “OK” पर क्लिक करें।"
    , 'project-saved-success': "प्रोजेक्ट «$1» को $2 पर सफलतापूर्वक सहेजा गया।"
    , 'alert-before-edit-projet': "ध्यान दें, संवेदनशील डेटा। केवल तभी आगे बढ़ें जब आप जानते हों कि आप क्या कर रहे हैं।"
    , 'expli-retrait-projet': "प्रोजेक्ट “$1” को हटाने से उसका फ़ोल्डर प्रभावित नहीं होता। यह केवल इस डैशबोर्ड से हटाया जाता है या संग्रहीत किया जाता है (ताकि इसे बाद में पुनर्प्राप्त किया जा सके)\n\nध्यान दें, यदि प्रोजेक्ट संग्रहीत नहीं है, तो उसकी सभी सेवाएँ और डेटा निश्चित रूप से खो जाएँगे।"
    , 'project-folder-not-selected': 'प्रोजेक्ट फ़ोल्डर को Finder में चुना जाना चाहिए'
    , 'folder-required': 'एक फ़ोल्डर चुनना अनिवार्य है।'
    , 'Other-genre': "अन्य प्रकार…"
    , 'editing-project-data': "प्रोजेक्ट डेटा संपादित करें"
    , 'versionning-which-num': 'किस संख्या को अपडेट किया जाना चाहिए?'
    , 'versionning-patch': 'पैच'
    , 'versionning-minor': 'माइनर संस्करण'
    , 'versionning-major': 'मेजर संस्करण'
    , 'select-archives-folder': 'Finder में संग्रह फ़ोल्डर चुनें (या यदि फ़ाइल संग्रहीत नहीं की जानी है तो कोई नहीं)।'
    , 'archives…': "संग्रह…"
    , 'confirming-import': "आयात की पुष्टि"
    , 'confirming-project-substract': "प्रोजेक्ट हटाने की पुष्टि"
    , 'project-substracted': "प्रोजेक्ट प्रोजेक्ट सूची से हटा दिया गया।"
    , 'ending-startup-project-x': "प्रोजेक्ट “$1” की शुरुआत समाप्त।"
    , 'modifying-project-title': "प्रोजेक्ट शीर्षक में संशोधन"
    , 'click-to-modify-title': 'शीर्षक बदलने के लिए क्लिक करें'
    // Projet et Service
    , 'startup-services': 'स्टार्टअप सेवाएँ'
    , 'others-services': 'अन्य सेवाएँ'
    // Projet et Todoist
    , 'todoist-tasks': 'Todoist कार्य'
    // Projet et archives
    , 'archived-projects': "संग्रहीत प्रोजेक्ट"
    , 'choose-project-to-restart': "फिर से सक्रिय करने के लिए प्रोजेक्ट चुनें।"

    // Finder
    , 'open-file…': 'फ़ाइल खोलें…'
    , 'file-to-open': "खोलने के लिए फ़ाइल"
    , 'opening-window-in-finder': 'Finder में एक विंडो खोलें'
    , 'sidebar-setting': "साइडबार सेटिंग"
    , 'sidebar?': "क्या आप साइडबार चाहते हैं?"
    , 'what-size-for-sidebar': 'साइडबार को कितना बड़ा रखा जाए (छिपाने के लिए 0 डालें)?'
    , 'Choosing-finder-element': "Finder तत्व चुनना"
    , 'select-el-in-finder-and-ok': "Finder में तत्व चुनें और OK पर क्लिक करें।"    , 'which-url': "किस URL तक पहुँचना है?"
    , 'select-file-in-finder-and-btn': "Finder में खोलने के लिए फ़ाइल चुनें, फिर “चुनें”।"
    , 'Choosing-a-folder': "एक फ़ोल्डर चुनना"
    , 'select-folder-and-ok': "Finder में फ़ोल्डर चुनें और OK पर क्लिक करें।"
    , 'select-el-in-project-and-ok': "प्रोजेक्ट फ़ोल्डर में तत्व चुनें और OK पर क्लिक करें।"
    , 'set-window-in-finder-and-ok': "Finder में विंडो खोलें और इसे इच्छानुसार सेट करें (स्थिति, आकार, दृश्य प्रकार) फिर OK पर क्लिक करें।"
    , 'pos-window-in-finder-and-ok' : "Finder में विंडो की स्थिति सेट करें और “OK” पर क्लिक करें।"
    , 'sel-el-in-finder-or-click-none' : "Finder में तत्व चुनें या 'कोई नहीं' पर क्लिक करें।"

    // -- Service --
    , 'Common-services': 'सामान्य सेवाएँ'
    , 'Custom-services': 'कस्टम सेवाएँ'
    , 'running-service-x': "सेवा $1 शुरू हो रही है…"
    , 'service-success': ' सेवा “$1” सफलतापूर्वक चलाई गई (<span class="tiny">(सेवा $2)</span>)।'
    , 'service-exec-bash-code': 'bash कोड चलाएँ…'
    , 'service-exec-js-code': "JS कोड चलाएँ…"
    , 'ask-for-code-to-exec': 'चलाने के लिए कोड:'
    , 'ask-save-work-time': 'क्या कार्य समय सहेजा जाना चाहिए?'
    , 'Defining-parameter': 'पैरामीटर परिभाषा'
    , 'app-choice': "एप्लिकेशन का चुनाव"
    , 'choose-app-to-use': 'उपयोग करने के लिए एप्लिकेशन चुनें'
    , 'other-app': 'अन्य एप्लिकेशन…'
    , 'new-service-name': 'सेवा का नया नाम'
    , 'which-name-for-project-service': 'इस प्रोजेक्ट के लिए इस सेवा को कौन सा नया नाम दिया जाए?'
    , 'choose-color-or-image': "रंग या चित्र चुनें"
    , 'which-background': 'आप पृष्ठभूमि के रूप में क्या चुनना चाहते हैं?'
    , 'phone-number': 'फ़ोन नंबर'
    , 'which-phone-number': 'कृपया एक मान्य फ़ोन नंबर प्रदान करें।'
    , 'date-and-hour': 'तारीख और समय'
    , 'versioning-file': 'फ़ाइल/फ़ोल्डर का संस्करण बनाना'
    , "Service supprimé ($1)": "सेवा हटाई गई ($1)"
    , 'Learn-to-select-the-service': "सेवा चुनना सीखें"
    , 'aborted-definition': 'परिभाषा रद्द कर दी गई।'
    // Scripts-services
    , 'Scripts-services': "स्क्रिप्ट सेवा"
    , 'script-service-canceled': "स्क्रिप्ट-सेवा रद्द कर दी गई।"

    // IDE et Terminaux
    , 'iterm-at-folder': 'फ़ोल्डर पर iTerm'
    , 'terminal-at-folder': 'फ़ोल्डर पर टर्मिनल'
    , 'open-in-vscode': 'VSCode में खोलें'
    , 'code-to-run-at-launch': 'शुरुआत में चलाने के लिए कोड'
    // Git
    , 'gh-save-a-error': "एक त्रुटि सहेजें (gh)"
    , 'initing-git-for-project': "प्रोजेक्ट के लिए Git आरंभ करें…"
    , 'github-account': "आपके Github खाते का नाम"
    , 'github-project-name': "Github पर प्रोजेक्ट का नाम"
    , 'git-committing': "Github पर कमिट करें"
    , 'git-message-commit': 'इन फ़ाइलों के लिए कमिट संदेश'
    , 'git-commit-message-title': "कमिट संदेश"
    , 'gh-issues-create': "प्रकार का नया इश्यू…"
    , 'git-issue-list': "प्रकार के इश्यू…"
    , 'github-label': "Github लेबल:"
    , 'Message:': "संदेश:"
    , 'gh-description:': "अधिक सटीक विवरण:"
    , 'gh-operation': "चलाने के लिए gh ऑपरेशन"
    , 'gh-message-operation': "इस ऑपरेशन से जुड़ा संदेश:"
    , 'action-on-checked-issues': "प्रोसेस करने के लिए इश्यू चुनें और कार्रवाई चुनें।"
    , 'gh-close': "बंद करें / हटाएँ"
    , 'gh-comment': "टिप्पणी करें"
    , 'gh-pin': 'पिन करें'
    , 'gh-unpin': 'अनपिन करें'
    , 'git-installing-labels': "Git लेबल परिभाषित करना"
    , 'git-init-btn': "प्रोजेक्ट पर Git आरंभ करें"
    , 'git-issue-gestion': "Github issue प्रबंधन"
    , 'backend-add-labels-ajout': " + लेबल परिभाषा।"
    , 'backend-git-ready': "फ़ोल्डर के लिए Git तैयार है"
    , 'backend-git-failed': "git $1 विफल: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Finder में सेवा की स्क्रिप्ट चुनें, फिर “OK”।'
    , 'scserv-end': 'स्क्रिप्ट-सेवा सफलतापूर्वक समाप्त हुई (कम से कम कोई त्रुटि नहीं)।'
    , 'scserv-datetime-default-format': 'DD MM HH:MM (03 08 05:12 का अर्थ है 3 अगस्त 5:12 बजे)'
    , 'Opening-script-file': 'स्क्रिप्ट फ़ाइल खोलना'
    , 'ask-for-modify-script-file': "क्या आप स्क्रिप्ट फ़ाइल (जो चरण परिभाषित करती है) को संशोधित करना चाहते हैं?"

    // -- Documentation --
    , 'Documentation': 'दस्तावेज़ीकरण'
    , 'group-documentation': "दस्तावेज़ीकरण"
    , 'docu-folder': 'दस्तावेज़ फ़ोल्डर'
    , 'editing-documentation': 'दस्तावेज़ीकरण संपादित करें'
    , 'initing-documentation': "दस्तावेज़ीकरण आरंभ करें"
    , 'update-documentation': 'दस्तावेज़ीकरण अपडेट करें'
    , 'open-documentation': 'दस्तावेज़ीकरण खोलें'
    , 'select-docu-folder-and-ok': 'दस्तावेज़ रखने के लिए फ़ोल्डर चुनें, फिर “OK”।'
    , 'select-docu-folder': 'Finder में दस्तावेज़ फ़ोल्डर चुनें'
    , 'select-docu-main-file': 'दस्तावेज़ की मुख्य फ़ाइल चुनें (डिफ़ॉल्ट: docu.adoc)'
    , 'select-doc-main-final-file': 'मैनुअल फ़ाइल चुनें (डिफ़ॉल्ट: docu.html)'
    , 'docu-main-file-name': 'दस्तावेज़: संपादन योग्य फ़ाइल का नाम'
    , 'docu-main-disp-file': 'दस्तावेज़: प्रकाशित फ़ाइल का नाम'
    , 'backend-docu-opened-in': "दस्तावेज़ फ़ोल्डर सफलतापूर्वक $1 में खोला गया"

    // Archive
    , 'backend-archiv-move-and-num': "संग्रह में ले जाया गया और पुनः क्रमांकित $1"
    , 'backend-archiv-saved': "संस्करण संग्रह में सहेजा गया।"

    // Tools
    , 'tools-confirm-scheduling-alert': "अलर्ट सफलतापूर्वक शेड्यूल किया गया।"

    // Reminder / Rappels
    , 'remind-started': "शुरू हुआ"
    , 'remind-remove': "हटाएँ"
    , 'scheduling-alert': "अलर्ट शेड्यूल करना"
    , 'schedule-a-alert': "एक अलर्ट शेड्यूल करें"
    , 'hour-and-day-of-alert': "अलर्ट का समय (और यदि बाद का दिन हो तो तारीख भी)"
    , 'alert-message': "अलर्ट संदेश"

    // -- Todoist --
    , 'todoist-content'     : "सामग्री"
    , 'todoist-description' : "विवरण"
    , 'todoist-due'         : "शुरुआत"
    , 'todoist-deadline'    : "समय-सीमा"
    , 'todoist-duration'    : "अवधि"
    , 'todoist-priority'    : "प्राथमिकता"
    , 'todoist-labels'      : "लेबल"
    , 'todoist-repeat'      : "दोहराव"
    , 'task-due-to-start'   : "बाधा के लिए क्षमा करें, लेकिन कार्य “$1” शुरू होना चाहिए।"

    , 'New task...': "नया कार्य…"
    , 'New task': "नया कार्य"
    , 'todoist-message-new-task': "नीचे इस नए कार्य के सामान्य पैरामीटर सेट करें। आप किसी भी अनावश्यक पैरामीटर को हटा सकते हैं और सरल मार्कर (today, tomorrow, 4d, आदि) का उपयोग कर सकते हैं"
    , 'todoist-message-mod-task': "नीचे कार्य के पैरामीटर को फिर से परिभाषित करें।"
    , 'todoist-default-fields-task': "सामग्री: $1\\\nविवरण: $2\\\n\\\nशुरुआत: $3\\\nदोहराव: $4\\\nअवधि: $5\\\nप्राथमिकता: $6\\\nसमय-सीमा: $7\\\nलेबल: $8"
    , 'todoist-default-due-task': "DD/MM/YYYY h:mm पर"
    , 'todoist-text-new-task': "✔ नया कार्य: $1"
    , 'todoist-text-mod-task': "✔ कार्य संशोधित: $1"
    , 'todoist-project-title': "Todoist में प्रोजेक्ट शीर्षक"
    , 'todoist-tasks': "Todoist कार्य" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "कृपया नीचे Todoist एप्लिकेशन में प्रोजेक्ट $1 का शीर्षक बताएँ।"
    , 'todoist-message-today-project-task': "प्रोजेक्ट “$1” के आज के कार्यों की सूची।"
    , 'confirm-tasks-checks': "कार्यों की पुष्टि"
    , 'ask-for-confirm-tasks-checks': "कृपया प्रोजेक्ट “$1” के कार्यों पर की जाने वाली कार्रवाइयों की पुष्टि करें।$2"
    , 'mark-task-checked': "कार्य “$1” को पूर्ण के रूप में चिह्नित किया जाना चाहिए।"
    , 'todoist-fin-tasks-done-and-create': "प्रोजेक्ट “$1” के कार्य अपडेट किए गए (पूर्ण: $2, नए: $3)।"
    , 'todoist-tasks-created-message': "प्रोजेक्ट “$1” के नए कार्य बनाए गए ($2)।"
    , 'todoist-new-task-title-errors': "अमान्य कार्य"
    , 'todoist-new-task-msg-correct-errors': "कृपया नीचे दी गई त्रुटियों को सुधारें:"
    , 'todoist-no-task-done': "पूर्ण चिह्नित करने के लिए कोई कार्य नहीं।"
    , 'todoist-no-new-task': "कोई नया कार्य नहीं।"
    , 'todoist-modify-checked': "✔ संशोधित करें…"
    , 'todoist-errors-update-tasks': "कार्यों को अपडेट करने में त्रुटियाँ"
    , 'todoist-message-actualisation': "कार्य अपडेट: नए: $1, पूर्ण: $2, संशोधित: $3"
    // -- test --
    , 'test-raw':   '$1 को बदलता है'
    , 'test-array': '$1 और $2 को बदलता है'
    , 'test-objet': '$ceci और ${cela} को बदलता है'

    // --- Finder ---
    , 'window-opened': "विंडो सफलतापूर्वक खोली गई।"
    , 'folder-opened': "फ़ोल्डर सफलतापूर्वक खोला गया।"

    // --- Git ---
    , 'git-init-success': "Git सफलतापूर्वक इंस्टॉल हुआ।"
    , 'Which-labels': "लेबल?"
    , 'which-labels-to-create': "बनाने के लिए लेबल (कोई न चुनें तो उन्हें नहीं बदला जाएगा)।"

    // --- Console ---
    , 'iterm-opened-at-folder': "iTerm उस फ़ोल्डर में खोला गया।"
    , 'terminal-opened-at-folder': "टर्मिनल उस फ़ोल्डर में खोला गया।"

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - API कुंजी"
    , 'which-todoist-api-key': "कृपया अपनी Todoist API कुंजी (टोकन) दर्ज करें"

    // --- Documentation ---
    , 'docu-opened-in-browser': "दस्तावेज़ खोला गया।"

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "बजे"
    , 'regexp:relative-days': "परसों|कल|आज"
    , 'regexp:date-unit': "महीना|माह|सप्ताह|हफ्ता|दिन|घंटा|मिनट"
    , 'regexp:duration-in': "([0-9]+) ?(महीना|माह|सप्ताह|हफ्ता|दिन|घंटा|मिनट) ?में"
    , 'regexp:every-prefix': "हर "
    , 'regexp:day-word': "दिन"
    , 'regexp:weekdays': "सोमवार|मंगलवार|बुधवार|गुरुवार|शुक्रवार|शनिवार|रविवार"
    , 'regexp:of-month': "महीने की"
    , 'regexp:unit-month': "महीना|माह"
    , 'regexp:unit-week': "सप्ताह|हफ्ता"
    , 'regexp:unit-day': "दिन"
    , 'regexp:unit-hour': "घंटा"
    , 'regexp:unit-minute': "मिनट"
    , 'regexp:day-before-yesterday': "परसों"
    , 'regexp:yesterday': "कल"
    , 'regexp:today': "आज"
    , 'regexp:tomorrow': "कल"
    , 'regexp:day-after-tomorrow': "परसों"
    , 'View': "देखें"
    , 'app-launching': "एप्लिकेशन आरंभ हो रहा है…"
    , 'init-projects-services-and-reminders': "प्रोजेक्ट, सेवाएँ और रिमाइंडर आरंभ हो रहे हैं…"
    , 'app-backup-running': "सुरक्षा बैकअप हो रहा है…"
    , 'app-ready': "एप्लिकेशन तैयार है।"
    , 'app-backup-discrepancy-title': "बड़ा डेटा अंतर"
    , 'app-backup-discrepancy-intro': "बड़ा डेटा अंतर:"
    , 'app-backup-projects-diff': "पहले $1 प्रोजेक्ट$3, अब $2"
    , 'app-backup-services-diff': "पहले $1 सेवा$3, अब $2"
    , 'app-backup-confirm-btn': "मैं पुष्टि करता हूँ"
    , 'app-backup-restore-btn': "पिछले बैकअप पर लौटें"
    , 'github-pr-cycle-confirming-init': "आरंभीकरण की पुष्टि।"
    , 'github-pr-cycle-confirm-init': "क्या आप वाकई इस Github PR साइकिल को आरंभ करना चाहते हैं?\n\nmain से एक नई डेवलपमेंट ब्रांच बनाई जाएगी।"
    , 'github-pr-cycle-init': "Github PR साइकिल – आरंभ करें"
    , 'github-pr-cycle-commit': "Github PR साइकिल – कमिट करें"
    , 'github-pr-cycle-submit': "Github PR साइकिल – सबमिट करें"
    , 'github-pr-cycle-confirming-submit': "सबमिशन की पुष्टि।"
    , 'github-pr-cycle-confirm-submit': "क्या आप वाकई कमिट की गई फ़ाइलों को सबमिट करके एक Github Pull Request बनाने की पुष्टि करना चाहते हैं?\n\nसंभावना है कि यह PR एक टेस्ट रन (Github Action) और शायद साइट या एप्लिकेशन अपडेट को ट्रिगर करेगा। कृपया जानकारी के साथ पुष्टि करें।"
    , 'github-pr-cycle-submission-ok': "Pull Request सफलतापूर्वक सबमिट हो गया!"
    , 'github-pr-cycle-branch-name': "बनाई जाने वाली डेवलपमेंट ब्रांच का नाम"
    , 'github-pr-cycle-commit-title': "इस कमिट का शीर्षक"
    , 'github-pr-cycle-commit-body': "इस कमिट का मुख्य पाठ (खाली छोड़ा जा सकता है)"
    , 'github-pr-cycle-inited': "$1 के लिए Github PR साइकिल आरंभ की गई।"
    , 'git-pr-cycle-branche': "Github PR साइकिल की ब्रांच का नाम।"
    , 'git-title-conflict-errors-section': "<div class=title>टकराव की समस्याएँ</div>"
    , 'git-title-syntax-errors-section': "<div class=title>सिंटैक्स समस्याएँ मिलीं</div>"
    , 'github-repo-visibility': "नए रिपॉज़िटरी की दृश्यता"
    , 'github-repo-visibility-q': "यह Github रिपॉज़िटरी अभी मौजूद नहीं है: इसे बनाया जाएगा। आप इसे कौन-सी दृश्यता देना चाहेंगे?"
    , 'Private': "निजी"
    , 'Public': "सार्वजनिक"
    , 'github-repo-checking': "Github रिपॉज़िटरी की जाँच हो रही है…"
    , 'github-repo-description': "रिपॉज़िटरी का विवरण"
    , 'github-repo-description-q': "इस Github रिपॉज़िटरी के लिए कौन-सा विवरण?"
    , 'select-docu-folder-and-ok': 'फ़ोल्डर बनाएँ और उसे Finder में चुनें, फिर "OK" पर क्लिक करें।'
    , 'eval-code-btn': 'कोड का मूल्यांकन करें…'
    , 'eval-code-title': 'कोड का मूल्यांकन'
    , 'eval-code-run-btn': 'इंटरप्रेट करें…'
    , 'eval-code-finish-btn': 'समाप्त करें'
    , 'eval-code-running': '…'
    , 'eval-code-make-script-btn': 'इसे स्क्रिप्ट बनाएँ'
    , 'eval-code-choose-script-folder': 'वह फ़ोल्डर चुनें जहाँ स्क्रिप्ट रखनी है, फिर "OK" पर क्लिक करें।'
    , 'eval-code-script-name-title': 'स्क्रिप्ट का नाम'
    , 'eval-code-script-name-q': 'स्क्रिप्ट के लिए कौन-सा नाम?'
    , 'eval-code-run-now-title': 'स्क्रिप्ट चलाएँ'
    , 'eval-code-run-now-q': 'क्या अभी स्क्रिप्ट चलाई जाए?'
    , 'eval-code-add-service-title': 'प्रोजेक्ट सेवा'
    , 'eval-code-add-service-q': "क्या इस स्क्रिप्ट को प्रोजेक्ट $1 की सेवा बनाया जाए?"
    , 'eval-code-service-name-title': 'बटन का नाम'
    , 'eval-code-service-name-q': 'इस सेवा बटन के लिए कौन-सा नाम?'
    , 'git-commit-all-done': "सभी फ़ाइलें Github पर भेज दी गई हैं।"
    , 'create-a-file': "फ़ाइल बनाएँ"
    , 'ask-path-to-file-in-folder': 'फ़ाइल का पथ:\n\n(प्रोजेक्ट फ़ोल्डर के सापेक्ष; सभी नए फ़ोल्डर बना दिए जाएँगे)'
    , 'ask-file-content': "फ़ाइल की सामग्री:"
    , 'reload-project-data-title': "प्रोजेक्ट का स्थायी डेटा फिर से लोड करें"
    , 'edit-projet-reload-hint': "संशोधित डेटा फिर से लोड करने के लिए, टूल $1 पर क्लिक करें"
    , 'project-data-reloaded': '"$1" का डेटा फिर से लोड किया गया।'
    , 'search-documentation': "खोजें…"
    , 'search-type-q': "खोज का प्रकार:"
    , 'search-type-any': "कोई भी टेक्स्ट"
    , 'search-type-target': "लक्ष्य: [[...]]"
    , 'search-type-link': "लिंक: <<...>>"
    , 'search-text-q': "खोजने के लिए टेक्स्ट (रेगुलर एक्सप्रेशन भी मान्य):"
    , 'search-results-title': "खोज परिणाम"
    , 'search-results-query': "खोज: $1"
    , 'search-results-empty': "कोई परिणाम नहीं।"
    , 'search-results-close-btn': "बंद करें"
    , 'backend-search-done': "$1 परिणाम मिले।"
    , 'search-project': "प्रोजेक्ट में खोजें…"
    , 'excluded-folders-q': "खोज से बाहर रखे जाने वाले फ़ोल्डर (अल्पविराम से अलग करें):"
    , 'choose-folder-btn': "फ़ोल्डर…"
    , 'extensions-q': "खोजी जाने वाली फ़ाइल एक्सटेंशन (कोई चयनित नहीं = सभी):"
    , 'search-results-count-one': " ($1 बार मिला)"
    , 'search-results-count-many': " ($1 बार मिले)"
    , 'gh-issue-created': "इश्यू #$1 सफलतापूर्वक सहेजा गया।"
}
