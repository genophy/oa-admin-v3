export const AuthUrl = {
  // 注册
  authRegister: '/oa-admin/auth/register',
  // 登录
  authLogin: '/oa-admin/auth/login',
  // 登录，无需验证码
  authLogin2: '/oa-admin/auth/login2',
  // 当前用户
  auth: '/oa-admin/auth',
  // 登出
  authLogout: '/oa-admin/auth/logout',
  // 修改密码
  authModifyPassword: '/oa-admin/auth/modify-password',
  // 
  authValidImage: '/oa-admin/auth/valid-image',
};

export const UserUrl = {
  // 用户信息
  userInfo: '/oa-admin/user/info',
  // 新增用户
  userAdd: '/oa-admin/user/add',
  // 更新用户
  userUpdate: '/oa-admin/user/update',
  // 单个删除用户
  user: '/oa-admin/user',
  // 批量删除用户
  userBatchDel: '/oa-admin/user/batch-del',
  // 用户列表,无分页
  userListAll: '/oa-admin/user/list-all',
  // 用户列表
  userList: '/oa-admin/user/list',
  // 批量启用/禁用用户
  userBatchEnabled: '/oa-admin/user/batch-enabled',
  // 重置密码
  userResetPassword: '/oa-admin/user/reset-password',
  // 日志列表
  userLogList: '/oa-admin/user/log-list',
  // 分配角色
  userAssignRoles: '/oa-admin/user/assign-roles',
  // 分配部门
  userAssignDepartments: '/oa-admin/user/assign-departments',
  // 批量分配权限
  userBatchAssignPermissions: '/oa-admin/user/batch-assign-permissions',
};

export const RoleUrl = {
  // 新增角色
  roleAdd: '/oa-admin/role/add',
  // 更新角色
  roleUpdate: '/oa-admin/role/update',
  // 单个删除角色
  role: '/oa-admin/role',
  // 批量删除角色
  roleBatchDel: '/oa-admin/role/batch-del',
  // 批量启用/禁用角色
  roleBatchEnabled: '/oa-admin/role/batch-enabled',
  // 查询角色,无分页
  roleListAll: '/oa-admin/role/list-all',
  // 查询角色
  roleList: '/oa-admin/role/list',
  // 分配菜单
  roleAssignPermission: '/oa-admin/role/assign-permission',
};

export const MenuUrl = {
  // 新增菜单
  menuAdd: '/oa-admin/menu/add',
  // 更新菜单
  menuUpdate: '/oa-admin/menu/update',
  // 单个删除菜单
  menu: '/oa-admin/menu',
  // 批量删除菜单
  menuBatchDel: '/oa-admin/menu/batch-del',
  // 批量启用/禁用菜单
  menuBatchEnabled: '/oa-admin/menu/batch-enabled',
  // 查询菜单树
  menuTreeAll: '/oa-admin/menu/tree-all',
  // 查询当前用户拥有的菜单树
  menuTree: '/oa-admin/menu/tree',
  // 查询菜单树,根据角色ID列表
  menuTreeByRoleIds: '/oa-admin/menu/tree-by-role-ids',
};

export const DictionaryUrl = {
  // 新增字典
  dictionaryAdd: '/oa-admin/dictionary/add',
  // 编辑字典
  dictionaryUpdate: '/oa-admin/dictionary/update',
  // 单个删除字典
  dictionary: '/oa-admin/dictionary',
  // 批量删除字典
  dictionaryBatchDel: '/oa-admin/dictionary/batch-del',
  // 批量启用/禁用角色
  dictionaryBatchEnabled: '/oa-admin/dictionary/batch-enabled',
  // 查询字典
  dictionaryList: '/oa-admin/dictionary/list',
};

export const DepartmentUrl = {
  // 新增部门
  departmentAdd: '/oa-admin/department/add',
  // 更新部门
  departmentUpdate: '/oa-admin/department/update',
  // 单个删除部门
  department: '/oa-admin/department',
  // 批量删除部门
  departmentBatchDel: '/oa-admin/department/batch-del',
  // 批量启用/禁用部门
  departmentBatchEnabled: '/oa-admin/department/batch-enabled',
  // 查询部门
  departmentTree: '/oa-admin/department/tree',
  // 获取部门所有有权限的用户
  departmentAllPermissionUsers: '/oa-admin/department/all-permission-users',
};

