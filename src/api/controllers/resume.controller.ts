import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { ResumeUpdateDto, QueryBodyWithPageDto } from '../dtos';
import { ResumeUrl } from '../urls';

export class ResumeController {
  /*
   * 新增数据
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeAdd(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeAdd, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 更新数据
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeUpdate(params: ResumeUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeUpdate, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 单个删除数据
   * 
   *
   * @static
   * @param {*} id
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static delete_resume(id: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: ResumeUrl.resume + '/' + id, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 批量删除数据
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeBatchDel, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 批量启用/禁用数据
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeBatchEnabled(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeBatchEnabled, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 查询数据,无分页
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeListAll(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeListAll, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 查询数据
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeList(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeList, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 安排面试
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeAssignInterview(params: ResumeUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeUrl.resumeAssignInterview, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 取消面试
   * 
   *
   * @static
   * @param {*} resumeId
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static resumeUnassignInterview(resumeId: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: ResumeUrl.resumeUnassignInterview + '/' + resumeId, params, ...config }, { errorMessageMode, ...options });
  }
  
}