import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { EmployeePostUpdateDto, QueryBodyWithPageDto } from '../dtos';
import { EmployeePostUrl } from '../urls';

export class EmployeePostController {
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
  static employeePostAdd(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostAdd, params, ...config }, { errorMessageMode, ...options });
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
  static employeePostUpdate(params: EmployeePostUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostUpdate, params, ...config }, { errorMessageMode, ...options });
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
  static delete_employeePost(id: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: EmployeePostUrl.employeePost + '/' + id, params, ...config }, { errorMessageMode, ...options });
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
  static employeePostBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostBatchDel, params, ...config }, { errorMessageMode, ...options });
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
  static employeePostBatchEnabled(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostBatchEnabled, params, ...config }, { errorMessageMode, ...options });
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
  static employeePostListAll(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostListAll, params, ...config }, { errorMessageMode, ...options });
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
  static employeePostList(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: EmployeePostUrl.employeePostList, params, ...config }, { errorMessageMode, ...options });
  }
  
}