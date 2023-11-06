/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 *
 * https://dayjs.fenxianglu.cn/
 */
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
import isLeapYear from 'dayjs/plugin/isLeapYear';

dayjs.extend(isLeapYear);
dayjs.locale('zh-cn'); // use locale

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date: dayjs.Dayjs | undefined = undefined, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date: dayjs.Dayjs | undefined = undefined, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

// 转化成日期文本
export function toDateStr(val: any, format = DATE_TIME_FORMAT) {
  const date = toDate(val, format);
  if (!date) return '';
  return date.format(format);
}

// 转化成日期对象
export function toDate(val: any, format = DATE_TIME_FORMAT): dayjs.Dayjs {
  let date: any = null;
  if (!val) {
    date = null;
  } else if (/^\d{10,13}$/.test(val)) {
    date = dayjs(Number(`${val}000`.slice(0, 13)));
  } else if (typeof val === 'string') {
    date = dayjs(val, format);
  } else if (val instanceof dayjs.Dayjs) {
    date = val.clone();
  } else if (val instanceof Date) {
    date = dayjs(val.getTime());
  }

  return date;
}

/**
 * 转换Unix时间戳(毫秒)
 *
 * @export
 * @param {*} val
 * @param {*} [format=DATE_TIME_FORMAT]
 * @param {boolean} [millisecond=true] 是否是毫秒(13位)
 * @return {*}  {number}
 */
export function toMillisecond(val: any, format = DATE_TIME_FORMAT): string {
  if (!val) return '';
  const d: dayjs.Dayjs = toDate(val, format);
  return '' + d.valueOf();
}

/**
 * 转换Unix时间戳(秒)
 *
 * @export
 * @param {*} val
 * @param {*} [format=DATE_TIME_FORMAT]
 * @param {boolean} [millisecond=true] 是否是毫秒(13位)
 * @return {*}  {number}
 */
export function toSecond(val: any, format = DATE_TIME_FORMAT): string {
  if (!val) return '';
  const d: dayjs.Dayjs = toDate(val, format);
  return '' + d.unix();
}

export const dateUtil = dayjs;
