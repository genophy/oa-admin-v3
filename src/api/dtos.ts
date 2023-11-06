export interface RegisterDto {
  account?: string; // 账号(email)
  password?: string; // 密码
  admin?: boolean; // 是否是管理员
}

export interface ResponseBodyDto {
  code?: number; // 错误码
  data?: object; // 数据
  message?: string; // 信息
  timestamp?: string; // 时间戳
  timeStr?: string; // 格式化时间
}

export interface LoginDto {
  account?: string; // 账号(email)
  password?: string; // 密码
  validCode?: string; // 图片验证码
}

export interface UserUpdateDto {
  id?: number; // ID
  resumeId?: number; // 简历ID
  name?: string; // 名称
  nickName?: string; // 匿名
  account?: string; // 账号
  password?: string; // 密码
  avatar?: string; // 头像
  idCardNumber?: string; // 身份证
  phone?: string; // 手机号
  qq?: string; // QQ号
  wechat?: string; // 微信号
  areaCode?: string; // 地区码
  address?: string; // 地址
  admin?: boolean; // 是否管理员
  effectiveTimeStart?: string; // 有效时间-开始
  effectiveTimeEnd?: string; // 有效时间-结束
  latestIp?: string; // 最近登录 IP
  latestTime?: string; // 最近登录时间
  roleIds?: any[]; // 角色ID列表
  departmentIds?: any[]; // 部门ID列表
  permissionScope?: number; // 权限范围
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface AuthUserSuccess {
  user?: any; // 用户
  token?: string; // token
}

export interface AuthResponseBodyDto {
  code?: number; // 错误码
  data?: any; // 数据
  message?: string; // 信息
  timestamp?: string; // 时间戳
  timeStr?: string; // 格式化时间
}

export interface ModifyPasswordDto {
  password?: string; // 密码
  newPassword?: string; // 新密码
}

export interface QueryBodyWithPageDto {
  condition?: object; // 查询条件
  order?: object; // 排序
  cache?: boolean; // 是否缓存
  pageIndex?: number; // 分页
  pageSize?: number; // 每页记录数
}

export interface ResponseListType {
  list?: object; // 列表
  total?: number; // 总数
}

export interface ResponseBodyListDto {
  code?: number; // 错误码
  data?: any; // 数据
  message?: string; // 信息
  timestamp?: string; // 时间戳
  timeStr?: string; // 格式化时间
}

export interface RoleUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  nameEn?: string; // 英文名称
  remark?: string; // 备注
  menuIds?: any[]; // 菜单id
  buttonPermissions?: string; // 按钮权限，逗号分割
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
  createUserId?: number; // 创建人
}

export interface MenuUpdateDto {
  id?: number; // ID
  name?: string; // 菜单名
  nameEn?: string; // 菜单名EN
  type?: string; // 类型
  url?: string; // 链接
  icon?: string; // 图标
  remark?: string; // 备注
  permissionAble?: boolean; // 是否允许权限控制
  sorting?: number; // 排序值
  parentId?: number; // 父级id
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

export interface ResponseTreeType {
  tree: object; // 树
}

export interface ResponseBodyTreeDto {
  code?: number; // 错误码
  data?: any; // 数据
  message?: string; // 信息
  timestamp?: string; // 时间戳
  timeStr?: string; // 格式化时间
}

export interface DepartmentUpdateDto {
  id?: number; // ID
  name?: string; // 部门名
  nameEn?: string; // 部门名EN
  typeId?: string; // 类型ID
  contactPersonName?: string; // 联系人姓名
  contactPersonPhone?: string; // 联系人电话
  contactPersonAddress?: string; // 联系人地址
  remark?: string; // 备注
  sorting?: number; // 排序值
  parentId?: number; // 父级ID
  contactIds?: any[]; // 联系人id
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

export interface WebsiteConfigUpdateDto {
  siteName?: string; // 网站名称
  siteDesc?: string; // 网站描述
  siteIcon?: string; // 网站icon图片
  siteLogo?: string; // 网站logo图片
  loginBg?: string; // 登录页背景
  grayMode?: boolean; // 是否灰色模式
  userDefaultPassword?: string; // 普通用户默认密码，初始化密码用
  version?: string; // 版本
  updateTime?: string; // 更新时间
}

export interface AnnouncementUpdateDto {
  id?: number; // ID
  title?: string; // 标题
  content?: string; // 内容
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

export interface FileStoreUpdateDto {
  id?: number; // ID
  fileName?: string; // 文件名
  filePath?: string; // 文件保存路径
  fileSize?: number; // 文件大小
  fileHex?: string; // md5值
  type?: string; // 文件类型
  mimetype?: string; // 元数据类型
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  createTime?: string; // 创建时间
}

export interface EmployeePostUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  departmentIds?: any[]; // 部门id
}

export interface ResumeUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  gender?: number; // 性别
  age?: number; // 年龄
  workYear?: number; // 工龄
  academicType?: number; // 学历
  school?: string; // 学校
  phone?: string; // 手机号
  areacode?: string; // 区域码
  qq?: string; // QQ号
  wechat?: string; // 微信号
  imageHexes?: string; // 图片hex，逗号分割
  remark?: string; // 备注
  avatar?: string; // 头像
  resumeFileHex?: string; // 简历文件
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
  employeePostId?: number; // 岗位ID
  interviewFlag?: number; // 是否已安排面试 1:是 0:否
  interviewReferrerId?: number; // 面试推荐人
  interviewHrId?: number; // 面试HR
  interviewDepartmentIds?: any[]; // 面试部门 ids
  interviewTime?: string; // 面试时间
  interviewUpdateTime?: string; // 更新面试情况的时间
}

export interface MeetingUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface CarUpdateDto {
  id?: number; // ID
  carNumber?: string; // 车牌号
  color?: string; // 颜色
  seating?: string; // 座位数
  carImageHexes?: string; // 车辆图片
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface CarRepairUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface CarUseUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface MeetingLogUpdateDto {
  id?: number; // ID
  meetingId?: number; // 会议ID
  meetingRoomId?: number; // 会议室ID
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}

export interface MeetingRoomUpdateDto {
  id?: number; // ID
  name?: string; // 名称
  roomNumber?: string; // 房号
  address?: string; // 地址
  maxPersonCount?: number; // 容纳人数
  equipmentIntro?: string; // 配置介绍
  remark?: string; // 备注
  enabled?: boolean; // 是否启用
  deleted?: boolean; // 是否删除
  createTime?: string; // 创建时间
}
