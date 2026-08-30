/**
 *
 * Définition des erreurs
 *
 * Usage
 *
 *  getErr(errId, params)
 */
const ERRORS = {
    'premier': 'pour-virgule'
    // --- Données générales ---
    , 'hour-not-valid': "अमान्य समय: '$1'"
    , 'error-date': "तारीख़ '$1' अमान्य है। मान्य प्रारूप: दिन/माह/वर्ष, 'कल', या 'X घंटे/दिन/सप्ताह/महीने में'।"
    , 'deadline-before-start': "अंतिम तिथि '$1' आरंभ तिथि '$2' के बाद होनी चाहिए।"
    , 'repeat-not-valid': "'$1' में दोहराव मान्य नहीं है"
    , 'error-duration': "अवधि « $1 » का रूप '<संख्या> <इकाई>' होना चाहिए, जहाँ इकाई 'महीना', 'सप्ताह', 'दिन', 'घंटा', 'मिनट' या उनके संक्षिप्त रूप हो सकते हैं (उदाहरण: '12 h')।"
    , 'prop-cant-be-empty': "गुण « $1 » खाली नहीं हो सकता।"
    , 'must-be-num-between': "« $1 » को $2 और $3 के बीच की संख्या होनी चाहिए"
    , 'invalid-phone-number': "फ़ोन नंबर $1 अमान्य है।"

    , 'select-project-to-what': "$1 के लिए प्रोजेक्ट चुनना आवश्यक है।"

    // --- Application ---
    , 'unknown-app-data': "अज्ञात एप्लिकेशन डेटा: '$1'"
    , 'app-sorry-fatal-error': "एक गंभीर त्रुटि हुई है, कृपया क्षमा करें।"
    , 'backend-app-project-unfound': "प्रोजेक्ट $1 संग्रह में नहीं मिला।"
    , 'backend-unknown-action': "अज्ञात क्रिया: '$1'।"
    , 'backend-access-unabled': "Board के लिए एक्सेसिबिलिटी अनुमति सक्रिय नहीं है: सिस्टम सेटिंग्स → गोपनीयता और सुरक्षा → एक्सेसिबिलिटी → Board चुनें।"
    , 'backend-command-not-found': "bash कमांड '$1' अज्ञात है।"

    // --- Projets ---
    , 'project-folder-not-selected': 'प्रोजेक्ट फ़ोल्डर Finder में चुना जाना चाहिए।'
    , 'folder-required': 'एक फ़ोल्डर चुनना अनिवार्य है।'
    , 'no-current-projet': "कोई वर्तमान प्रोजेक्ट नहीं।"
    , '--untitled-project--': '-बिना शीर्षक वाला प्रोजेक्ट-'

    // Services
    , 'serv-error-on-return': "सेवा की प्रतिक्रिया में त्रुटि"
    , 'service-requires-a-name': "एक सेवा में :name होना चाहिए। ($1)"

    // Scripts services
    , 'backend-open-file-failed': "फ़ाइल '$1' को एप्लिकेशन '$2' के साथ नहीं खोला जा सका।"
    , 'scserv-abort': "सेवा रद्द की गई"
    , 'Script-service-definition-error': 'स्क्रिप्ट-सेवा परिभाषा त्रुटि'
    , 'Script-service-file-contains-errors': 'स्क्रिप्ट-सेवा परिभाषा फ़ाइल में त्रुटियाँ हैं।'
    , 'scserv-unknown-step': "पहचानकर्ता '$1' वाला चरण अज्ञात है।"
    , 'scserv-list-required': "YAML फ़ाइल में चरणों की सूची परिभाषित होनी चाहिए ($1)।"
    , 'scserv-type-required': "स्क्रिप्ट-सेवा चरण ($1) में हमेशा एक प्रकार होना चाहिए ($2)।"
    , 'scserv-id-required': "स्क्रिप्ट-सेवा चरण में अनिवार्य रूप से एक पहचानकर्ता होना चाहिए ($1) ($2)।"
    , 'scserv-id-invalid': "चरण $1 का पहचानकर्ता मान्य नहीं है ($2)।"
    , 'scserv-step-type-unknowned': "चरण '$1': अज्ञात चरण प्रकार: $2 ($3)।"
    , 'scserv-param-required': "चरण '$1': पैरामीटर '$2' आवश्यक है, प्रकार '$3' के लिए ($4)।"
    , 'scserv-unknown-param': "चरण '$1': पैरामीटर '$2' प्रकार '$3' की सेवा के लिए अज्ञात है ($4)।"
    , 'scserv-param-bad-type': "पैरामीटर '$1' का प्रकार सही नहीं है। अपेक्षित: $2, वास्तविक: $3 ($4)।"
    , 'scserv-on-get-file-values': "फ़ाइल '$1' का डेटा पढ़ने की कोशिश करते समय एक त्रुटि हुई: $2 ($3)।"
    , 'scserv-select-with-object-requires-key-values': "चरण $1 के select, जिसका डेटा तालिकाएँ हैं, को मेनू मान परिभाषित करने वाले key_value पैरामीटर की आवश्यकता है ($2)"
    , 'scserv-select-with-object-requires-title-values': "चरण $1 के select, जिसका डेटा तालिकाएँ हैं, को मेनू शीर्षक परिभाषित करने वाले key_title पैरामीटर की आवश्यकता है ($2)"
    , 'scserv-select-with-object-unknown-key': "चरण $1 के select के लिए, ऑब्जेक्ट $2 मान हेतु कुंजी '$3' परिभाषित नहीं करता ($4)।"
    , 'scserv-select-with-object-unknown-title': "चरण $1 के select के लिए, ऑब्जेक्ट $2 शीर्षक हेतु कुंजी '$3' परिभाषित नहीं करता ($4)।"
    , 'scserv-unknown-evaluator': "चरण '$1' का इवैल्यूएटर अज्ञात है: $2 ($3)।"
    , 'scserv-unknown-marker-translate': "चरण '$2' का अनुवाद मार्कर '$1' अज्ञात है। संभावित मार्कर: $3 ($4)।"

    // File
    , 'backend-unfound-file': "फ़ाइल नहीं मिली: $1"
    , 'backend-invalid-yaml': "अमान्य YAML कोड ($1): $2"
    , 'backend-unfound-folder-unable-file': "फ़ोल्डर '$1' नहीं मिला। फ़ाइल '$2' को सुरक्षित रूप से नहीं बनाया जा सकता।"
    , 'backend-unable-to-create-file': "फ़ाइल $1 नहीं बनाई जा सकी।"
    , 'backend-no-xml-file': "अभी तक कोई XML फ़ाइल पठन नहीं।"
    , 'backend-version-no-num': "फ़ाइल $1 में कोई संस्करण संख्या नहीं है, इसे संस्करणित नहीं किया जा सकता।"

    // Git
    , 'backend-unabled-labels': "मौजूदा लेबल प्राप्त नहीं किए जा सके: $1"
    , 'backend-already-git': "इस प्रोजेक्ट के लिए Git पहले से ही आरंभ किया जा चुका है।"
    , 'backend-unabled-to-destroy-labels': "मौजूदा लेबल हटाए नहीं जा सके: $1"
    , 'backend-unable-to-create-labels': "नए लेबल नहीं बनाए जा सके: $1"
    , 'backend-remote-test-required': "परीक्षण के लिए git remote आवश्यक है"
    , 'backend-not-a-git-folder': "यह फ़ोल्डर git रिपॉज़िटरी नहीं है ($1)।"
    , 'backend-not-a-git-repo': "फ़ोल्डर $1 एक Git रिपॉज़िटरी नहीं है।"
    , 'backend-git-unknown-ope': "अज्ञात Git ऑपरेशन: $1"

    // Script
    , 'backend-script-unfound': "चलाने के लिए स्क्रिप्ट नहीं मिली ($1)"

    // Documentation
    , 'docu-error-on-update': "अपडेट के दौरान त्रुटि"
    , 'backend-docu-unfound-folder': "दस्तावेज़ फ़ोल्डर '$1' नहीं मिला।"

    // TODOIST
    , 'todoist-key-task-unknown': "Todoist कार्य के लिए, कुंजी « $1 » अज्ञात है।"
    , 'no-tasks-checked': "कोई कार्य चयनित नहीं"
    , 'checked-only-modify-task': "केवल संशोधित किए जाने वाले कार्य को ही चुना जाना चाहिए।"
    , 'backend-todoist-unfound-project': "Todoist में प्रोजेक्ट « $1 » नहीं मिला।"
    , 'backend-task-error': "कार्य $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "अज्ञात समस्या के कारण संस्करण संग्रहीत नहीं हुआ।"
    , 'backend-archiv-unfound-folder': "संग्रह फ़ोल्डर नहीं मिला: $1।"

    // Date
    , 'invalid-date': "अमान्य तिथि: '$1': $2"

    // UI
    , 'no-open-window-in': "एप्लिकेशन $1 में कोई विंडो खुली नहीं है।"
    , 'app-unfound-or-close': "एप्लिकेशन $1 नहीं मिला या बंद है।"

    // Finder
    , 'no-selection': "कोई चयन नहीं"
    , 'not-a-folder': "चयन एक फ़ोल्डर होना चाहिए"
    , 'backend-app-backup-failed': "दैनिक बैकअप विफल रहा।"
    , 'backend-app-backup-no-previous': "कोई पिछला बैकअप उपलब्ध नहीं है।"
    , 'backend-app-backup-restore-failed': "पिछले बैकअप को पुनर्स्थापित करना विफल रहा।"
    , 'unknown-syntax-file-extension': "जाँच तालिका में सूचीबद्ध नहीं एक्सटेंशन: $1।"
    , 'invalid-value': "अमान्य मान: $1।"
    , 'git-commit-title-erros': "कमिट के दौरान त्रुटियाँ हुईं"
    , 'git-status-not-clean': "Git की स्थिति साफ़ नहीं है।"
    , 'git-status-not-empty': "अभी भी फ़ाइलें/फ़ोल्डर कमिट करने बाकी हैं।"
    , 'git-branch-not-main': "आपको main ब्रांच पर होना चाहिए।"
    , 'git-status-added-both-sides': "दोनों ओर जोड़ा गया (अलग-अलग सामग्री)।"
    , 'git-status-deleted-both-sides': "दोनों ओर से हटाया गया।"
    , 'git-status-modified-both-sides': "दोनों ओर संशोधित।"
    , 'git-status-add-and-absent': "हमारे द्वारा जोड़ा गया, दूसरी ओर अनुपस्थित।"
    , 'git-status-absent-and-add': "दूसरी ओर जोड़ा गया, हमारे यहाँ अनुपस्थित।"
    , 'git-status-deleted-and-modified': "हमारे द्वारा हटाया गया, दूसरी ओर संशोधित।"
    , 'git-status-modified-and-deleted': "हमारे द्वारा संशोधित, दूसरी ओर हटाया गया।"
    , 'git-bad-branch': "आप गलत Git ब्रांच पर हैं। अपेक्षित: $1।"
    , 'git-commit-error': "फ़ाइलें कमिट करते समय Git त्रुटि: $1।"
    , 'git-push-error': "कमिट पुश करते समय Git त्रुटि: $1"
    , 'git-pr-create-error': "Github pull request बनाते समय GH त्रुटि: $1।"
    , 'git-pr-waiting-checks-error': "चेक की प्रतीक्षा के दौरान GH त्रुटि: $1।"
    , 'git-pr-waiting-checks-failure': "चेक के दौरान GH त्रुटि: एक परीक्षण विफल रहा।"
    , 'git-unable-checkout-main': "Git त्रुटि: मुख्य ब्रांच पर वापस नहीं जा सका ($1)।"
    , 'git-unable-pr-merge': "Git त्रुटि: Pull Request मर्ज नहीं हो सका ($1)।"
    , 'git-commit-init-required': "Github PR साइकिल में अपनी फ़ाइलें कमिट करने के लिए, आपको पहले इस साइकिल को आरंभ करना होगा (मुख्यतः: एक डेवलपमेंट ब्रांच चुनें)।\n\nयदि यह ब्रांच बिना आरंभीकरण के पहले से परिभाषित है, तो आप इसे प्रोजेक्ट डेटा में `git_pr_cycle_branche` प्रॉपर्टी में सेट कर सकते हैं।"
    , 'github-pr-cycle-require-clean-status-to-submit': "Github PR सबमिट करने के लिए स्थिति साफ़ होनी चाहिए (कोई फ़ाइल कमिट होने के लिए शेष नहीं होनी चाहिए)।\n\nऐसा करने के लिए पिछली सेवा का उपयोग करें।"
    , 'git-unable-destroy-branch': "Git ब्रांच हटाई नहीं जा सकी: $1।"
    , 'github-pr-cycle-branch-should-have-been-deleted': "डेवलपमेंट ब्रांच $1 हटाई नहीं जा सकी: $2"
    , 'git-init-no-push-permission': "आपके पास Github रिपॉज़िटरी $1 पर लिखने (push) की अनुमति नहीं है।"
    , 'git-init-repo-exists-not-empty': "Github रिपॉज़िटरी $1 पहले से मौजूद है और खाली नहीं है।\n\nक्या आप सुनिश्चित हैं कि यह सही रिपॉज़िटरी है? इस आरंभीकरण के साथ उपयोग करने से पहले इसे खाली करना होगा।"
    , 'backend-github-api-error': "Github API से पूछताछ करते समय त्रुटि: $1।"
    , 'backend-github-repo-create-error': "Github रिपॉज़िटरी बनाते समय त्रुटि: $1।"
    , 'project-data-invalid-bad-count': "सेवा $2 के लिए प्रोजेक्ट $1 का डेटा अमान्य है। $3 डेटा अपेक्षित, $4 डेटा प्रदान किया गया।"
    , 'file-already-exists-at': "इस स्थान पर पहले से ही एक फ़ाइल मौजूद है: $1"
    , 'unknown-shebang': "$1 सीधे स्क्रिप्ट के रूप में चलाई जा सकने वाली भाषा नहीं है।"
    , 'unrunnable-file': "फ़ाइल $1 न तो चलाने योग्य है, न ही किसी ज्ञात भाषा में है।"
    , 'backend-icloud-dataless-files': "iCloud सिंक की समस्या। ⚠️ से चिह्नित फ़ाइलों के लिए, Terminal से फ़ोल्डर तक पहुँचें।"
    , 'backend-search-invalid-regex': "अमान्य रेगुलर एक्सप्रेशन: $1 ($2)"
    , 'backend-search-project-unfound-folder': "प्रोजेक्ट फ़ोल्डर '$1' नहीं मिला।"
    , 'excluded-folder-outside-project': "यह फ़ोल्डर प्रोजेक्ट का उप-फ़ोल्डर नहीं है — चयन को नज़रअंदाज़ किया गया।"
}
