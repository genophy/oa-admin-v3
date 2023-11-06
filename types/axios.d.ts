export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // 将参数追加到url后
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // 是否直接返回response
  isReturnNativeResponse?: boolean;
  // 是否处理返回的参数，不处理，则返回 response.data 值
  isTransformResponse?: boolean;
  // 是否Url追加前缀
  joinPrefix?: boolean;
  // 请求Url地址
  apiUrl?: string;
  // Url前缀
  urlPrefix?: string;
  // 错误信息处理方式
  errorMessageMode?: ErrorMessageMode;
  // 请求是否追加时间戳
  joinTime?: boolean;
  // 是否忽略token
  ignoreCancelToken?: boolean;
  // 是否头部加入token
  withToken?: boolean;
  // 请求重试机制
  retryRequest?: RetryRequest;
}

// 重试
export interface RetryRequest {
  isOpenRetry: boolean; // 是否重试
  count: number; // 重试次数
  waitTime: number; // 等待时间
}

// 后台返回结果结构
export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  data: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}
