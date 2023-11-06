import { isObject, isString } from '/@/libs/utils/is';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function joinTimestamp<T extends boolean>(join: boolean, restful: T): T extends true ? string : object;

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return;
  }

  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

/**
 * 重建query - params
 * @private
 * @param url
 * @param queryParams
 * @param prefix 是否追加url项目前缀
 * @return {string | any}  '?key1=value1&key2=value2' or ''
 */
export function joinQueryParams(url, queryParams, projPrefix = false) {
  const reqUrl = [projPrefix ? `${import.meta.env.VITE_GLOB_API_URL_PREFIX}` : '', url].join('/').replace(/\/+/g, '/');
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return reqUrl;
  }
  queryParams = queryParams || {};
  const queryParamsArr: any = [];
  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key) && queryParams[key] !== undefined) {
      queryParamsArr.push(`${key}=${encodeURIComponent(queryParams[key])}`);
    }
  }
  // 查询参数字符串
  const queryParamsStr = queryParamsArr[0] ? `?${queryParamsArr.join('&')}` : '';
  return `${reqUrl}${queryParamsStr}`;
}


/**
 * 设置url参数
 * @param url
 * @param key
 * @param value
 * @returns {string}
 */
export const setUrlParam = (url, key, value) => {
  if (!/^http/.test(url)) return url;
  url = decodeURIComponent(url);
  const reg = new RegExp(`${key}=[^&]*`, 'g');
  if (reg.test(url)) {
    return url.replace(reg, (v) => {
      const v0 = v.split('=');
      return `${v0}=${value}`;
    });
  }
  return `${url}${url.split('?')[1] ? '&' : '?'}${key}=${value}`;
};

/**
 * 追加url参数
 * @param url
 * @param key
 * @param value
 * @returns {string}
 */
export const joinUrlParams = (url, params) => {
  const stuff = stringify(params);
  if (~url.indexOf('?')) {
    return `${url}&${stuff}`;
  }
  return `${url}?${stuff}`;
};

