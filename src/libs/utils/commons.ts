import { FileStoreUrl } from '/@/api/urls';
import { joinQueryParams, setUrlParam } from './http/axios/helper';

/**
 *
 * 格式化金额数字
 * @static
 * @param {*} val
 * @param {string} [unit='']
 * @param {string} [split=',']
 * @param {string} [defaultVal='0']
 * @return {*}
 * @memberof CommonsUtil
 */
export const formatMoney = (val, split = ',', defaultVal = '0', unit = '') => {
  const num = numFixed(val);
  let resStr = '0';
  if (!num) return defaultVal || resStr;

  // 单位
  switch (unit) {
    case '百万':
      resStr = `${(num / 1000000).toFixed(2)}`;
      break;
    case 'w':
    case 'W':
    case '万':
      resStr = `${(num / 10000).toFixed(2)}`;
      break;
    case 'k':
    case 'K':
    case '千':
      resStr = `${(num / 1000).toFixed(2)}`;
      break;

    default:
      // 默认采用 分隔符 分割数字
      if (split) {
        resStr = splitNum(num, split);
      }

      break;
  }

  return resStr;
};

/**
 * 格式化百分比
 * 将 0.1 转化成 10
 * 将 1 转化成 100
 */
export const formatPercent = (val) => {
  const num = numFixed(Number(val || 0) * 100);
  return splitNum(num);
};

/**
 * 数字精度
 */
export const numFixed = (num, fixed = 2) => {
  return Number(Number(num || 0).toFixed(fixed));
};

/**
 * 分割数字
 *
 * @static
 * @param {*} num
 * @param {string} [split=',']
 * @memberof CommonsUtil
 */
export const splitNum = (num, split = ',') => {
  num = Number(num);
  if (!num) return '0';
  let resStr = '0';
  let numStr = `${num}`.split('.')[0];
  const decimalStr = `${num}`.split('.')[1] || 0;

  const arr: string[] = [];
  while (/\d{3}$/.test(numStr)) {
    arr.unshift(numStr.slice(numStr.length - 3, numStr.length) as string);
    numStr = numStr.slice(0, numStr.length - 3);
  }
  if (numStr) {
    arr.unshift(numStr);
  }

  if (arr.length === 0) {
    resStr = '0';
  } else {
    resStr = arr.join(split);
  }
  // 若有小数
  if (decimalStr) {
    resStr = resStr + '.' + decimalStr;
  }

  return resStr;
};

/**
 * 随机字符串
 * @returns
 */
export const randomStrId = (count = 6) => {
  const temp: any = [];
  for (let i = 0; i < count; i++) {
    temp.push(String.fromCharCode(65 + Math.floor(Math.random() * 24)));
  }
  return temp.reduce((pre, next) => pre + next);
};
/**
 * 填充图片前缀
 *
 * @param {*} val
 * @param {number} [width=0]
 * @return {*}
 */
export const prefixImgUrl = (val: any, width = 0) => {
  // 若是 md5
  if (/^[^/.]+.\w+$/.test(val)) {
    val = `${FileStoreUrl.fileStoreImage}/${val}${width ? '?width=' + width : ''}`;
  } else if (/^http/.test(val)) val = setUrlParam(val, '_t', Date.now());
  else if (/^(\/.*?)+/.test(val)) val = joinQueryParams(FileStoreUrl.imageGetByPath, { filePath: val });
  return val;
};
/**
 * router参数
 * @param url
 * @returns
 */
export const genRouterProps = (url: string) => {
  if (/^http/.test(url)) {
    return {
      path: '/main/iframe',
      query: { src: url }, // encodeURIComponent(url) },
    };
  } else {
    return { path: url };
  }
};

/**
 *
 * 文件大小
 * @param {number} fileSize
 */

export const fileSize = (fileSize = 0) => {
  if (!fileSize) return '';
  const TBNum = Math.floor(fileSize / 1024 / 1024 / 1024 / 1024);
  const GBNum = Math.floor((fileSize - TBNum * 1024 * 1024 * 1024 * 1024) / 1024 / 1024 / 1024);
  const MBNum = Math.floor((fileSize - TBNum * 1024 * 1024 * 1024 * 1024 - GBNum * 1024 * 1024 * 1024) / 1024 / 1024);
  const KBNum = Math.floor((fileSize - TBNum * 1024 * 1024 * 1024 * 1024 - GBNum * 1024 * 1024 * 1024 - MBNum * 1024 * 1024) / 1024);
  const BNum = Math.floor(fileSize - TBNum * 1024 * 1024 * 1024 * 1024 - GBNum * 1024 * 1024 * 1024 - MBNum * 1024 * 1024 - KBNum * 1024);

  if (TBNum) return Number(`${TBNum}.${GBNum}`) + 'TB';
  if (GBNum) return Number(`${GBNum}.${MBNum}`) + 'GB';
  if (MBNum) return Number(`${MBNum}.${KBNum}`) + 'MB';
  if (KBNum) return Number(`${KBNum}.${BNum}`) + 'KB';
  return `${BNum}}B`;
};
