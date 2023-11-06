import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { QueryBodyWithPageDto } from '../dtos';
import { ResumeInterviewUrl } from '../urls';

export class ResumeInterviewController {
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
  static delete_resumeInterview(id: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: ResumeInterviewUrl.resumeInterview + '/' + id, params, ...config }, { errorMessageMode, ...options });
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
  static resumeInterviewBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeInterviewUrl.resumeInterviewBatchDel, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 改变面试评分
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeInterviewChangeRate(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeInterviewUrl.resumeInterviewChangeRate, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 更新
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static resumeInterviewUpdate(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeInterviewUrl.resumeInterviewUpdate, params, ...config }, { errorMessageMode, ...options });
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
  static resumeInterviewListAll(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeInterviewUrl.resumeInterviewListAll, params, ...config }, { errorMessageMode, ...options });
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
  static resumeInterviewList(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: ResumeInterviewUrl.resumeInterviewList, params, ...config }, { errorMessageMode, ...options });
  }
  
}