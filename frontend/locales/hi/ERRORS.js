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
    , 'scserv-abort': "सेवा रद्द की गई"
    , 'Script-service-definition-error': 'स्क्रिप्ट-सेवा परिभाषा त्रुटि'
    , 'Script-service-file-contains-errors': 'स्क्रिप्ट-सेवा परिभाषा फ़ाइल में त्रुटियाँ हैं।'
    , 'scserv-unknown-step': "पहचानकर्ता '$1' वाला चरण अज्ञात है।"
    , 'scserv-list-required': "YAML फ़ाइल में चरणों की सूची परिभाषित होनी चाहिए ($1)।"
    , 'scserv-type-required': "स्क्रिप्ट-सेवा चरण ($1) में हमेशा एक प्रकार होना चाहिए ($2)।"
    , 'scserv-id-required': "स्क्रिप्ट-सेवा चरण में अनिवार्य रूप से एक पहचानकर्ता होना चाहिए ($1) ($2)।"
    , 'scserv-id-invalid': "चरण $1 का पहचानकर्ता मान्य नहीं है ($2)।"
    , 'scserv-step-type-unknowned': "अज्ञात चरण प्रकार: $1 ($2)।"
    , 'scserv-param-required': "पैरामीटर '$1' आवश्यक है, प्रकार '$2' के लिए ($3)।"
    , 'scserv-unknown-param': "पैरामीटर '$1' प्रकार '$2' की सेवा के लिए अज्ञात है ($3)।"
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
}
