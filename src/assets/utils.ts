import routes from '@/components/menus'
import ErrorPage from '@/pages/403'

/**
 * 判断是否为空
 */
function isEmpty(value: any) {
	switch (typeof value) {
		case 'undefined':
			return true
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
			break
		case 'boolean':
			if (!value) return true
			break
		case 'number':
			if (value === 0 || isNaN(value)) return true
			break
		case 'object':
			if (value === null || value.length === 0) return true
			for (const i in value) {
				return false
			}
			return true
	}
	return false
}

/**
 * 以递归的方式展平react router数组
 * @param {object[]} arr 路由数组
 * @param {string} child 需要递归的字段名
 */
const flattenRoutes = (arr: CommonObjectType<unknown>[]) =>
  arr.reduce((prev: CommonObjectType<unknown>[], item: CommonObjectType<unknown>) => {
    if (Array.isArray(item.routes)) {
      prev.push(item)
    }
    return prev.concat(
      Array.isArray(item.routes) ? flattenRoutes(item.routes) : item
    )
  },
  []
)

/**
 * 根据路径获取路由的name和key
 * @param {string} path 路由
 */
const getKeyName = (path: string = '/403') => {
  const truePath = path.split('?')[0]
  const curRoute = flattenRoutes(routes).filter(
    (item: { path: string | string[] }) => item.path.includes(truePath)
  )
  if (!curRoute[0])
    return { title: '暂无权限', tabKey: '403', component: ErrorPage }
  const { name, key, component } = curRoute[0]
  return { title: name, tabKey: key, component }
}


/**
 * base64转excel
 * @param data base64数据
 * @param name excel名字
 */
function base64ToExcel(data: string, name: string) {
  const raw = window.atob(data)
  const uInt8Array = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  const link = document.createElement("a");
  const blob = new Blob([uInt8Array],{
    type: 'application/vnd.ms-excel'
  })

  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${name}.xls`);

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

/**	金钱价格，三位加逗号
 *  @param { number } 
 */
function formatPrice(val: number) {
  let value
  if (typeof val !== 'undefined') {
    if (val.toString().includes('.')) {
      value = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      value = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.00'
    }
  } else {
    value = 0
  }
  return value
}

/** 千位逗号分割
 * @param {*} num   数字
 * @param {*} fixed   保留几位小数
 */
function splitThousand(num: any, fixed?: number) {
  if (!isEmpty(num)) {
    if (typeof num !== 'number') {
      num = parseFloat(num)
    }
    const reg = /\B(?=(\d{3})+$)/g
    num = num.toString().split('.')
    fixed = fixed == undefined ? 2 : fixed
  
    num[0] = num[0].replace(reg, ',')
    num[1] = num[1]
      ? num[1].substr(0, fixed)
      : '00000000000000000'.substr(0, fixed)
    if (num[1].length === 1) {
      num[1] = `${num[1]}0`
    }
    return fixed ? num.join('.') : num[0]
  } else {
    return 0
  }
}

/** 给一串数字添加‘*’
 *
 * @param {*} str  字符串
 * @param {*} frontLen 前面保留位数
 * @param {*} endLen 后面保留位数
 */
const plusXing = (str: string, frontLen = 3, endLen = 4) => {
  if (!isEmpty(str)) {
    const len = str.length - frontLen - endLen
    let xing = ''
    for (let i = 0; i < len; i++) {
      xing += '*'
    }
    return str.substr(0, frontLen) + xing + str.substr(str.length - endLen)
  } else {
    return 0
  }
}


// 正则
const regex = (value: string) => {
  const obj: { [key: string]: RegExp } = {
    number: /^\d+$/, // 数字
    url: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i, // url
    numberLetter: /^[a-z0-9]+$/i, // 数字与字母
    bankCode: /^[1-9]\d{9,29}$/, // 银行卡号
    email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, // 邮箱
    postalcode: /^[1-9]\d{5}(?!\d)$/, // 邮编
    outerPhone: /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/, // 座机电话
    phone: /^\d{11}$/, // 11位数字
    cusCertNo: /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g, // 营业执照
    fax: /^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/, // 传真
    wx: /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/, // 微信
    qq: /^[1-9][0-9]{4,10}$/, // QQ
    version: /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/, // 版本号
    keyWord: /#\w+#/g, // 关键词，以#开始以#结尾，  #123#
    password: /^(?![a-zA-Z0-9]+$)(?![a-zA-Z._&*@#!~$^\\.?]+$)(?![0-9._&*@#!~$^\\.?]+$)([a-zA-Z0-9._&*@#!~$^\\.?]{8,16})$/, // 包含数字，大写字母或小写字母，特殊符号
    money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, // 金额
    Organization: /[0-9A-HJ-NPQRTUWXY]{8}-[0-9A-HJ-NPQRTUWXY]/ // 组织机构代码
    // password: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,     // 包含数字，大写字母,小写字母，特殊符号
  }

  return obj[value]
}


export {
  isEmpty,
  flattenRoutes,
  getKeyName,
  base64ToExcel,
  formatPrice,
  splitThousand,
  plusXing,
  regex
}