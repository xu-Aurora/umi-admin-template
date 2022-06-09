import NProgress from 'nprogress';
import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';
import { stringify } from 'qs';
import customStorage from '@/assets/customStorage'

NProgress.configure({ 
  // 动画方式
  easing: 'ease',
  // 递增进度条的速度
  speed: 500,
  // 是否显示加载ico
  showSpinner: false,
  // 自动递增间隔
  trickleSpeed: 200,
  // 初始化时的最小百分比
  minimum: 0.3 
}) 

let num: number = 0;
function starting() {
  if (num === 0) {
    NProgress.start();
  }
  num++;
}

function ending() {
  num--;
  if (num <= 0) {
    NProgress.done();
  }
}

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}


/**
 * 捕获浏览器异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText

    message.error(errorText)
  }
  return response
}

const token = customStorage.getItem('token');

const request = extend({
  // @ts-ignore
  prefix: apiUrl, // 前缀，统一设置 url 前缀
  // 超时时间
  timeout: 1000 * 30,   
  throwErrIfParseFail: true,
  // 处理传数组到后端数据格式问题
  paramsSerializer: params => stringify(params, { indices: false }),
  // get请求不缓存
  validateCache: () => false,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  // 默认错误处理
  errorHandler
})


// request拦截器
request.interceptors.request.use((url, options) => {
  starting();

  return { url, options }
})


// response拦截器, 处理response
request.interceptors.response.use(async response => {

  if (response) {
    ending();
    const data = await response.clone().json()

    if (!data.success) {
      message.error(data.msg)
    } 
    return Promise.resolve(data.response)
  } else {
    message.error('无服务');
  }
})

export default request