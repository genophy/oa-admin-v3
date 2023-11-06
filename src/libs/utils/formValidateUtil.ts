import { FormValidateRegxUtil } from './formValidateRegxUtil';

export const FormValidateUtil = {
  /**
   * 不能包含中文
   * @param _rule
   * @param value
   * @param callback
   */
  noChinese(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.noChinese(value)) callback();
    else callback(new Error('不能含有中文'));
  },

  /**
   * 项目名称
   * @param _rule
   * @param value
   * @param callback
   */
  projectName(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.projectName(value)) callback();
    else callback(new Error('项目名为1-50位中文或英文字母'));
  },

  /**
   * 姓名
   * @param _rule
   * @param value
   * @param callback
   */
  name(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.name(value)) callback();
    else callback(new Error('姓名为1-20位中文或英文字母'));
  },

  /**
   * 邮箱
   * @param _rule
   * @param value
   * @param callback
   */
  email(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.email(value)) callback();
    else callback(new Error('请输入合法邮箱'));
  },

  /**
   * 校验relation-url  /xxx/xxxx/xxx.xx/xx
   * @param _rule
   * @param value
   * @param callback
   */
  relationUrl(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.relationUrl(value)) callback();
    else callback(new Error('请输入合法url'));
  },

  /**
   * 校验网络url http://xxx.xxx
   * @param _rule
   * @param value
   * @param callback
   */
  webUrl(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.webUrl(value)) callback();
    else callback(new Error('请输入合法的url'));
  },

  /**
   * 校验ip
   * @param _rule
   * @param value
   * @param callback
   */
  ip(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.ip(value)) callback();
    else callback(new Error('请输入合法IP'));
  },

  /**
   * 可为负数的数字，可有小数点
   * @param _rule
   * @param value
   * @param callback
   */
  number(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.number(value)) callback();
    else callback(new Error('请输入合法数字'));
  },

  /**
   * 只能是正数的数字，可有小数点
   * @param _rule
   * @param value
   * @param callback
   */
  numberPositive(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.numberPositive(value)) callback();
    else callback(new Error('请输入不小于0的数字'));
  },

  /**
   * 可为负数的小数点后两位数字
   * @param _rule
   * @param value
   * @param callback
   */
  numberD2(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.numberPositive(value)) callback();
    else callback(new Error('请输入不小于0的数字'));

    if (!/^-?(0|[1-9]\d*)(\.\d)?$/.test(value)) {
      callback(new Error('请输入合法数字'));
    } else if (!/^-?(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
      callback(new Error('输入的数字，只能精确到小数点后两位'));
    } else {
      callback();
    }
  },

  /**
   * 只能是正数的小数点后两位数字
   * @param _rule
   * @param value
   * @param callback
   */
  numberPositiveD2(_rule, value, callback) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
      callback(new Error('请输入不小于0的数字'));
    } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
      callback(new Error('输入的数字，只能精确到小数点后两位'));
    } else {
      callback();
    }
  },

  /**
   * 只能是正数的小数点后一位数字
   * @param _rule
   * @param value
   * @param callback
   */
  numberPositiveD1(_rule, value, callback) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
      callback(new Error('请输入不小于0的数字'));
    } else if (!/^(0|[1-9]\d*)(\.\d)?$/.test(value)) {
      callback(new Error('输入的数字，只能精确到小数点后一位'));
    } else {
      callback();
    }
  },

  /**
   * 只能是整数的数字
   * @param _rule
   * @param value
   * @param callback
   */
  integer(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.integer(value)) callback();
    else callback(new Error('请输入整数'));
  },

  /**
   * 只能是正整数的数字
   * @param _rule
   * @param value
   * @param callback
   */
  integerPositive(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.integerPositive(value)) callback();
    else callback(new Error('请输入正整数'));
  },

  /**
   * 身份证
   * @param _rule
   * @param value
   * @param callback
   */
  idCard(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.idCard(value)) callback();
    else callback(new Error('身份证格式有误'));
  },

  /**
   * 手机号
   * @param _rule
   * @param value
   * @param callback
   */
  phone(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.phone(value)) callback();
    else callback(new Error('11位手机号格式有误'));
  },

  /**
   * 微信OpenId
   * @param _rule
   * @param value
   * @param callback
   */
  weChatOpenId(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.weChatOpenId(value)) callback();
    else callback(new Error('openId格式有误'));
  },

  /**
   * 必须同时包含字母与数字
   * @param _rule
   * @param value
   * @param callback
   */
  onlyLetterNumber(__rule, value, callback) {
    if (!value || FormValidateRegxUtil.onlyLetterNumber(value)) callback();
    else callback(new Error('必须同时包含字母与数字'));
  },

  /**
   * 只能包含中文字母和数字
   * @param _rule
   * @param value
   * @param callback
   */
  zhLetterAndNumber(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.zhLetterAndNumber(value)) callback();
    else callback(new Error('只能输入中文，字母与数字'));
  },

  /**
   * 只能包含字母和数字
   * @param _rule
   * @param value
   * @param callback
   */
  letterAndNumber(_rule, value, callback) {
    if (!value || FormValidateRegxUtil.letterAndNumber(value)) callback();
    else callback(new Error('只能输入字母与数字'));
  },

  /**
   * 验证第一个密码，必须要与第二个确认密码配合使用
   *
   *      formRule: {
   *          password: [
   *              { validator: (_rule, value, callback)=> { ViewDesignValidateUtil.password1(this.$refs.formField1Ref, 'password2')(_rule, value, callback); } }
   *          ]
   *      }
   * @param formRef               表单Ref对象
   * @param password2FieldName    第二个确认密码的字段名
   * @returns {function(...[*]=)}
   */
  password1of2(formRef, password2FieldName) {
    return (_rule, value, callback) => {
      if (value.length < 6 || !(/[a-z]/i.test(value) && /[0-9]/.test(value))) {
        callback(new Error('新密码必须为6-20位字母+数字组合，支持特殊字符'));
      } else {
        if (formRef.model[password2FieldName] !== '') {
          // 对第二个密码框单独验证
          formRef.validateField(password2FieldName);
        }
        callback();
      }
    };
  },

  /**
   * 验证第二个确认密码，必须要与第一个密码配合使用
   *      formRule: {
   *          password2: [
   *              { validator: (_rule, value, callback)=> { ViewDesignValidateUtil.password1(this.$refs.formField1Ref, 'password')(_rule, value, callback); } }
   *          ]
   *      }
   * @param formRef               表单Ref对象
   * @param password1FieldName    第一个密码的字段名
   * @returns {function(...[*]=)}
   */
  password2of2(formRef, password1FieldName) {
    return (_rule, value, callback) => {
      if (value !== formRef.model[password1FieldName]) {
        // 与第一个密码进行对比
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };
  },
};
