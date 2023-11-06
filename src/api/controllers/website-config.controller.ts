import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { WebsiteConfigUpdateDto } from '../dtos';
import { WebsiteConfigUrl } from '../urls';

export class WebsiteConfigController {
  /*
   * 设置系统设置
   * 管理员接口
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static websiteConfigSetConfig(params: WebsiteConfigUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: WebsiteConfigUrl.websiteConfigSetConfig, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 获取系统设置
   * 公共接口
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static websiteConfig(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: WebsiteConfigUrl.websiteConfig, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 获取系统设置
   * 公共接口
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static websiteConfigLoadTemplate(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: WebsiteConfigUrl.websiteConfigLoadTemplate, params, ...config }, { errorMessageMode, ...options });
  }
  
}