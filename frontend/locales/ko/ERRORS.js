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
    , 'hour-not-valid': "유효하지 않은 시간: '$1'"
    , 'repeat-not-valid': "'$1'의 반복 설정이 유효하지 않습니다"
    , 'error-duration': "기간 « $1 »은(는) '<숫자> <단위>' 형식이어야 합니다. 단위는 '개월', '주', '일', '시간', '분' 및 그 약어일 수 있습니다 (예: '12 h')."
    , 'prop-cant-be-empty': "속성 « $1 »은(는) 비워둘 수 없습니다."
    , 'must-be-num-between': "« $1 »은(는) $2와(과) $3 사이의 숫자여야 합니다"
    , 'invalid-phone-number': "전화번호 $1은(는) 유효하지 않습니다."

    , 'select-project-to-what': "$1할 프로젝트를 선택해야 합니다."

    // --- Application ---
    , 'unknown-app-data': "알 수 없는 애플리케이션 데이터: '$1'"

    // --- Projets ---
    , 'project-folder-not-selected': 'Finder에서 프로젝트 폴더를 선택해야 합니다.'
    , 'folder-required': '폴더를 반드시 선택해야 합니다.'
    , 'no-current-projet': "현재 프로젝트가 없습니다."
    , '--untitled-project--': '-제목 없는 프로젝트-'

    // Services
    , 'serv-error-on-return': "서비스 응답 중 오류 발생"
    , 'service-requires-a-name': "서비스는 :name을(를) 가져야 합니다. ($1)"

    // Scripts services
    , 'scserv-abort': "서비스가 취소되었습니다"
    , 'Script-service-definition-error': '스크립트 서비스 정의 오류'
    , 'Script-service-file-contains-errors': '스크립트 서비스 정의 파일에 오류가 있습니다.'
    , 'scserv-unknown-step': "식별자 '$1'인 단계는 알 수 없습니다."
    , 'scserv-list-required': "YAML 파일은 단계 목록을 정의해야 합니다 ($1)."
    , 'scserv-type-required': "스크립트 서비스 단계 ($1)는 항상 유형을 가져야 합니다 ($2)."
    , 'scserv-id-required': "스크립트 서비스 단계는 반드시 식별자를 가져야 합니다 ($1) ($2)."
    , 'scserv-id-invalid': "단계 $1의 식별자가 유효하지 않습니다 ($2)."
    , 'scserv-step-type-unknowned': "알 수 없는 단계 유형: $1 ($2)."
    , 'scserv-param-required': "매개변수 '$1'은(는) 유형 '$2'에서 필수입니다 ($3)."
    , 'scserv-unknown-param': "매개변수 '$1'은(는) 유형 '$2'의 서비스에서 알 수 없습니다 ($3)."
    , 'scserv-param-bad-type': "매개변수 '$1'의 유형이 올바르지 않습니다. 예상: $2, 실제: $3 ($4)."
    , 'scserv-on-get-file-values': "파일 '$1'의 데이터를 읽으려는 중 오류가 발생했습니다: $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "데이터가 테이블인 단계 $1의 select는 메뉴 값을 정의하는 key_value 매개변수가 필요합니다 ($2)"
    , 'scserv-select-with-object-requires-title-values': "데이터가 테이블인 단계 $1의 select는 메뉴 제목을 정의하는 key_title 매개변수가 필요합니다 ($2)"
    , 'scserv-select-with-object-unknown-key': "단계 $1의 select에 대해, 객체 $2는 값에 대한 키 '$3'을(를) 정의하지 않습니다 ($4)."
    , 'scserv-select-with-object-unknown-title': "단계 $1의 select에 대해, 객체 $2는 제목에 대한 키 '$3'을(를) 정의하지 않습니다 ($4)."
    , 'scserv-unknown-evaluator': "단계 '$1'의 평가기는 알 수 없습니다: $2 ($3)."
    , 'scserv-unknown-marker-translate': "단계 '$2'의 번역 마커 '$1'은(는) 알 수 없습니다. 가능한 마커: $3 ($4)."

    // Documentation
    , 'docu-error-on-update': "업데이트 중 오류 발생"

    // TODOIST
    , 'todoist-key-task-unknown': "Todoist 작업에서 키 « $1 »은(는) 알 수 없습니다."
    , 'no-tasks-checked': "선택된 작업이 없습니다"
    , 'checked-only-modify-task': "수정할 작업만 선택되어야 합니다."

}
