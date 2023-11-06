import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { DepartmentUpdateDto } from '../dtos';
import { DepartmentUrl } from '../urls';

export class DepartmentController {
  /*
   * 新增部门
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static departmentAdd(params: DepartmentUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: DepartmentUrl.departmentAdd, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 更新部门
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static departmentUpdate(params: DepartmentUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: DepartmentUrl.departmentUpdate, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 单个删除部门
   * 
   *
   * @static
   * @param {*} id
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static delete_department(id: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: DepartmentUrl.department + '/' + id, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 批量删除部门
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static departmentBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: DepartmentUrl.departmentBatchDel, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 批量启用/禁用部门
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static departmentBatchEnabled(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: DepartmentUrl.departmentBatchEnabled, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 查询部门
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static departmentTree(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: DepartmentUrl.departmentTree, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 获取部门所有有权限的用户
   * 
   *
   * @static
   * @param {*} departmentId
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static departmentAllPermissionUsers(departmentId: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: DepartmentUrl.departmentAllPermissionUsers + '/' + departmentId, params, ...config }, { errorMessageMode, ...options });
  }
  
}