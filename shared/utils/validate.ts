/**
 * 判断是否为空
 * @param val 数据
 */
export const validateNull = (val: any) => {
  if (typeof val === 'boolean') {
    return false
  }

  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    )
      return true
    return false
  }
  return false
}

export const rule = {
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  noSymbol(rule: any, value: any, callback: any) {
    const acount = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value && !acount.test(value)) {
      callback(new Error('请输入中文、英文、数字包括下划线'))
    } else {
      callback()
    }
  },
  /**
   * 校验 请输入大写英文、下划线
   * 名称校验
   */
  capital(rule: any, value: any, callback: any) {
    const acount = /^[A-Z_]+$/
    if (value && !acount.test(value)) {
      callback(new Error('请输入大写英文、下划线'))
    } else {
      callback()
    }
  },

  /**
   * 校验 请输入小写英文、下划线
   * 名称校验
   */
  lowercase(rule: any, value: any, callback: any) {
    const acount = /^[a-z_]+$/
    if (value && !acount.test(value)) {
      callback(new Error('请输入小写英文、下划线'))
    } else {
      callback()
    }
  },

  /**
   * 校验 请输入小写英文
   * 名称校验
   */
  lowercaseOnly(rule: any, value: any, callback: any) {
    const acount = /^[a-z]+$/
    if (value && !acount.test(value)) {
      callback(new Error('请输入小写英文'))
    } else {
      callback()
    }
  },

  /**
   * 校验首尾空白字符的正则表达式
   *
   */
  checkSpace(rule: any, value: any, callback: any) {
    const longrg = /[^\s]+$/
    if (!longrg.test(value)) {
      callback(new Error('请输入非空格信息'))
    } else {
      callback()
    }
  },

  /**
   * 校验手机号
   */
  mobile(rule: any, value: any, callback: any) {
    // var isPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    var isPhone = /^[1][3,4,5,6,7,8][0-9]{9}$/

    if (value.indexOf('****') >= 0) {
      return callback()
    }

    if (!isPhone.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  },

  /**
   * 校验身份证号
   */
  idCard(rule: any, value: any, callback: any) {
    var isPhone =
      /^(\d{6})(18|19|20)?(\d{2})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])(\d{3})(\d|X|x)$/
    if (!isPhone.test(value)) {
      callback(new Error('请输入合法身份证号'))
    } else {
      callback()
    }
  },

  /* 数字 */
  number(rule, value, callback) {
    validateFn('number', rule, value, callback, '包含非数字字符')
  },

  /* 字母 */
  letter(rule, value, callback) {
    validateFn('letter', rule, value, callback, '包含非字母字符')
  },

  /* 字母和数字 */
  letterAndNumber(rule, value, callback) {
    validateFn('letterAndNumber', rule, value, callback, '只能输入字母或数字')
  },

  /* 手机号码 */
  phone(rule, value, callback) {
    validateFn('mobilePhone', rule, value, callback, '手机号码格式有误')
  },

  /* 开户行联行号 */
  interbank(rule, value, callback) {
    validateFn('InterbankNumber', rule, value, callback, '开户行联行号格式有误')
  },

  /* 统一社会信用代码 */
  socialCode(rule, value, callback) {
    validateFn('socialCode', rule, value, callback, '开户行联行号格式有误')
  },
  // /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
  // /^\d{12}$/

  /* 字母开头，仅可包含数字 */
  letterStartNumberIncluded(rule, value, callback) {
    validateFn(
      'letterStartNumberIncluded',
      rule,
      value,
      callback,
      '必须以字母开头，可包含数字'
    )
  },

  /* 禁止中文输入 */
  noChinese(rule, value, callback) {
    validateFn('noChinese', rule, value, callback, '不可输入中文字符')
  },

  /* 必须中文输入 */
  chinese(rule, value, callback) {
    validateFn('chinese', rule, value, callback, '只能输入中文字符')
  },

  /* 电子邮箱 */
  email(rule, value, callback) {
    validateFn('email', rule, value, callback, '邮箱格式有误')
  },

  /* URL网址 */
  url(rule, value, callback) {
    validateFn('url', rule, value, callback, 'URL格式有误')
  },

  regExp(rule, value, callback) {
    if (validateNull(value) || value.length <= 0) {
      callback()
      return
    }

    const pattern = new RegExp(rule.regExp)

    if (!pattern.test(value)) {
      const errTxt = rule.errorMsg || 'invalid value'
      callback(new Error(errTxt))
    } else {
      callback()
    }
  }
}

/**
 * @desc  [自定义校验规则]
 * @example
 *  import { validateRule } from "@/utils/validateRules";
 *  rules: [
 *     { validator: validateRule.emailValue, trigger: 'blur'}
 *  ]
 */

export const getRegExp = function (validatorName) {
  const commonRegExp = {
    number: '^[-]?\\d+(\\.\\d+)?$',
    letter: '^[A-Za-z]+$',
    letterAndNumber: '^[A-Za-z0-9]+$',
    mobilePhone: '^[1][3-9][0-9]{9}$',
    letterStartNumberIncluded: '^[A-Za-z]+[A-Za-z\\d]*$',
    noChinese: '^[^\u4e00-\u9fa5]+$',
    chinese: '^[\u4e00-\u9fa5]+$',
    email: '^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$',
    url: '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]',
    InterbankNumber: /^\d{12}$/,
    socialCode: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
    // '^[0-9ABCDEFGHJKLMNPQRTUWXY]{2}d{6}[0-9ABCDEFGHJKLMNPQRTUWXY]{10}$'
    // ^\d{12}$
  }
  return commonRegExp[validatorName]
}

const validateFn = (validatorName, rule, value, callback, defaultErrorMsg) => {
  if (validateNull(value) || value.length <= 0) {
    callback()
    return
  }

  const reg = new RegExp(getRegExp(validatorName))

  if (!reg.test(value)) {
    const errTxt = rule.errorMsg || defaultErrorMsg
    callback(new Error(errTxt))
  } else {
    callback()
  }
}
