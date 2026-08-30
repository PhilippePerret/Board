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
    , 'Board': "보드"
    , 'Help': "도움말"
    , 'Debug': "디버그"
    , 'Tools': "도구"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "예"
    , 'btn-no': "아니오"
    , 'OK': '확인'
    , 'GO!': '시작!'
    , ':'   :   ' : '
    , 'new…': "새로 만들기…"
    , 'None': '없음'
    , 'Nonee': '없음'
    , 'Empty': '비어 있음'
    , 'error:': "오류:"
    , 'other-value…': '다른 값…'
    , 'date/at': '시각' // pour une date avec heure
    , 'date/months': "1월|2월|3월|4월|5월|6월|7월|8월|9월|10월|11월|12월"
    , 'date/format': "%Y년 %_M %J일"
    , 'Cancel': "취소"
    , 'Correct': "수정"
    , 'its-noted': "확인했습니다"
    , 'remind-me-later': "나중에 다시 알림"
    , '(by-default)': "(기본값)"
    , 'Color': '색상'
    , 'Image': '이미지'
    , 'Nothing': '없음'
    , 'This-one': '이것'
    , 'This-onee': "이것"
    , 'Preserve': "유지"
    , 'app-to-use': "사용할 애플리케이션"
    , 'choosing-files-to': "$1할 파일 선택"
    , 'choose-files-to': "$1할 파일을 선택하세요"
    , 'select-filter-placeholder': "필터링…"
    , 'select-all-tooltip': "전체 선택"
    , 'select-none-tooltip': "전체 선택 해제"
    , 'fatal-error': "치명적 오류"
    , 'ope-aborted': '작업이 취소되었습니다'
    , 'samples': "샘플" // (musique)
    , 'work-duration:': '작업 시간: '
    , 'created-at:': '생성일: '
    , 'modify-at:': '/수정일: '
    , 'url-definition': 'URL 정의'

    // Verbes
    , 'vb-commit': '커밋하기'
    , 'Ignore': '무시'
    , 'Finish': "완료" // dans le sens d'un ordre donné
    , 'Apply': "적용"
    , 'Import': '가져오기'
    , 'sustract': "제거하기"
    , 'Open-url…': 'URL 열기…'
    , 'modify-it': '수정하기'
    , 'Validate': '확인'

    // Logique
    , 'id-is-required': "식별자(`id`)가 필요합니다"
    , 'type-is-required': "유형이 정의되어야 합니다."

    // Data
    , 'path-to-data': "데이터 경로"
    , 'id-in-data': '데이터 내 ID (필요한 경우)'

    // Prompt
    , 'Parameter-definition': '매개변수 정의'

    // File
    , 'add-to-file-at': "파일의 임의 위치에 추가"
    , 'which-url-to-reach': '어떤 URL에 접속해야 하나요?'
    , 'destination-folder-or-file': '대상 (폴더 또는 파일)'
    , 'backend-file-created': "파일 $1이(가) 생성되었습니다."

    // App
    , 'app-config': '애플리케이션 설정'
    , 'app-version': '애플리케이션 버전'
    , 'remember-last-project': '마지막 프로젝트 기억하기'
    , 'default-browser': '기본 브라우저'
    , 'code-editor': '코드 편집기'
    , 'text-simple-editor': '일반 텍스트 편집기'
    , 'yaml-editor': 'YAML 편집기'
    , 'docu-editor': '문서 편집기'
    , 'docu-folder-name': '문서 폴더 이름'
    , 'changelog-file-name': '변경 이력 파일 이름'
    , 'todo-file-name': 'TODO 파일 이름'
    , 'last-project-id': '마지막으로 선택한 프로젝트'
    , 'backend-app-data-save': "애플리케이션 데이터가 저장되었습니다."

    // Minuteur
    , 'work-session-duration': '작업 세션 시간 (분)'
    , 'work-section-duration': '작업 구간 시간 (분)'
    , 'start-clock': '타이머 시작'
    , 'clock-work-done': '이번 세션 동안 완료한 작업: '
    , 'clock-work-is-done': "작업 마감 시간에 도달했습니다"
    , 'clock-10-minutes-remaining': "작업 시간이 10분 남았습니다"
    , 'of-work-on-project': " 프로젝트 “$1”에 대한 작업."
    , 'clock-ask-work-restarted': "작업을 다시 시작했나요?"
    , 'clock-todo-next-session': "다음 세션에 해야 할 작업: "
    , 'clock-work-time': "작업 시간:"
    , 'clock-restart': '다시 시작'
    , 'Confirm': '확인'
    , 'End-of-session': '세션 종료'
    , 'Find': "찾기"
    , 'file-opened': "파일 '$1'이(가) 열려 있습니다."
    , 'Minuteur': "타이머"
    , 'Next': '다음'
    , 'Save': '저장'
    , 'scripts': "스크립트"
    , 'ask-still-working': "프로젝트 “$1”에 대한 작업이 아직 진행 중인가요?"

    // --- UI ---
    , 'Window-position-and-size': '창 위치 및 크기'
    , 'which-widhow-app': '어떤 애플리케이션의 전면 창을 기준으로 해야 하나요?' + '<div class="small">해당 창의 크기와 위치가 클립보드에 복사됩니다</div>'
    , 'window-position-and-size': "$1 애플리케이션의 맨 앞 창 위치와 크기:"
    , 'click-button-if-data-ok': "이 데이터가 맞다면 “$1” 버튼을 클릭하세요"
    , 'countdown-timer': "타이머"
    , 'lifecycle': "라이프사이클"
    , 'open-folder-project': "프로젝트 폴더 열기"
    , 'opening': "열기"
    , 'run-a-script': "스크립트 실행"
    , 'run-a-script-service': "스크립트 서비스 실행"
    , 'Defining-a-color': "색상 정의"
    , 'choose-a-color': "아래 선택기로 색상을 선택하세요."
    , 'group-tools': "도구"
    , 'error-precise-description:': "오류에 대한 정확한 설명:"
    , 'clock-set-pause': "일시 정지"

    // --- PROJETS ---
    , 'current-projects-displayed': "현재 프로젝트가 표시되었습니다."
    , 'data-project-id': '프로젝트 ID'
    , 'data-project-icon': '프로젝트 아이콘'
    , 'data-project-folder': '프로젝트 폴더'
    , 'data-project-title': "프로젝트 제목"
    , 'data-project-nature': "프로젝트 종류"
    , 'importing-new-project': "새 프로젝트 가져오기"
    , 'data-project-standby': '프로젝트를 대기 상태로 전환'
    , 'data-project-todoist': 'Todoist의 프로젝트 ID'
    , 'data-github-account': 'Github 계정 (프로젝트)'
    , 'data-project-createdat': "프로젝트 생성일"
    , 'data-project-lastmod': '마지막 수정일'
    , 'duration-work-done': '완료된 작업 시간 (분)'
    , 'background-img-or-color': '배경 색상 또는 이미지'
    , 'githug-label-desc': "Github 이슈 라벨"

    , 'title-project': "프로젝트 “$1”"
    , 'new-project-name': "새 프로젝트 이름"
    , 'name-to-give-to-project': "이 프로젝트에 지정할 이름"
    , 'title-data-of-project': "프로젝트 “$1”의 데이터"
    , 'select-project-folder-and-ok': "Finder에서 프로젝트 폴더를 선택한 후 “확인”을 클릭하세요."
    , 'project-saved-success': "프로젝트 「$1」이(가) $2에 성공적으로 저장되었습니다."
    , 'alert-before-edit-projet': "주의, 민감한 데이터입니다. 작업 내용을 충분히 이해한 상태에서 진행하세요."
    , 'expli-retrait-projet': "프로젝트 “$1”을(를) 제거해도 폴더 자체에는 영향이 없습니다. 이 대시보드에서만 제거되거나 보관됩니다 (나중에 복구할 수 있도록)\n\n주의, 프로젝트가 보관되지 않으면 모든 서비스와 데이터는 물론 손실됩니다."
    , 'project-folder-not-selected': 'Finder에서 프로젝트 폴더를 선택해야 합니다'
    , 'folder-required': '폴더를 반드시 선택해야 합니다.'
    , 'Other-genre': "다른 유형…"
    , 'editing-project-data': "프로젝트 데이터 편집"
    , 'versionning-which-num': '어떤 번호를 업데이트해야 하나요?'
    , 'versionning-patch': '패치 버전'
    , 'versionning-minor': '마이너 버전'
    , 'versionning-major': '메이저 버전'
    , 'select-archives-folder': 'Finder에서 아카이브 폴더를 선택하세요 (파일을 보관하지 않으려면 선택하지 마세요).'
    , 'archives…': "아카이브…"
    , 'confirming-import': "가져오기 확인"
    , 'confirming-project-substract': "프로젝트 제거 확인"
    , 'project-substracted': "프로젝트가 프로젝트 목록에서 제거되었습니다."
    , 'ending-startup-project-x': "프로젝트 “$1” 시작 종료."
    , 'modifying-project-title': "프로젝트 제목 수정"
    , 'click-to-modify-title': '제목을 수정하려면 클릭하세요'
    // Projet et Service
    , 'startup-services': '시작 서비스'
    , 'others-services': '기타 서비스'
    // Projet et Todoist
    , 'todoist-tasks': 'Todoist 작업'
    // Projet et archives
    , 'archived-projects': "보관된 프로젝트"
    , 'choose-project-to-restart': "다시 활성화할 프로젝트를 선택하세요."

    // Finder
    , 'open-file…': '파일 열기…'
    , 'file-to-open': "열 파일"
    , 'opening-window-in-finder': 'Finder에서 창 열기'
    , 'sidebar-setting': "사이드바 설정"
    , 'sidebar?': "사이드바를 사용하시겠습니까?"
    , 'what-size-for-sidebar': '사이드바 크기를 얼마로 설정할까요 (숨기려면 0)?'
    , 'Choosing-finder-element': "Finder 요소 선택"
    , 'select-el-in-finder-and-ok': "Finder에서 요소를 선택한 후 확인을 클릭하세요."    , 'which-url': "어떤 URL에 접속해야 하나요?"
    , 'select-file-in-finder-and-btn': "Finder에서 열 파일을 선택한 후 “선택”을 클릭하세요."
    , 'Choosing-a-folder': "폴더 선택"
    , 'select-folder-and-ok': "Finder에서 폴더를 선택한 후 확인을 클릭하세요."
    , 'select-el-in-project-and-ok': "프로젝트 폴더에서 요소를 선택한 후 확인을 클릭하세요."
    , 'set-window-in-finder-and-ok': "Finder에서 창을 열고 원하는 대로 설정한 후 (위치, 크기, 보기 유형) 확인을 클릭하세요."
    , 'pos-window-in-finder-and-ok' : "Finder에서 창 위치를 지정한 후 “확인”을 클릭하세요."
    , 'sel-el-in-finder-or-click-none' : "Finder에서 요소를 선택하거나 '없음'을 클릭하세요."

    // -- Service --
    , 'Common-services': '공통 서비스'
    , 'Custom-services': '사용자 지정 서비스'
    , 'running-service-x': "서비스 $1 실행 중…"
    , 'service-success': ' 서비스 “$1”이(가) 성공적으로 실행되었습니다 (<span class="tiny">(서비스 $2)</span>).'
    , 'service-exec-bash-code': 'bash 코드 실행…'
    , 'service-exec-js-code': "JS 코드 실행…"
    , 'ask-for-code-to-exec': '실행할 코드:'
    , 'ask-save-work-time': '작업 시간을 저장할까요?'
    , 'Defining-parameter': '매개변수 정의'
    , 'app-choice': "애플리케이션 선택"
    , 'choose-app-to-use': '사용할 애플리케이션을 선택하세요'
    , 'other-app': '다른 애플리케이션…'
    , 'new-service-name': '서비스의 새 이름'
    , 'which-name-for-project-service': '이 프로젝트에서 이 서비스에 어떤 새 이름을 지정할까요?'
    , 'choose-color-or-image': "색상 또는 이미지 선택"
    , 'which-background': '배경으로 무엇을 선택하시겠습니까?'
    , 'phone-number': '전화번호'
    , 'which-phone-number': '유효한 전화번호를 입력해 주세요.'
    , 'date-and-hour': '날짜와 시간'
    , 'versioning-file': '파일/폴더 버전 관리'
    , "Service supprimé ($1)": "서비스 삭제됨 ($1)"
    , 'Learn-to-select-the-service': "서비스 선택 방법 알아보기"
    , 'aborted-definition': '정의가 취소되었습니다.'
    // Scripts-services
    , 'Scripts-services': "스크립트 서비스"
    , 'script-service-canceled': "스크립트 서비스가 취소되었습니다."

    // IDE et Terminaux
    , 'iterm-at-folder': '해당 폴더에서 iTerm 열기'
    , 'terminal-at-folder': '해당 폴더에서 터미널 열기'
    , 'open-in-vscode': 'VSCode에서 열기'
    , 'code-to-run-at-launch': '시작 시 실행할 코드'
    // Git
    , 'gh-save-a-error': "오류 기록 (gh)"
    , 'initing-git-for-project': "프로젝트에 Git 초기화…"
    , 'github-account': "Github 계정 이름"
    , 'github-project-name': "Github의 프로젝트 이름"
    , 'git-committing': "Github에 커밋"
    , 'git-message-commit': '해당 파일들에 대한 커밋 메시지'
    , 'git-commit-message-title': "커밋 메시지"
    , 'gh-issues-create': "새 이슈 유형…"
    , 'git-issue-list': "유형별 이슈…"
    , 'github-label': "Github 라벨:"
    , 'Message:': "메시지:"
    , 'gh-description:': "더 자세한 설명:"
    , 'gh-operation': "실행할 gh 작업"
    , 'gh-message-operation': "해당 작업에 연결할 메시지:"
    , 'action-on-checked-issues': "처리할 이슈를 선택하고 작업을 선택하세요."
    , 'gh-close': "닫기 / 삭제"
    , 'gh-comment': "댓글 달기"
    , 'gh-pin': '고정'
    , 'gh-unpin': '고정 해제'
    , 'git-installing-labels': "Git 라벨 정의"
    , 'git-init-btn': "프로젝트에 Git 초기화"
    , 'git-issue-gestion': "Github 이슈 관리"
    , 'backend-add-labels-ajout': " + 라벨 정의."
    , 'backend-git-ready': "폴더에 대해 Git 준비 완료"
    , 'backend-git-failed': "git $1 실패: $2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': 'Finder에서 서비스 스크립트를 선택한 후 “확인”을 클릭하세요.'
    , 'scserv-end': '스크립트 서비스가 성공적으로 종료되었습니다 (적어도 오류는 없습니다).'
    , 'scserv-datetime-default-format': 'DD MM HH:MM (03 08 05:12은 8월 3일 5시 12분)'
    , 'Opening-script-file': '스크립트 파일 열기'
    , 'ask-for-modify-script-file': "스크립트 파일(단계를 정의하는)을 수정하시겠습니까?"

    // -- Documentation --
    , 'Documentation': '문서'
    , 'group-documentation': "문서"
    , 'docu-folder': '문서 폴더'
    , 'editing-documentation': '문서 편집'
    , 'initing-documentation': "문서 초기화"
    , 'update-documentation': '문서 업데이트'
    , 'open-documentation': '문서 열기'
    , 'select-docu-folder-and-ok': '문서를 저장할 폴더를 선택한 후 “확인”을 클릭하세요.'
    , 'select-docu-folder': 'Finder에서 문서 폴더를 선택하세요'
    , 'select-docu-main-file': '문서의 주 파일을 선택하세요 (기본값: docu.adoc)'
    , 'select-doc-main-final-file': '매뉴얼 파일을 선택하세요 (기본값: docu.html)'
    , 'docu-main-file-name': '문서: 편집 가능한 파일 이름'
    , 'docu-main-disp-file': '문서: 게시된 파일 이름'
    , 'backend-docu-opened-in': "문서 폴더가 $1에서 성공적으로 열렸습니다"

    // Archive
    , 'backend-archiv-move-and-num': "보관함으로 이동하고 번호를 다시 매겼습니다 $1"
    , 'backend-archiv-saved': "버전이 보관함에 저장되었습니다."

    // Tools
    , 'tools-confirm-scheduling-alert': "알림이 성공적으로 예약되었습니다."

    // Reminder / Rappels
    , 'remind-started': "시작됨"
    , 'remind-remove': "삭제"
    , 'scheduling-alert': "알림 예약"
    , 'schedule-a-alert': "알림 예약하기"
    , 'hour-and-day-of-alert': "알림 시각 (이후 날짜인 경우 날짜도)"
    , 'alert-message': "알림 메시지"

    // -- Todoist --
    , 'todoist-content'     : "내용"
    , 'todoist-description' : "설명"
    , 'todoist-due'         : "시작"
    , 'todoist-deadline'    : "마감일"
    , 'todoist-duration'    : "기간"
    , 'todoist-priority'    : "우선순위"
    , 'todoist-labels'      : "라벨"
    , 'todoist-repeat'      : "반복"
    , 'task-due-to-start'   : "방해해서 죄송하지만, 작업 “$1”을(를) 시작해야 합니다."

    , 'New task...': "새 작업…"
    , 'New task': "새 작업"
    , 'todoist-message-new-task': "아래에서 이 새 작업의 일반 매개변수를 설정하세요. 필요 없는 매개변수는 삭제할 수 있으며, 간단한 표기(today, tomorrow, 4d 등)를 사용할 수 있습니다"
    , 'todoist-message-mod-task': "아래에서 작업의 매개변수를 다시 정의하세요."
    , 'todoist-default-fields-task': "내용: $1\\\n설명: $2\\\n\\\n시작: $3\\\n반복: $4\\\n기간: $5\\\n우선순위: $6\\\n마감일: $7\\\n라벨: $8"
    , 'todoist-default-due-task': "DD/MM/YYYY h:mm"
    , 'todoist-text-new-task': "✔ 새 작업: $1"
    , 'todoist-text-mod-task': "✔ 작업 수정됨: $1"
    , 'todoist-project-title': "Todoist의 프로젝트 제목"
    , 'todoist-tasks': "Todoist 작업" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "Todoist 애플리케이션에서 프로젝트 $1의 제목을 아래에 입력해 주세요."
    , 'todoist-message-today-project-task': "프로젝트 “$1”의 오늘 작업 목록."
    , 'confirm-tasks-checks': "작업 확인"
    , 'ask-for-confirm-tasks-checks': "프로젝트 “$1”의 작업에 대한 작업을 확인해 주세요.$2"
    , 'mark-task-checked': "작업 “$1”을(를) 완료로 표시해야 합니다."
    , 'todoist-fin-tasks-done-and-create': "프로젝트 “$1”의 작업이 업데이트되었습니다 (완료: $2, 신규: $3)."
    , 'todoist-tasks-created-message': "프로젝트 “$1”의 새 작업이 생성되었습니다 ($2)."
    , 'todoist-new-task-title-errors': "유효하지 않은 작업"
    , 'todoist-new-task-msg-correct-errors': "아래 오류를 수정해 주세요:"
    , 'todoist-no-task-done': "완료로 표시할 작업이 없습니다."
    , 'todoist-no-new-task': "새 작업이 없습니다."
    , 'todoist-modify-checked': "✔ 수정…"
    , 'todoist-errors-update-tasks': "작업 업데이트 중 오류"
    , 'todoist-message-actualisation': "작업 업데이트: 신규: $1, 완료: $2, 수정: $3"
    // -- test --
    , 'test-raw':   '$1을(를) 대체'
    , 'test-array': '$1과(와) $2를 대체'
    , 'test-objet': '$ceci와(과) ${cela}를 대체'

    // --- Finder ---
    , 'window-opened': "창이 성공적으로 열렸습니다."
    , 'folder-opened': "폴더가 성공적으로 열렸습니다."

    // --- Git ---
    , 'git-init-success': "Git가 성공적으로 설치되었습니다."
    , 'Which-labels': "라벨?"
    , 'which-labels-to-create': "생성할 라벨 (아무것도 선택하지 않으면 변경하지 않습니다)."

    // --- Console ---
    , 'iterm-opened-at-folder': "해당 폴더에서 iTerm이 열렸습니다."
    , 'terminal-opened-at-folder': "해당 폴더에서 터미널이 열렸습니다."

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - API 키"
    , 'which-todoist-api-key': "Todoist API 키(토큰)를 입력해 주세요"

    // --- Documentation ---
    , 'docu-opened-in-browser': "문서가 열렸습니다."

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "시"
    , 'regexp:relative-days': "그제|모레|어제|내일|오늘"
    , 'regexp:date-unit': "개월|달|주|일|시간|분"
    , 'regexp:duration-in': "([0-9]+) ?(개월|달|주|일|시간|분) ?후"
    , 'regexp:every-prefix': "매"
    , 'regexp:day-word': "일"
    , 'regexp:weekdays': "월요일|화요일|수요일|목요일|금요일|토요일|일요일"
    , 'regexp:of-month': "일"
    , 'regexp:unit-month': "개월|달"
    , 'regexp:unit-week': "주"
    , 'regexp:unit-day': "일"
    , 'regexp:unit-hour': "시간"
    , 'regexp:unit-minute': "분"
    , 'regexp:day-before-yesterday': "그제"
    , 'regexp:yesterday': "어제"
    , 'regexp:today': "오늘"
    , 'regexp:tomorrow': "내일"
    , 'regexp:day-after-tomorrow': "모레"
    , 'View': "보기"
    , 'app-launching': "애플리케이션 초기화 중…"
    , 'init-projects-services-and-reminders': "프로젝트, 서비스 및 알림 초기화 중…"
    , 'app-backup-running': "안전 백업 중…"
    , 'app-ready': "애플리케이션 준비 완료."
    , 'app-backup-discrepancy-title': "데이터 차이가 큼"
    , 'app-backup-discrepancy-intro': "데이터 차이가 큼:"
    , 'app-backup-projects-diff': "이전 $1개 프로젝트, 현재 $2개"
    , 'app-backup-services-diff': "이전 $1개 서비스, 현재 $2개"
    , 'app-backup-confirm-btn': "확인합니다"
    , 'app-backup-restore-btn': "이전 백업으로 되돌리기"
    , 'github-pr-cycle-confirming-init': "초기화 확인."
    , 'github-pr-cycle-confirm-init': "이 Github PR 사이클을 시작하시겠습니까?\n\nmain에서 새 개발 브랜치가 생성됩니다."
    , 'github-pr-cycle-init': "Github PR 사이클 – 초기화"
    , 'github-pr-cycle-commit': "Github PR 사이클 – 커밋"
    , 'github-pr-cycle-submit': "Github PR 사이클 – 제출"
    , 'github-pr-cycle-confirming-submit': "제출 확인."
    , 'github-pr-cycle-confirm-submit': "커밋된 파일을 제출하여 Github Pull Request를 생성하시겠습니까?\n\n이 PR은 테스트 실행(Github Action)과 사이트 또는 애플리케이션 업데이트를 유발할 가능성이 높습니다. 충분히 인지한 후 확인해 주세요."
    , 'github-pr-cycle-submission-ok': "Pull Request 제출이 성공적으로 완료되었습니다!"
    , 'github-pr-cycle-branch-name': "생성할 개발 브랜치 이름"
    , 'github-pr-cycle-commit-title': "이 커밋의 제목"
    , 'github-pr-cycle-commit-body': "이 커밋의 본문 (비워 둘 수 있음)"
    , 'github-pr-cycle-inited': "$1에 대해 Github PR 사이클이 초기화되었습니다."
    , 'git-pr-cycle-branche': "Github PR 사이클의 브랜치 이름."
    , 'git-title-conflict-errors-section': "<div class=title>충돌 문제</div>"
    , 'git-title-syntax-errors-section': "<div class=title>구문 문제 감지됨</div>"
    , 'github-repo-visibility': "새 저장소의 공개 범위"
    , 'github-repo-visibility-q': "이 Github 저장소는 아직 존재하지 않습니다. 생성됩니다. 어떤 공개 범위를 지정하시겠습니까?"
    , 'Private': "비공개"
    , 'Public': "공개"
    , 'github-repo-checking': "Github 저장소 확인 중…"
    , 'github-repo-description': "저장소 설명"
    , 'github-repo-description-q': "이 Github 저장소에 대한 설명은 무엇입니까?"
    , 'select-docu-folder-and-ok': '폴더를 만들고 Finder에서 선택한 다음 "OK"를 클릭하세요.'
    , 'eval-code-btn': '코드 평가…'
    , 'eval-code-title': '코드 평가'
    , 'eval-code-run-btn': '해석…'
    , 'eval-code-finish-btn': '완료'
    , 'eval-code-running': '…'
    , 'eval-code-make-script-btn': '스크립트로 만들기'
    , 'eval-code-choose-script-folder': '스크립트를 넣을 폴더를 선택한 다음 "OK"를 클릭하세요.'
    , 'eval-code-script-name-title': '스크립트 이름'
    , 'eval-code-script-name-q': '스크립트 이름은 무엇으로 하시겠습니까?'
    , 'eval-code-run-now-title': '스크립트 실행'
    , 'eval-code-run-now-q': '지금 스크립트를 실행하시겠습니까?'
    , 'eval-code-add-service-title': '프로젝트 서비스'
    , 'eval-code-add-service-q': "이 스크립트를 프로젝트 $1의 서비스로 만들까요?"
    , 'eval-code-service-name-title': '버튼 이름'
    , 'eval-code-service-name-q': '이 서비스 버튼의 이름은 무엇으로 하시겠습니까?'
    , 'git-commit-all-done': "모든 파일이 Github에 푸시되었습니다."
    , 'create-a-file': "파일 만들기"
    , 'ask-path-to-file-in-folder': '파일 경로:\n\n(프로젝트 폴더 기준 상대 경로이며, 새 폴더는 모두 생성됩니다)'
    , 'ask-file-content': "파일 내용:"
    , 'reload-project-data-title': "프로젝트의 영구 데이터 다시 불러오기"
    , 'edit-projet-reload-hint': "수정된 데이터를 다시 불러오려면 $1 도구를 클릭하세요"
    , 'project-data-reloaded': '"$1"의 데이터를 다시 불러왔습니다.'
    , 'search-documentation': "검색…"
    , 'search-type-q': "검색 유형:"
    , 'search-type-any': "모든 텍스트"
    , 'search-type-target': "대상: [[...]]"
    , 'search-type-link': "링크: <<...>>"
    , 'search-text-q': "검색할 텍스트(정규 표현식 사용 가능):"
    , 'search-results-title': "검색 결과"
    , 'search-results-query': "검색: $1"
    , 'search-results-empty': "결과 없음."
    , 'search-results-close-btn': "닫기"
    , 'backend-search-done': "$1개의 결과를 찾았습니다."
    , 'search-project': "프로젝트에서 검색…"
    , 'excluded-folders-q': "검색에서 제외할 폴더(쉼표로 구분):"
    , 'choose-folder-btn': "폴더…"
    , 'extensions-q': "검색할 파일 확장자(선택 없음 = 전체):"
    , 'search-results-count-one': " ($1건)"
    , 'search-results-count-many': " ($1건)"
    , 'gh-issue-created': "이슈 #$1이(가) 성공적으로 저장되었습니다."
}