export const WebsiteConfigUrl = {
  // 设置系统设置
  websiteConfigSetConfig: '/oa-admin/website-config/set-config',
  // 获取系统设置
  websiteConfig: '/oa-admin/website-config',
  // 获取系统设置
  websiteConfigLoadTemplate: '/oa-admin/website-config/load-template',
};

export const AnnouncementUrl = {
  // 新增数据
  announcementAdd: '/oa-admin/announcement/add',
  // 更新数据
  announcementUpdate: '/oa-admin/announcement/update',
  // 更新数据
  announcementUpdateRead: '/oa-admin/announcement/update-read',
  // 单个删除数据
  announcement: '/oa-admin/announcement',
  // 批量删除数据
  announcementBatchDel: '/oa-admin/announcement/batch-del',
  // 批量启用/禁用数据
  announcementBatchEnabled: '/oa-admin/announcement/batch-enabled',
  // 查询数据,无分页
  announcementListAll: '/oa-admin/announcement/list-all',
  // 查询数据
  announcementList: '/oa-admin/announcement/list',
  // 查询当前用户未读数量
  announcementUnreadCount: '/oa-admin/announcement/unread-count',
  // 查询当前用户已读公告 id
  announcementQueryIdsOfRead: '/oa-admin/announcement/query-ids-of-read',
};

export const FileStoreUrl = {
  // 上传图片
  fileStoreUploadImage: '/oa-admin/file-store/upload-image',
  // 上传大文件
  fileStoreUploadBigFile: '/oa-admin/file-store/upload-big-file',
  // 下载文件
  fileStoreDownload: '/oa-admin/file-store/download',
  // 查看文件
  fileStorePdf: '/oa-admin/file-store/pdf',
  // 查看图片
  imageGetByPath: '/oa-admin/file-store/image/get-by-path',
  // 查看图片
  fileStoreImage: '/oa-admin/file-store/image',
  // 获取文件信息
  fileStoreFileInfo: '/oa-admin/file-store/file-info',
  // 删除所有文件
  fileStoreDelAll: '/oa-admin/file-store/del-all',
  // 删除单个文件
  fileStore: '/oa-admin/file-store',
  // 批量删除多个文件
  fileStoreBatchDel: '/oa-admin/file-store/batch-del',
  // 查询文件列表
  fileStoreList: '/oa-admin/file-store/list',
};

export const EmployeePostUrl = {
  // 新增数据
  employeePostAdd: '/oa-admin/employee-post/add',
  // 更新数据
  employeePostUpdate: '/oa-admin/employee-post/update',
  // 单个删除数据
  employeePost: '/oa-admin/employee-post',
  // 批量删除数据
  employeePostBatchDel: '/oa-admin/employee-post/batch-del',
  // 批量启用/禁用数据
  employeePostBatchEnabled: '/oa-admin/employee-post/batch-enabled',
  // 查询数据,无分页
  employeePostListAll: '/oa-admin/employee-post/list-all',
  // 查询数据
  employeePostList: '/oa-admin/employee-post/list',
};

export const ResumeUrl = {
  // 新增数据
  resumeAdd: '/oa-admin/resume/add',
  // 更新数据
  resumeUpdate: '/oa-admin/resume/update',
  // 单个删除数据
  resume: '/oa-admin/resume',
  // 批量删除数据
  resumeBatchDel: '/oa-admin/resume/batch-del',
  // 批量启用/禁用数据
  resumeBatchEnabled: '/oa-admin/resume/batch-enabled',
  // 查询数据,无分页
  resumeListAll: '/oa-admin/resume/list-all',
  // 查询数据
  resumeList: '/oa-admin/resume/list',
  // 安排面试
  resumeAssignInterview: '/oa-admin/resume/assign-interview',
  // 取消面试
  resumeUnassignInterview: '/oa-admin/resume/unassign-interview',
};

export const ResumeInterviewUrl = {
  // 单个删除数据
  resumeInterview: '/oa-admin/resume-interview',
  // 批量删除数据
  resumeInterviewBatchDel: '/oa-admin/resume-interview/batch-del',
  // 改变面试评分
  resumeInterviewChangeRate: '/oa-admin/resume-interview/change-rate',
  // 更新
  resumeInterviewUpdate: '/oa-admin/resume-interview/update',
  // 查询数据,无分页
  resumeInterviewListAll: '/oa-admin/resume-interview/list-all',
  // 查询数据
  resumeInterviewList: '/oa-admin/resume-interview/list',
};

