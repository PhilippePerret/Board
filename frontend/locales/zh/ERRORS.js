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
    , 'hour-not-valid': "时间无效：'$1'"
    , 'repeat-not-valid': "'$1' 中的重复规则无效"
    , 'error-duration': "时长« $1 » 应采用 '<数字> <单位>' 的形式，其中单位可以是“月”“周”“天”“小时”“分钟”及其缩写（例如 '12 h'）。"
    , 'prop-cant-be-empty': "属性« $1 »不能为空。"
    , 'must-be-num-between': "« $1 » 应为 $2 到 $3 之间的数字"
    , 'invalid-phone-number': "电话号码 $1 无效。"

    , 'select-project-to-what': "必须选择要$1的项目。"

    // --- Application ---
    , 'unknown-app-data': "未知的应用程序数据：'$1'"

    // --- Projets ---
    , 'project-folder-not-selected': '必须在 Finder 中选择项目文件夹。'
    , 'folder-required': '必须选择一个文件夹。'
    , 'no-current-projet': "没有当前项目。"
    , '--untitled-project--': '-无标题项目-'

    // Services
    , 'serv-error-on-return': "服务返回时出错"
    , 'service-requires-a-name': "服务必须有一个 :name。($1)"

    // Scripts services
    , 'scserv-abort': "服务已取消"
    , 'Script-service-definition-error': '脚本服务定义错误'
    , 'Script-service-file-contains-errors': '脚本服务的定义文件包含错误。'
    , 'scserv-unknown-step': "标识符为 '$1' 的步骤未知。"
    , 'scserv-list-required': "YAML 文件应定义一个步骤列表 ($1)。"
    , 'scserv-type-required': "脚本服务的步骤 ($1) 必须始终具有类型 ($2)。"
    , 'scserv-id-required': "脚本服务的步骤必须具有标识符 ($1) ($2)。"
    , 'scserv-id-invalid': "步骤 $1 的标识符无效 ($2)。"
    , 'scserv-step-type-unknowned': "未知的步骤类型：$1 ($2)。"
    , 'scserv-param-required': "参数 '$1' 是必需的，对于类型 '$2' ($3)。"
    , 'scserv-unknown-param': "参数 '$1' 对于类型为 '$2' 的服务是未知的 ($3)。"
    , 'scserv-param-bad-type': "参数 '$1' 的类型不正确。预期：$2，实际：$3 ($4)。"
    , 'scserv-on-get-file-values': "尝试读取文件 '$1' 的数据时发生错误：$2 ($3)。"
    , 'scserv-select-with-object-requires-key-values': "步骤 $1 的 select（数据为表格）需要 key_value 参数来定义菜单值 ($2)"
    , 'scserv-select-with-object-requires-title-values': "步骤 $1 的 select（数据为表格）需要 key_title 参数来定义菜单标题 ($2)"
    , 'scserv-select-with-object-unknown-key': "对于步骤 $1 的 select，对象 $2 未定义用于取值的键 '$3' ($4)。"
    , 'scserv-select-with-object-unknown-title': "对于步骤 $1 的 select，对象 $2 未定义用于标题的键 '$3' ($4)。"
    , 'scserv-unknown-evaluator': "步骤 '$1' 的求值器未知：$2 ($3)。"
    , 'scserv-unknown-marker-translate': "步骤 '$2' 的翻译标记 '$1' 未知。可能的标记为：$3 ($4)。"

    // Documentation
    , 'docu-error-on-update': "更新时出错"

    // TODOIST
    , 'todoist-key-task-unknown': "对于 Todoist 任务，键« $1 »未知。"
    , 'no-tasks-checked': "没有勾选任何任务"
    , 'checked-only-modify-task': "只能勾选要修改的任务。"

}
