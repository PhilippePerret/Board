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
    , 'Board': "面板"
    , 'Help': "帮助"
    , 'Debug': "调试"
    , 'Tools': "工具"

    // --- GÉNÉRAUX ---
    , 'btn-yes': "是"
    , 'btn-no': "否"
    , 'OK': '确定'
    , 'GO!': '开始！'
    , ':'   :   '：'
    , 'new…': "新建…"
    , 'None': '无'
    , 'Nonee': '无'
    , 'Empty': '空'
    , 'error:': "错误："
    , 'other-value…': '其他值…'
    , 'date/at': '于' // pour une date avec heure
    , 'date/months': "1月|2月|3月|4月|5月|6月|7月|8月|9月|10月|11月|12月"
    , 'date/format': "%Y年%_M%J日"
    , 'Cancel': "取消"
    , 'Correct': "更正"
    , 'its-noted': "知道了"
    , 'remind-me-later': "稍后提醒我"
    , '(by-default)': "（默认）"
    , 'Color': '颜色'
    , 'Image': '图片'
    , 'Nothing': '无'
    , 'This-one': '这个'
    , 'This-onee': "这个"
    , 'Preserve': "保留"
    , 'app-to-use': "要使用的应用程序"
    , 'choosing-files-to': "选择要$1的文件"
    , 'choose-files-to': "选择要$1的文件"
    , 'select-filter-placeholder': "筛选…"
    , 'fatal-error': "严重错误"
    , 'ope-aborted': '操作已取消'
    , 'samples': "示例" // (musique)
    , 'work-duration:': '工作时长：'
    , 'created-at:': '创建于：'
    , 'modify-at:': '/修改于：'
    , 'url-definition': 'URL 定义'

    // Verbes
    , 'vb-commit': '提交'
    , 'Ignore': '忽略'
    , 'Finish': "完成" // dans le sens d'un ordre donné
    , 'Apply': "应用"
    , 'Import': '导入'
    , 'sustract': "移除"
    , 'Open-url…': '打开链接…'
    , 'modify-it': '修改'
    , 'Validate': '确认'

    // Logique
    , 'id-is-required': "必须提供一个标识符（`id`）"
    , 'type-is-required': "必须定义类型。"

    // Data
    , 'path-to-data': "数据路径"
    , 'id-in-data': '数据中的 ID（如需要）'

    // Prompt
    , 'Parameter-definition': '参数定义'

    // File
    , 'add-to-file-at': "添加到文件的任意位置"
    , 'which-url-to-reach': '需要访问哪个 URL？'
    , 'destination-folder-or-file': '目标（文件夹或文件）'
    , 'backend-file-created': "文件 $1 已创建。"

    // App
    , 'app-config': '应用程序配置'
    , 'app-version': '应用程序版本'
    , 'remember-last-project': '记住上一个项目'
    , 'default-browser': '默认浏览器'
    , 'code-editor': '代码编辑器'
    , 'text-simple-editor': '纯文本编辑器'
    , 'yaml-editor': 'YAML 编辑器'
    , 'docu-editor': '文档编辑器'
    , 'docu-folder-name': '文档文件夹名称'
    , 'changelog-file-name': 'Changelog 文件名称'
    , 'todo-file-name': 'TODO 文件名称'
    , 'last-project-id': '上次选择的项目'
    , 'backend-app-data-save': "应用数据已保存。"

    // Minuteur
    , 'work-session-duration': '工作阶段时长（分钟）'
    , 'work-section-duration': '工作时段时长（分钟）'
    , 'start-clock': '启动计时器'
    , 'clock-work-done': '本次会话已完成的工作：'
    , 'clock-work-is-done': "你已到达工作截止时间"
    , 'clock-10-minutes-remaining': "你还剩 10 分钟工作时间"
    , 'of-work-on-project': "，项目“$1”。"
    , 'clock-ask-work-restarted': "工作是否已恢复？"
    , 'clock-todo-next-session': "下次会话待完成的工作："
    , 'clock-work-time': "工作时间："
    , 'clock-restart': '重新开始'
    , 'Confirm': '确认'
    , 'End-of-session': '会话结束'
    , 'Find': "查找"
    , 'file-opened': "文件“$1”已打开。"
    , 'Minuteur': "计时器"
    , 'Next': '下一步'
    , 'Save': '保存'
    , 'scripts': "脚本"
    , 'ask-still-working': "项目“$1”是否仍在进行中？"

    // --- UI ---
    , 'Window-position-and-size': '窗口位置和大小'
    , 'which-widhow-app': '应考虑哪个应用程序的前台窗口？' + '<div class="small">其大小和位置将复制到剪贴板</div>'
    , 'window-position-and-size': "应用程序 $1 中最前窗口的位置和大小："
    , 'click-button-if-data-ok': "如果这些数据正确，请点击“$1”按钮"
    , 'countdown-timer': "计时器"
    , 'lifecycle': "生命周期"
    , 'open-folder-project': "打开项目文件夹"
    , 'opening': "打开"
    , 'run-a-script': "运行脚本"
    , 'run-a-script-service': "运行脚本服务"
    , 'Defining-a-color': "定义颜色"
    , 'choose-a-color': "使用下方的选择器选择一种颜色。"
    , 'group-tools': "工具"
    , 'error-precise-description:': "错误的详细描述："
    , 'clock-set-pause': "暂停"

    // --- PROJETS ---
    , 'current-projects-displayed': "当前项目已显示。"
    , 'data-project-id': '项目 ID'
    , 'data-project-icon': '项目图标'
    , 'data-project-folder': '项目文件夹'
    , 'data-project-title': "项目标题"
    , 'data-project-nature': "项目性质"
    , 'importing-new-project': "导入新项目"
    , 'data-project-standby': '将项目设为待机'
    , 'data-project-todoist': 'Todoist 中的项目 ID'
    , 'data-github-account': 'Github 账号（项目的）'
    , 'data-project-createdat': "项目创建日期"
    , 'data-project-lastmod': '最后修改日期'
    , 'duration-work-done': '已完成的工作时长（分钟）'
    , 'background-img-or-color': '背景颜色或图片'
    , 'githug-label-desc': "Github issue 标签"

    , 'title-project': "项目“$1”"
    , 'new-project-name': "新项目名称"
    , 'name-to-give-to-project': "为该项目指定的名称"
    , 'title-data-of-project': "项目“$1”的数据"
    , 'select-project-folder-and-ok': "在 Finder 中选择项目文件夹，然后点击“确定”。"
    , 'project-saved-success': "项目「$1」已于 $2 成功保存。"
    , 'alert-before-edit-projet': "注意，敏感数据。请在了解操作后果的情况下继续。"
    , 'expli-retrait-projet': "移除项目“$1”不会影响其文件夹本身。它只是从此面板中移除或被存档（以便日后恢复）\n\n注意，如果项目未被存档，其所有服务和数据当然都会丢失。"
    , 'project-folder-not-selected': '必须在 Finder 中选择项目文件夹'
    , 'folder-required': '必须选择一个文件夹。'
    , 'Other-genre': "其他类型…"
    , 'editing-project-data': "编辑项目数据"
    , 'versionning-which-num': '应更新哪个版本号？'
    , 'versionning-patch': '补丁版本'
    , 'versionning-minor': '次版本'
    , 'versionning-major': '主版本'
    , 'select-archives-folder': '在 Finder 中选择存档文件夹（如果不需要存档该文件，则不选）。'
    , 'archives…': "存档…"
    , 'confirming-import': "确认导入"
    , 'confirming-project-substract': "确认移除项目"
    , 'project-substracted': "项目已从项目列表中移除。"
    , 'ending-startup-project-x': "项目“$1”启动结束。"
    , 'modifying-project-title': "修改项目标题"
    , 'click-to-modify-title': '点击以修改标题'
    // Projet et Service
    , 'startup-services': '启动服务'
    , 'others-services': '其他服务'
    // Projet et Todoist
    , 'todoist-tasks': 'Todoist 任务'
    // Projet et archives
    , 'archived-projects': "已存档的项目"
    , 'choose-project-to-restart': "选择要重新激活的项目。"

    // Finder
    , 'open-file…': '打开文件…'
    , 'file-to-open': "要打开的文件"
    , 'opening-window-in-finder': '在 Finder 中打开一个窗口'
    , 'sidebar-setting': "侧边栏设置"
    , 'sidebar?': "需要侧边栏吗？"
    , 'what-size-for-sidebar': '侧边栏应设置为多大（设为 0 以隐藏）？'
    , 'Choosing-finder-element': "选择 Finder 中的元素"
    , 'select-el-in-finder-and-ok': "在 Finder 中选择该元素，然后点击“确定”。"    , 'which-url': "需要访问哪个 URL？"
    , 'select-file-in-finder-and-btn': "在 Finder 中选择要打开的文件，然后点击“选择”。"
    , 'Choosing-a-folder': "选择文件夹"
    , 'select-folder-and-ok': "在 Finder 中选择文件夹，然后点击“确定”。"
    , 'select-el-in-project-and-ok': "在项目文件夹中选择该元素，然后点击“确定”。"
    , 'set-window-in-finder-and-ok': "在 Finder 中打开窗口并按需设置（位置、大小、视图类型），然后点击“确定”。"
    , 'pos-window-in-finder-and-ok' : "在 Finder 中定位窗口，然后点击“确定”。"
    , 'sel-el-in-finder-or-click-none' : "在 Finder 中选择该元素，或点击“无”。"

    // -- Service --
    , 'Common-services': '通用服务'
    , 'Custom-services': '自定义服务'
    , 'running-service-x': "正在启动服务 $1…"
    , 'service-success': ' 服务“$1”执行成功（<span class="tiny">（服务 $2）</span>）。'
    , 'service-exec-bash-code': '执行 bash 代码…'
    , 'service-exec-js-code': "执行 JS 代码…"
    , 'ask-for-code-to-exec': '要执行的代码：'
    , 'ask-save-work-time': '是否需要保存工作时间？'
    , 'Defining-parameter': '参数定义'
    , 'app-choice': "选择应用程序"
    , 'choose-app-to-use': '选择要使用的应用程序'
    , 'other-app': '其他应用程序…'
    , 'new-service-name': '服务的新名称'
    , 'which-name-for-project-service': '该项目的此服务应使用什么新名称？'
    , 'choose-color-or-image': "选择颜色或图片"
    , 'which-background': '你想选择什么作为背景？'
    , 'phone-number': '电话号码'
    , 'which-phone-number': '请提供一个有效的电话号码。'
    , 'date-and-hour': '日期和时间'
    , 'versioning-file': '对文件/文件夹进行版本管理'
    , "Service supprimé ($1)": "服务已删除（$1）"
    , 'Learn-to-select-the-service': "了解如何选择该服务"
    , 'aborted-definition': '定义已取消。'
    // Scripts-services
    , 'Scripts-services': "脚本服务"
    , 'script-service-canceled': "脚本服务已取消。"

    // IDE et Terminaux
    , 'iterm-at-folder': '在该文件夹打开 iTerm'
    , 'terminal-at-folder': '在该文件夹打开终端'
    , 'open-in-vscode': '在 VSCode 中打开'
    , 'code-to-run-at-launch': '启动时要执行的代码'
    // Git
    , 'gh-save-a-error': "记录一个错误（gh）"
    , 'initing-git-for-project': "为项目初始化 Git"
    , 'github-account': "你的 Github 账号名称"
    , 'github-project-name': "Github 上的项目名称"
    , 'git-committing': "提交到 Github"
    , 'git-message-commit': '这些文件的提交信息'
    , 'git-commit-message-title': "提交信息"
    , 'gh-issues-create': "新建类型为…的 issue"
    , 'git-issue-list': "类型为…的 issue"
    , 'github-label': "Github 标签："
    , 'Message:': "信息："
    , 'gh-description:': "更详细的描述："
    , 'gh-operation': "要执行的 gh 操作"
    , 'gh-message-operation': "与该操作关联的信息："
    , 'action-on-checked-issues': "勾选要处理的 issue 并选择操作。"
    , 'gh-close': "关闭/删除"
    , 'gh-comment': "评论"
    , 'gh-pin': '置顶'
    , 'gh-unpin': '取消置顶'
    , 'git-installing-labels': "定义 Git 标签"
    , 'git-init-btn': "为项目初始化 Git"
    , 'git-issue-gestion': "Github issue 管理"
    , 'backend-add-labels-ajout': " + 标签定义。"
    , 'backend-git-ready': "Git 已为该文件夹准备就绪"
    , 'backend-git-failed': "git $1 失败：$2"

    // -- Script services --
    , 'scserv-select-script-in-finder-and-ok': '在 Finder 中选择该服务的脚本，然后点击“确定”。'
    , 'scserv-end': '脚本服务成功结束（至少没有错误）。'
    , 'scserv-datetime-default-format': 'DD MM HH:MM（03 08 05:12 表示 8 月 3 日 5:12）'
    , 'Opening-script-file': '正在打开脚本文件'
    , 'ask-for-modify-script-file': "是否要修改脚本文件（定义各个步骤）？"

    // -- Documentation --
    , 'Documentation': '文档'
    , 'group-documentation': "文档"
    , 'docu-folder': '文档文件夹'
    , 'editing-documentation': '编辑文档'
    , 'initing-documentation': "初始化文档"
    , 'update-documentation': '更新文档'
    , 'open-documentation': '打开文档'
    , 'select-docu-folder-and-ok': '选择用于存放文档的文件夹，然后点击“确定”。'
    , 'select-docu-folder': '在 Finder 中选择文档文件夹'
    , 'select-docu-main-file': '选择文档主文件（默认：docu.adoc）'
    , 'select-doc-main-final-file': '选择手册文件（默认：docu.html）'
    , 'docu-main-file-name': '文档：可编辑文件名称'
    , 'docu-main-disp-file': '文档：发布文件名称'
    , 'backend-docu-opened-in': "文档文件夹已成功在 $1 中打开"

    // Archive
    , 'backend-archiv-move-and-num': "已移动到存档并重新编号 $1"
    , 'backend-archiv-saved': "版本已保存到存档。"

    // Tools
    , 'tools-confirm-scheduling-alert': "提醒已成功安排。"

    // Reminder / Rappels
    , 'remind-started': "已开始"
    , 'remind-remove': "删除"
    , 'scheduling-alert': "安排提醒"
    , 'schedule-a-alert': "安排一个提醒"
    , 'hour-and-day-of-alert': "提醒时间（如果是以后的日子，也需注明日期）"
    , 'alert-message': "提醒信息"

    // -- Todoist --
    , 'todoist-content'     : "内容"
    , 'todoist-description' : "描述"
    , 'todoist-due'         : "开始"
    , 'todoist-deadline'    : "截止日期"
    , 'todoist-duration'    : "时长"
    , 'todoist-priority'    : "优先级"
    , 'todoist-labels'      : "标签"
    , 'todoist-repeat'      : "重复"
    , 'task-due-to-start'   : "抱歉打扰，但任务“$1”必须开始了。"

    , 'New task...': "新任务…"
    , 'New task': "新任务"
    , 'todoist-message-new-task': "请在下方设置此新任务的常规参数。你可以删除任何不需要的参数，并使用简化标记（today、tomorrow、4d 等）"
    , 'todoist-message-mod-task': "请在下方重新定义该任务的参数。"
    , 'todoist-default-fields-task': "内容：$1\\\n描述：$2\\\n\\\n开始：$3\\\n重复：$4\\\n时长：$5\\\n优先级：$6\\\n截止日期：$7\\\n标签：$8"
    , 'todoist-default-due-task': "DD/MM/YYYY 于 h:mm"
    , 'todoist-text-new-task': "✔ 新任务：$1"
    , 'todoist-text-mod-task': "✔ 任务已修改：$1"
    , 'todoist-project-title': "Todoist 中的项目标题"
    , 'todoist-tasks': "Todoist 任务" // par exemple title du bouton de la carte
    , 'msg-ask-for-todoist-project-title': "请在下方填写 Todoist 应用中项目 $1 的标题。"
    , 'todoist-message-today-project-task': "项目“$1”今日任务列表。"
    , 'confirm-tasks-checks': "确认任务"
    , 'ask-for-confirm-tasks-checks': "请确认项目“$1”的任务操作。$2"
    , 'mark-task-checked': "任务“$1”应标记为已完成。"
    , 'todoist-fin-tasks-done-and-create': "项目“$1”的任务已更新（已完成：$2，新增：$3）。"
    , 'todoist-tasks-created-message': "项目“$1”的新任务已创建（$2）。"
    , 'todoist-new-task-title-errors': "任务无效"
    , 'todoist-new-task-msg-correct-errors': "请更正下方的错误："
    , 'todoist-no-task-done': "没有任务需要标记为已完成。"
    , 'todoist-no-new-task': "没有新任务。"
    , 'todoist-modify-checked': "修改 ✔…"
    , 'todoist-errors-update-tasks': "更新任务时出错"
    , 'todoist-message-actualisation': "任务更新：新增：$1，已完成：$2，已修改：$3"
    // -- test --
    , 'test-raw':   '替换 $1'
    , 'test-array': '替换 $1 和 $2'
    , 'test-objet': '替换 $ceci 和 ${cela}'

    // --- Finder ---
    , 'window-opened': "窗口已成功打开。"
    , 'folder-opened': "文件夹已成功打开。"

    // --- Git ---
    , 'git-init-success': "Git 安装成功。"
    , 'Which-labels': "标签？"
    , 'which-labels-to-create': "要创建的标签（不选择则不做任何更改）。"

    // --- Console ---
    , 'iterm-opened-at-folder': "已在该文件夹打开 iTerm。"
    , 'terminal-opened-at-folder': "已在该文件夹打开终端。"

    // --- Todoist ---
    , 'Todois-api-key': "Todoist - API 密钥"
    , 'which-todoist-api-key': "请提供您的 Todoist API 密钥（令牌）"

    // --- Documentation ---
    , 'docu-opened-in-browser': "文档已打开。"

    // --- Validator (regexp) ---
    , 'regexp:date-prefix': "(?:)"
    , 'regexp:hour-words': "点|时"
    , 'regexp:relative-days': "前天|后天|昨天|明天|今天"
    , 'regexp:date-unit': "月|周|星期|天|日|小时|时|分钟|分"
    , 'regexp:duration-in': "([0-9]+) ?(月|周|星期|天|日|小时|时|分钟|分)后"
    , 'regexp:every-prefix': "每"
    , 'regexp:day-word': "天"
    , 'regexp:weekdays': "星期一|星期二|星期三|星期四|星期五|星期六|星期日"
    , 'regexp:of-month': "号"
    , 'regexp:unit-month': "月"
    , 'regexp:unit-week': "周|星期"
    , 'regexp:unit-day': "天|日"
    , 'regexp:unit-hour': "小时|时"
    , 'regexp:unit-minute': "分钟|分"
    , 'regexp:day-before-yesterday': "前天"
    , 'regexp:yesterday': "昨天"
    , 'regexp:today': "今天"
    , 'regexp:tomorrow': "明天"
    , 'regexp:day-after-tomorrow': "后天"
}
