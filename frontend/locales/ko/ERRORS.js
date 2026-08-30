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
    , 'error-date': "날짜 '$1'이(가) 유효하지 않습니다. 유효한 형식: 일/월/년, '내일', '모레', 또는 'X시간/일/주/개월 후'."
    , 'deadline-before-start': "마감일 '$1'은(는) 시작일 '$2'보다 이후여야 합니다."
    , 'repeat-not-valid': "'$1'의 반복 설정이 유효하지 않습니다"
    , 'error-duration': "기간 « $1 »은(는) '<숫자> <단위>' 형식이어야 합니다. 단위는 '개월', '주', '일', '시간', '분' 및 그 약어일 수 있습니다 (예: '12 h')."
    , 'prop-cant-be-empty': "속성 « $1 »은(는) 비워둘 수 없습니다."
    , 'must-be-num-between': "« $1 »은(는) $2와(과) $3 사이의 숫자여야 합니다"
    , 'invalid-phone-number': "전화번호 $1은(는) 유효하지 않습니다."

    , 'select-project-to-what': "$1할 프로젝트를 선택해야 합니다."

    // --- Application ---
    , 'unknown-app-data': "알 수 없는 애플리케이션 데이터: '$1'"
    , 'app-sorry-fatal-error': "심각한 오류가 발생했습니다. 양해 부탁드립니다."
    , 'backend-app-project-unfound': "보관함에서 프로젝트 $1을(를) 찾을 수 없습니다."
    , 'backend-unknown-action': "알 수 없는 작업: '$1'."
    , 'backend-access-unabled': "Board에 손쉬운 사용 권한이 활성화되어 있지 않습니다: 시스템 설정 → 개인정보 보호 및 보안 → 손쉬운 사용 → Board 선택."
    , 'backend-command-not-found': "알 수 없는 bash 명령어 '$1'."

    // --- Projets ---
    , 'project-folder-not-selected': 'Finder에서 프로젝트 폴더를 선택해야 합니다.'
    , 'folder-required': '폴더를 반드시 선택해야 합니다.'
    , 'no-current-projet': "현재 프로젝트가 없습니다."
    , '--untitled-project--': '-제목 없는 프로젝트-'

    // Services
    , 'serv-error-on-return': "서비스 응답 중 오류 발생"
    , 'service-requires-a-name': "서비스는 :name을(를) 가져야 합니다. ($1)"

    // Scripts services
    , 'backend-open-file-failed': "'$2' 애플리케이션으로 파일 '$1'을(를) 열 수 없습니다."
    , 'scserv-abort': "서비스가 취소되었습니다"
    , 'Script-service-definition-error': '스크립트 서비스 정의 오류'
    , 'Script-service-file-contains-errors': '스크립트 서비스 정의 파일에 오류가 있습니다.'
    , 'scserv-unknown-step': "식별자 '$1'인 단계는 알 수 없습니다."
    , 'scserv-list-required': "YAML 파일은 단계 목록을 정의해야 합니다 ($1)."
    , 'scserv-type-required': "스크립트 서비스 단계 ($1)는 항상 유형을 가져야 합니다 ($2)."
    , 'scserv-id-required': "스크립트 서비스 단계는 반드시 식별자를 가져야 합니다 ($1) ($2)."
    , 'scserv-id-invalid': "단계 $1의 식별자가 유효하지 않습니다 ($2)."
    , 'scserv-step-type-unknowned': "단계 '$1': 알 수 없는 단계 유형: $2 ($3)."
    , 'scserv-param-required': "단계 '$1': 매개변수 '$2'은(는) 유형 '$3'에서 필수입니다 ($4)."
    , 'scserv-unknown-param': "단계 '$1': 매개변수 '$2'은(는) 유형 '$3'의 서비스에서 알 수 없습니다 ($4)."
    , 'scserv-param-bad-type': "매개변수 '$1'의 유형이 올바르지 않습니다. 예상: $2, 실제: $3 ($4)."
    , 'scserv-on-get-file-values': "파일 '$1'의 데이터를 읽으려는 중 오류가 발생했습니다: $2 ($3)."
    , 'scserv-select-with-object-requires-key-values': "데이터가 테이블인 단계 $1의 select는 메뉴 값을 정의하는 key_value 매개변수가 필요합니다 ($2)"
    , 'scserv-select-with-object-requires-title-values': "데이터가 테이블인 단계 $1의 select는 메뉴 제목을 정의하는 key_title 매개변수가 필요합니다 ($2)"
    , 'scserv-select-with-object-unknown-key': "단계 $1의 select에 대해, 객체 $2는 값에 대한 키 '$3'을(를) 정의하지 않습니다 ($4)."
    , 'scserv-select-with-object-unknown-title': "단계 $1의 select에 대해, 객체 $2는 제목에 대한 키 '$3'을(를) 정의하지 않습니다 ($4)."
    , 'scserv-unknown-evaluator': "단계 '$1'의 평가기는 알 수 없습니다: $2 ($3)."
    , 'scserv-unknown-marker-translate': "단계 '$2'의 번역 마커 '$1'은(는) 알 수 없습니다. 가능한 마커: $3 ($4)."

    // File
    , 'backend-unfound-file': "파일을 찾을 수 없습니다: $1"
    , 'backend-invalid-yaml': "잘못된 YAML 코드 ($1): $2"
    , 'backend-unfound-folder-unable-file': "폴더 '$1'을(를) 찾을 수 없습니다. 파일 '$2'을(를) 안전하게 생성할 수 없습니다."
    , 'backend-unable-to-create-file': "파일 $1을(를) 생성할 수 없습니다."
    , 'backend-no-xml-file': "아직 XML 파일을 읽지 않았습니다."
    , 'backend-version-no-num': "파일 $1에 버전 번호가 없어 버전을 지정할 수 없습니다."

    // Git
    , 'backend-unabled-labels': "기존 라벨을 가져올 수 없습니다: $1"
    , 'backend-already-git': "이 프로젝트는 이미 Git이 초기화되어 있습니다."
    , 'backend-unabled-to-destroy-labels': "기존 라벨을 삭제할 수 없습니다: $1"
    , 'backend-unable-to-create-labels': "새 라벨을 생성할 수 없습니다: $1"
    , 'backend-remote-test-required': "테스트용 git remote가 필요합니다"
    , 'backend-not-a-git-folder': "이 폴더는 git 저장소가 아닙니다 ($1)."
    , 'backend-not-a-git-repo': "폴더 $1은(는) Git 저장소가 아닙니다."
    , 'backend-git-unknown-ope': "알 수 없는 Git 작업: $1"

    // Script
    , 'backend-script-unfound': "실행할 스크립트를 찾을 수 없습니다 ($1)"

    // Documentation
    , 'docu-error-on-update': "업데이트 중 오류 발생"
    , 'backend-docu-unfound-folder': "문서 폴더 '$1'을(를) 찾을 수 없습니다."

    // TODOIST
    , 'todoist-key-task-unknown': "Todoist 작업에서 키 « $1 »은(는) 알 수 없습니다."
    , 'no-tasks-checked': "선택된 작업이 없습니다"
    , 'checked-only-modify-task': "수정할 작업만 선택되어야 합니다."
    , 'backend-todoist-unfound-project': "Todoist에서 프로젝트 « $1 »을(를) 찾을 수 없습니다."
    , 'backend-task-error': "작업 $1: $2"

    // Archives
    , 'backend-archiv-unknown-problem': "알 수 없는 문제로 버전이 보관되지 않았습니다."
    , 'backend-archiv-unfound-folder': "보관함 폴더를 찾을 수 없습니다: $1."

    // Date
    , 'invalid-date': "잘못된 날짜: '$1': $2"

    // UI
    , 'no-open-window-in': "$1 애플리케이션에 열린 창이 없습니다."
    , 'app-unfound-or-close': "$1 애플리케이션을 찾을 수 없거나 종료되었습니다."

    // Finder
    , 'no-selection': "선택 항목 없음"
    , 'not-a-folder': "선택한 항목은 폴더여야 합니다"
    , 'backend-app-backup-failed': "일일 백업이 실패했습니다."
    , 'backend-app-backup-no-previous': "이전 백업이 없습니다."
    , 'backend-app-backup-restore-failed': "이전 백업 복원에 실패했습니다."
    , 'unknown-syntax-file-extension': "검사 목록에 없는 확장자: $1."
    , 'invalid-value': "잘못된 값: $1."
    , 'git-commit-title-erros': "커밋 중 오류 발생"
    , 'git-status-not-clean': "Git 상태가 깨끗하지 않습니다."
    , 'git-status-not-empty': "아직 커밋해야 할 파일/폴더가 있습니다."
    , 'git-branch-not-main': "main 브랜치에 있어야 합니다."
    , 'git-status-added-both-sides': "양쪽에서 추가됨 (내용 다름)."
    , 'git-status-deleted-both-sides': "양쪽에서 삭제됨."
    , 'git-status-modified-both-sides': "양쪽에서 수정됨."
    , 'git-status-add-and-absent': "우리 쪽에서 추가됨, 상대 쪽에는 없음."
    , 'git-status-absent-and-add': "상대 쪽에서 추가됨, 우리 쪽에는 없음."
    , 'git-status-deleted-and-modified': "우리 쪽에서 삭제됨, 상대 쪽에서 수정됨."
    , 'git-status-modified-and-deleted': "우리 쪽에서 수정됨, 상대 쪽에서 삭제됨."
    , 'git-bad-branch': "잘못된 Git 브랜치에 있습니다. 예상 브랜치: $1."
    , 'git-commit-error': "파일 커밋 중 Git 오류: $1."
    , 'git-push-error': "커밋 푸시 중 Git 오류: $1"
    , 'git-pr-create-error': "Github pull request 생성 중 GH 오류: $1."
    , 'git-pr-waiting-checks-error': "체크 대기 중 GH 오류: $1."
    , 'git-pr-waiting-checks-failure': "체크 중 GH 오류: 테스트 실패."
    , 'git-unable-checkout-main': "Git 오류: 기본 브랜치로 돌아갈 수 없습니다 ($1)."
    , 'git-unable-pr-merge': "Git 오류: Pull Request를 병합할 수 없습니다 ($1)."
    , 'git-commit-init-required': "Github PR 사이클에서 파일을 커밋하려면 먼저 이 사이클을 시작해야 합니다 (주로: 개발 브랜치를 선택). \n\n이 브랜치가 초기화 없이 이미 정의되어 있다면, 프로젝트 데이터의 `git_pr_cycle_branche` 속성에 지정할 수 있습니다."
    , 'github-pr-cycle-require-clean-status-to-submit': "Github PR를 제출하려면 상태가 깨끗해야 합니다 (커밋할 파일이 남아 있으면 안 됩니다).\n\n이전 서비스를 사용해 처리하세요."
    , 'git-unable-destroy-branch': "Git 브랜치를 삭제할 수 없습니다: $1."
    , 'github-pr-cycle-branch-should-have-been-deleted': "개발 브랜치 $1을(를) 삭제할 수 없습니다: $2"
    , 'git-init-no-push-permission': "Github 저장소 $1에 대한 쓰기(push) 권한이 없습니다."
    , 'git-init-repo-exists-not-empty': "Github 저장소 $1이(가) 이미 존재하며 비어 있지 않습니다.\n\n올바른 저장소가 맞습니까? 이 초기화에 사용하려면 먼저 비워야 합니다."
    , 'backend-github-api-error': "Github API 조회 중 오류: $1."
    , 'backend-github-repo-create-error': "Github 저장소 생성 중 오류: $1."
    , 'project-data-invalid-bad-count': "서비스 $2에 대한 프로젝트 $1의 데이터가 유효하지 않습니다. $3개 데이터 예상, $4개 데이터 제공됨."
    , 'file-already-exists-at': "이 위치에 이미 파일이 존재합니다: $1"
    , 'unknown-shebang': "$1은(는) 직접 실행할 수 있는 스크립트 언어가 아닙니다."
    , 'unrunnable-file': "파일 $1은(는) 실행 파일도 아니고 알려진 언어도 아닙니다."
    , 'backend-icloud-dataless-files': "iCloud 동기화 문제입니다. ⚠️ 표시가 있는 파일은 Terminal을 통해 폴더에 접근하세요."
    , 'backend-search-invalid-regex': "잘못된 정규 표현식입니다: $1 ($2)"
    , 'backend-search-project-unfound-folder': "프로젝트 폴더 '$1'을(를) 찾을 수 없습니다."
    , 'excluded-folder-outside-project': "이 폴더는 프로젝트의 하위 폴더가 아닙니다 — 선택이 무시되었습니다."
}
