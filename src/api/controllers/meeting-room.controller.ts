import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { MeetingRoomUpdateDto, QueryBodyWithPageDto } from '../dtos';
import { MeetingRoomUrl } from '../urls';

export class MeetingRoomController {
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
  static meetingRoomAdd(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomAdd, params, ...config }, { errorMessageMode, ...options });
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
  static meetingRoomUpdate(params: MeetingRoomUpdateDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomUpdate, params, ...config }, { errorMessageMode, ...options });
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
  static delete_meetingRoom(id: number, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: MeetingRoomUrl.meetingRoom + '/' + id, params, ...config }, { errorMessageMode, ...options });
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
  static meetingRoomBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomBatchDel, params, ...config }, { errorMessageMode, ...options });
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
  static meetingRoomBatchEnabled(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomBatchEnabled, params, ...config }, { errorMessageMode, ...options });
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
  static meetingRoomListAll(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomListAll, params, ...config }, { errorMessageMode, ...options });
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
  static meetingRoomList(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: MeetingRoomUrl.meetingRoomList, params, ...config }, { errorMessageMode, ...options });
  }
  
}