export const FormValidateRegxUtil = {
  /**
   * 不能包含中文
   * @param value
   */
  noChinese(value) {
    return !/[\u4e00-\u9fa5]/g.test(value);
  },
  projectName(value) {
    return /^[\u4e00-\u9fa5a-z]{1,50}$/i.test(value);
  },

  /**
   * 中文姓名
   * @param value
   */
  name(value) {
    return /^[\u4e00-\u9fa5a-z]{1,20}$/i.test(value);
  },

  /**
   * 邮箱
   * @param value
   */
  email(value) {
    return /^([^\.@\W]+)(\.[^\.@\W]+)*@([^\.@\W]+)(\.[^\.@\W]+)+$/.test(value);
  },

  /**
   * 校验relation-url  /xxx/xxxx/xxx.xx/xx
   * @param value
   */
  relationUrl(value) {
    return /^(\/([0-9a-z_\-#()])+)*(\/([0-9a-z_\-#.()])+)$/i.test(value);
  },

  /**
   * 校验网络url http://xxx.xxx
   * @param value
   */
  webUrl(value) {
    return /^http(s)?:\/\/[^.\s]+(\.[^.\s]+)+$/.test(value) && !/^\//.test(value) && !/\/$/.test(value);
  },

  /**
   * 校验ip
   * @param value
   */
  ip(value) {
    return /^([0-9]{1,3}.){3}[0-9]{1,3}$/.test(value) && value.split('.').filter((v) => Number(v) && Number(v) >= 0 && Number(v) <= 255).length === 4;
  },

  /**
   * 可为负数的数字，可有小数点
   * @param value
   */
  number(value) {
    return /^-?(0|[1-9]\d*)(\.\d+)?$/.test(value);
  },

  /**
   * 只能是正数的数字，可有小数点
   * @param value
   */
  numberPositive(value) {
    return /^(0|[1-9]\d*)(\.\d+)?$/.test(value);
  },

  /**
   * 只能是整数的数字
   * @param value
   */
  integer(value) {
    return /^-?(0|[1-9]\d*)$/.test(value);
  },

  /**
   * 只能是正整数的数字
   * @param value
   */
  integerPositive(value) {
    return /^(0|[1-9]\d*)$/.test(value);
  },

  /**
   * 身份证
   * @param value
   */
  idCard(value) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
  },

  /**
   * 手机号
   * @param value
   */
  phone(value) {
    return /^1[3456789]\d{9}$/.test(value);
  },

  /**
   * 微信OpenId
   * @param value
   */
  weChatOpenId(value) {
    return /^[a-z0-9_\-=]{28}$/i.test(value);
  },

  /**
   * 必须同时包含字母与数字
   * @param value
   */
  onlyLetterNumber(value) {
    return /^([0-9]+[a-z0-9]*[a-z]+[a-z0-9]*|[a-z]+[a-z0-9]*[0-9]+)+[a-z0-9]*$/i.test(value);
  },

  /**
   * 只能包含中文字母和数字
   * @param value
   */
  zhLetterAndNumber(value) {
    // 后台不支持下划线查询所以除去下划线
    return /^([\u4e00-\u9fa5]|[a-z0-9])*$/i.test(value);
  },

  /**
   * 只能包含字母和数字
   * @param value
   */
  letterAndNumber(value) {
    return /^[a-z0-9]*$/i.test(value);
  },
};
