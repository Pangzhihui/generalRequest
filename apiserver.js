import {
	TIMEOUT,
	ERR_OK,
	baseURL,
	STATUS
} from './config'
import axios from 'axios'
import qs from 'qs'
import {
	Message
} from 'element-ui'
import router from '../../router'

axios.defaults.withCredentials = true;

/**
 * 将中文转换为 ASCII 码
 * @param  {Object} params {key: '汉字'}
 * @return {Object}        {key: '%E6%B1%89%E5%AD%97'}
 */
export const handleChinese = function (params) {
	const pattern = new RegExp('[\u4E00-\u9FA5]+') // 正则匹配中文字符
	let newObj = {}
	for (let i in params) {
		if (pattern.test(params[i])) {
			newObj[i] = encodeURI(params[i])
		} else {
			newObj[i] = params[i]
		}
	}
	return newObj
}

// axios 配置
const xhr = axios.create({
	// 配置开发和生产环境不同的接口
	baseURL: baseURL,
	timeout: TIMEOUT,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	// withCredentials: true
})

//添加请求拦截器
xhr.interceptors.request.use(
	function (config) {
		if (config.paramsType) {
			if (config.paramsType === 'url') {
				let datas = {}
				//在post-url、put-url情况下，参数使用config.data转换为url上的查询参数
				if (config.method === 'post' || config.method === 'put') {
					datas = config.data
					config.data = qs.stringify(config.data)
				} else {
					datas = config.params
				}
				config.params = {
					_t: new Date().getTime(),
					...datas
				}
				config.url = encodeURI(config.url);
				return config
			}

			if (config.paramsType === 'json') {
				config.headers['Content-Type'] = 'application/json;charset=UTF-8';
				return config
			}
		}else {
			if (config.method === 'post' || config.method === 'put') {
				config.headers['Content-Type'] = 'application/json;charset=UTF-8';
				return config
			}

			// 采用完全自定义的方式书写 get 的请求时，将 post请求中放在 data 里面的数据，放到 params当中
			if (config.method === 'get' && config.data && Object.keys(config.data).length) {
				config.params = qs.parse(config.data)
				return config
			}

			// 简单的调用 get 请求
			if (config.method === 'get') {
				config.params = {
					_t: new Date().getTime(),
					...config.params,
				}
				config.url = encodeURI(config.url);
				// let params = handleChinese(config.params)         // 中文字符替换成 ASCII 码
				// config.url += '?' + qs.stringify(params, { encode: false })
				// config.params = {}

				return config
			}
		}


		

		
	},
	function (error) {
		//请求错误时做些事
		return Promise.reject(error)
	}
)

// 添加响应拦截器
xhr.interceptors.response.use(
	function (response) {
		let hasCode = response.data.hasOwnProperty(STATUS);
		if (!hasCode) {
			Message.error('返回数据格式错误！')
			return Promise.reject(response.data)
		}
		if (response.data[STATUS] === ERR_OK) {
			return response.data
		} else if (response.data[STATUS] == 1003) {
			Message.error('用户信息失效，返回登录页！')
			router.replace({
				path: '/login'
			});
		} else {
			Message.error(response.data.msg)
			// 接口异常返回
			const flag = parseInt(response.data[STATUS], 10)
			const msg =
				flag === 201 ?
					'201 error: Missing parameter' :
					flag === 202 ?
						'202 error: Parameter is malformed' :
						flag === 500 ?
							'500 error: Background error' :
							flag === '501' ? '501 error: No data' : flag === '502' ? '502 error: Session expired' : 'Unknown error'
			console.error(msg)
			return Promise.reject(response.data)
		}
	},
	function (error) {
		Message.error(error.message)
		return Promise.reject(error)
	}
)

export default xhr