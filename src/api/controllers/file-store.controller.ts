import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { defHttp } from '/@/libs/utils/http/axios';
import { AxiosRequestConfig } from 'axios';
import { QueryBodyWithPageDto } from '../dtos';
import { FileStoreUrl } from '../urls';

export class FileStoreController {
  /**
   * 上传图片
   * 
   *
   * @static
   * @param {} params
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {AxiosRequestConfig} [config={}]
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   */
  static fileStoreUploadImage(params:any = {}, onUploadProgress: (progressEvent: ProgressEvent) => (void), errorMessageMode: ErrorMessageMode = 'message',  options: RequestOptions = { isTransformResponse: false }) {
    return defHttp.uploadFile({ url: FileStoreUrl.fileStoreUploadImage, onUploadProgress }, params, { errorMessageMode, ...options });
  }
  
  /**
   * 上传大文件
   * 
   *
   * @static
   * @param {} params
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {AxiosRequestConfig} [config={}]
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   */
  static fileStoreUploadBigFile(params:any = {}, onUploadProgress: (progressEvent: ProgressEvent) => (void), errorMessageMode: ErrorMessageMode = 'message',  options: RequestOptions = { isTransformResponse: false }) {
    return defHttp.uploadFile({ url: FileStoreUrl.fileStoreUploadBigFile, onUploadProgress }, params, { errorMessageMode, ...options });
  }
  
  /**
   * 下载文件
   * 
   *
   * @static
   * @param {*} fileHex
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static fileStoreDownload(fileHex: string, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.fileStoreDownload + '/' + fileHex, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 查看文件
   * 
   *
   * @static
   * @param {*} fileHex
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static fileStorePdf(fileHex: string, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.fileStorePdf + '/' + fileHex, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 查看图片
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static imageGetByPath(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.imageGetByPath, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 查看图片
   * 
   *
   * @static
   * @param {*} fileHex
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static fileStoreImage(fileHex: string, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.fileStoreImage + '/' + fileHex, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 获取文件信息
   * 
   *
   * @static
   * @param {*} fileHex
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static fileStoreFileInfo(fileHex: string, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.fileStoreFileInfo + '/' + fileHex, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 删除所有文件
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static fileStoreDelAll(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.get({ url: FileStoreUrl.fileStoreDelAll, params, ...config }, { errorMessageMode, ...options });
  }
  
  /**
   * 删除单个文件
   * 
   *
   * @static
   * @param {*} fileHex
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*} 
   */
  static delete_fileStore(fileHex: string, params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.delete({ url: FileStoreUrl.fileStore + '/' + fileHex, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 批量删除多个文件
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static fileStoreBatchDel(params: any = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: FileStoreUrl.fileStoreBatchDel, params, ...config }, { errorMessageMode, ...options });
  }
  
  /*
   * 查询文件列表
   * 
   *
   * @static
   * @param {*} [params={}]
   * @param {ErrorMessageMode} [errorMessageMode='message']
   * @param {RequestOptions} [options={ isTransformResponse: true }]
   * @return {*}
   */
  static fileStoreList(params: QueryBodyWithPageDto = {}, errorMessageMode: ErrorMessageMode = 'message', config: AxiosRequestConfig = {}, options: RequestOptions = { isTransformResponse: true }) {
    return defHttp.post({ url: FileStoreUrl.fileStoreList, params, ...config }, { errorMessageMode, ...options });
  }
  
}