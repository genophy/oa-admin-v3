// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import { clone } from 'lodash-es';
import { VAxios } from './Axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { checkStatus } from './checkStatus';
import { formatRequestDate, joinTimestamp } from './helper';
import type { RequestOptions, Result } from '/#/axios';
import { ContentTypeEnum, ErrorCodeEnum, RequestEnum } from '/@/libs/enums/httpEnum';
import { useGlobSetting } from '/@/libs/hooks/setting';
import { useI18n } from '/@/libs/hooks/web/useI18n';
import { useMessage } from '/@/libs/hooks/web/useMessage';
import { useErrorLogStoreWithOut } from '/@/libs/store/modules/errorLog';
import { useUserStoreWithOut } from '/@/libs/store/modules/user';
import { deepMerge, setObjToUrlParams } from '/@/libs/utils';
import { getToken } from '/@/libs/utils/auth';
import { AxiosRetry } from '/@/libs/utils/http/axios/axiosRetry';
import { isString } from '/@/libs/utils/is';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;

const axiosTimeout = 3 * 60 * 1000; // 请求接口超时 3分钟

const { createMessage, createAlert } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回
    if (!res.data) {
      throw { code: -1, message: t('sys.apiRequestFailed') };
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, data, message } = res.data;
    // 这里逻辑可以根据项目进行修改
    const hasSuccess = Reflect.has(res.data, 'code') && code === ErrorCodeEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }
    // 错误的签名
    // if (code === ResultEnum.INVALID_LICENSE) {
    //   createMessage.error('服务器签名出错');
    //   return data;
    // }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let exceptionMsg = '';
    switch (code) {
      case ErrorCodeEnum.NO_AUTH:
      case ErrorCodeEnum.AUTH_TIMEOUT:
        exceptionMsg = t('sys.timeoutMessage');
        const userStore = useUserStoreWithOut();
        userStore.setToken(undefined);
        userStore.logout(true);
        break;
      default:
        if (message) {
          exceptionMsg = message;
        }
    }

    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      createAlert(t('sys.errorTip'), exceptionMsg, null, { type: 'error' });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(exceptionMsg);
    }
    if (exceptionMsg) {
      throw { code: -1, message: exceptionMsg };
    }
    throw res.data;
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && (Object.keys(config.data).length > 0 || config.data instanceof FormData)) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data));
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      // (config as Recordable).headers.token = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
      (config as Recordable).headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token;
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  responseInterceptorsCatch: (error: AxiosError | any) => {
    const { t } = useI18n();

    const { config, code, request, response, status, message } = error || {};

    const errorMessageMode = (config as any)?.requestOptions?.errorMessageMode || 'none';
    let errMessage = '';

    try {
      if (code === 'ERR_CANCELED') {
        errMessage = t('sys.errMsg405');
      }
      if ((code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) || (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1)) {
        errMessage = t('sys.apiTimeoutMessage');
      }
      if (message?.includes('Network Error')) {
        errMessage = t('sys.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createAlert(t('sys.errorTip'), errMessage, null, { type: 'error' });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(errMessage);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }
    checkStatus(response?.status, response?.data?.message || message, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch2: (axiosInstance: AxiosResponse, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if ((axiosInstance as any)?.code === 'ERR_CANCELED') {
        errMessage = t('sys.errMsg405');
      }
      if (((axiosInstance as any)?.code === 'ECONNABORTED' && (axiosInstance as any)?.message.indexOf('timeout') !== -1) || (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1)) {
        errMessage = t('sys.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createAlert(t('sys.errorTip'), errMessage, null, { type: 'error' });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(errMessage);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        authenticationScheme: 'Bearer',
        // authenticationScheme: '',
        timeout: axiosTimeout,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: false,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理(如上传，需要直接返回response，则设置为false)
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略中断请求（路由跳转，默认会终止）
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