export const MeetingUrl = {
  // 新增数据
  meetingAdd: '/oa-admin/meeting/add',
  // 更新数据
  meetingUpdate: '/oa-admin/meeting/update',
  // 单个删除数据
  meeting: '/oa-admin/meeting',
  // 批量删除数据
  meetingBatchDel: '/oa-admin/meeting/batch-del',
  // 批量启用/禁用数据
  meetingBatchEnabled: '/oa-admin/meeting/batch-enabled',
  // 查询数据,无分页
  meetingListAll: '/oa-admin/meeting/list-all',
  // 查询数据
  meetingList: '/oa-admin/meeting/list',
};

export const CarUrl = {
  // 新增数据
  carAdd: '/oa-admin/car/add',
  // 更新数据
  carUpdate: '/oa-admin/car/update',
  // 单个删除数据
  car: '/oa-admin/car',
  // 批量删除数据
  carBatchDel: '/oa-admin/car/batch-del',
  // 批量启用/禁用数据
  carBatchEnabled: '/oa-admin/car/batch-enabled',
  // 查询数据,无分页
  carListAll: '/oa-admin/car/list-all',
  // 查询数据
  carList: '/oa-admin/car/list',
};

export const CarRepairUrl = {
  // 新增数据
  carRepairAdd: '/oa-admin/car-repair/add',
  // 更新数据
  carRepairUpdate: '/oa-admin/car-repair/update',
  // 单个删除数据
  carRepair: '/oa-admin/car-repair',
  // 批量删除数据
  carRepairBatchDel: '/oa-admin/car-repair/batch-del',
  // 批量启用/禁用数据
  carRepairBatchEnabled: '/oa-admin/car-repair/batch-enabled',
  // 查询数据,无分页
  carRepairListAll: '/oa-admin/car-repair/list-all',
  // 查询数据
  carRepairList: '/oa-admin/car-repair/list',
};

export const CarUseUrl = {
  // 新增数据
  carUseAdd: '/oa-admin/carUse/add',
  // 更新数据
  carUseUpdate: '/oa-admin/carUse/update',
  // 单个删除数据
  carUse: '/oa-admin/carUse',
  // 批量删除数据
  carUseBatchDel: '/oa-admin/carUse/batch-del',
  // 批量启用/禁用数据
  carUseBatchEnabled: '/oa-admin/carUse/batch-enabled',
  // 查询数据,无分页
  carUseListAll: '/oa-admin/carUse/list-all',
  // 查询数据
  carUseList: '/oa-admin/carUse/list',
};

export const MeetingLogUrl = {
  // 新增数据
  meetingLogAdd: '/oa-admin/meeting-log/add',
  // 更新数据
  meetingLogUpdate: '/oa-admin/meeting-log/update',
  // 单个删除数据
  meetingLog: '/oa-admin/meeting-log',
  // 批量删除数据
  meetingLogBatchDel: '/oa-admin/meeting-log/batch-del',
  // 批量启用/禁用数据
  meetingLogBatchEnabled: '/oa-admin/meeting-log/batch-enabled',
  // 查询数据,无分页
  meetingLogListAll: '/oa-admin/meeting-log/list-all',
  // 查询数据
  meetingLogList: '/oa-admin/meeting-log/list',
};

export const MeetingRoomUrl = {
  // 新增数据
  meetingRoomAdd: '/oa-admin/meeting-room/add',
  // 更新数据
  meetingRoomUpdate: '/oa-admin/meeting-room/update',
  // 单个删除数据
  meetingRoom: '/oa-admin/meeting-room',
  // 批量删除数据
  meetingRoomBatchDel: '/oa-admin/meeting-room/batch-del',
  // 批量启用/禁用数据
  meetingRoomBatchEnabled: '/oa-admin/meeting-room/batch-enabled',
  // 查询数据,无分页
  meetingRoomListAll: '/oa-admin/meeting-room/list-all',
  // 查询数据
  meetingRoomList: '/oa-admin/meeting-room/list',
};
