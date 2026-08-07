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
    , 'repeat-not-valid': "'$1' में दोहराव मान्य नहीं है"
    , 'error-duration': "अवधि « $1 » का रूप '<संख्या> <इकाई>' होना चाहिए, जहाँ इकाई 'महीना', 'सप्ताह', 'दिन', 'घंटा', 'मिनट' या उनके संक्षिप्त रूप हो सकते हैं (उदाहरण: '12 h')।"
    , 'prop-cant-be-empty': "गुण « $1 » खाली नहीं हो सकता।"
    , 'must-be-num-between': "« $1 » को $2 और $3 के बीच की संख्या होनी चाहिए"
    , 'invalid-phone-number': "फ़ोन नंबर $1 अमान्य है।"

    , 'select-project-to-what': "$1 के लिए प्रोजेक्ट चुनना आवश्यक है।"

    // --- Application ---
    , 'unknown-app-data': "अज्ञात एप्लिकेशन डेटा: '$1'"

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

    // Documentation
    , 'docu-error-on-update': "अपडेट के दौरान त्रुटि"

    // TODOIST
    , 'todoist-key-task-unknown': "Todoist कार्य के लिए, कुंजी « $1 » अज्ञात है।"
    , 'no-tasks-checked': "कोई कार्य चयनित नहीं"
    , 'checked-only-modify-task': "केवल संशोधित किए जाने वाले कार्य को ही चुना जाना चाहिए।"

}
