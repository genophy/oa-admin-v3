/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = -1,
  INVALID_TOKEN = 10002,
  INVALID_LICENSE = -99,
  TIMEOUT = 401,
  TYPE = 'success',
}

/**
 * 错误码
 */
export enum ErrorCodeEnum {
  SUCCESS = 0,

  FAILURE = 1001,
  WARN = 1002,

  NO_AUTH = 2001, // 请登录
  AUTH_INVALID = 2002, // 账号或密码错误
  NO_VALID_IMAGE_CODE = 2003, // 无图片验证码
  VALID_IMAGE_CODE_INVALID = 2004, // 图片验证码错误
  ACCOUNT_EXISTS = 2005, // 用户已存在
  AUTH_TIMEOUT = 2006, // 登录超时
  NO_ADMIN_PERMISSION = 2010, // 无管理员权限
  NO_MENU_PERMISSION = 2011, // 无菜单权限

  PARAMETER_MISSING = 3001, // 参数缺失
  PARAMETER_ID_MISSING = 3002, // 参数ID缺失

  EXISTS = 4001, // 数据已存在
  NOT_EXISTS = 4002, // 数据不存在
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
