import xhr from './apiserver'

const http = function (parA, parB, parC, parD) {

	let url = ''  //url地址 ***必传***
	let params = null  //请求参数 要求json格式 
	let methodType = ''  //请求类型：post/delete/put/get
	let paramsType = ''  //传参类型：url/json
	let ups
	let currentMT = false //当前自定义请求方式状态
	let currentPT = false //当前自定义传参类型状态

	if (parA) {
		matchFunc(parA)
	}
	if (parB) {
		matchFunc(parB)
	}
	if (parC) {
		matchFunc(parC)
	}
	if (parD) {
		matchFunc(parD)
	}

	//验证URL是否传递
	if (url) {
		ups = url.split('/')
		//验证url的合法性
		if (url[0] !== '/' || ups.length <= 1) {
			console.error('url不合法')
			return Promise.reject('url不合法')
		}
	} else {
		console.error('url不能为空')
		return Promise.reject('url不能为空')
	}
	//验证请求参数合法性
	if (params && typeof params != 'object') {
		console.error('请求参数不合法')
		return Promise.reject('请求参数不合法')
	}

	//验证请求方式合法性
	if (methodType) {
		if (testMethodType(methodType)) {
			currentMT = methodType
		} else {
			console.error('请求方式不合法')
			return Promise.reject('请求方式不合法')
		}
	} 
	//验证传参类型合法性
	if (paramsType) {
		if (testParamsType(paramsType)) {
			currentPT = paramsType
		} else {
			console.error('传参类型不合法')
			return Promise.reject('传参类型不合法')
		}
	} 

	//验证URL是否符合特定格式
	if (ups[3].indexOf('-') === -1) {
		if (!currentMT || !currentPT) {
			console.error('请求方式或传参类型错误')
			return Promise.reject('请求方式或传参类型错误')
		}
	} else {
		if (!currentMT) {
			if (testMethodType(ups[3].split('-')[0])) {
				currentMT = ups[3].split('-')[0]
			} else {
				console.error('请求方式不合法')
				return Promise.reject('请求方式不合法')
			}

		}
		if (!currentPT) {
			if (currentMT === 'get'){
				currentPT = 'url'
			}
			else if (testParamsType(ups[3].split('-')[1])) {
				currentPT = ups[3].split('-')[1]
			} else {
				console.error('参数类型不合法')
				return Promise.reject('参数类型不合法')
			}
		}
	}

	switch (currentMT) {
		case 'get':
			return xhr.get(url, {
				params: params,
				paramsType: currentPT
			})
		case 'post':
			return xhr.post(url, params, { paramsType: currentPT })
		case 'put':
			return xhr.put(url, params, { paramsType: currentPT })
		case 'delete':
			return xhr.delete(url, {
				params: params,
				paramsType: currentPT
			})
		default:
			console.error('请求方式不合法')
			return Promise.reject('请求方式不合法')
	}

	//验证paramsType的合法性
	function testParamsType(type) {
		if (type !== 'json' && type !== 'url') {
			return false
		} else {
			return true
		}
	}

	//验证methodType的合法性
	function testMethodType(type) {
		if (type != 'get' && type != 'post' && type != 'put' && type != 'delete') {
			return false
		} else {
			return true
		}
	}

	//匹配传入参数
	function matchFunc(field) {
		if (field === 'url' || field === 'json') {
			paramsType = field
		} else if (field === 'get' || field === 'post' || field === 'put' || field === 'delete') {
			methodType = field
		} else if (typeof field === 'object') {
			params = field
		} else {
			url = field
		}
	}
}

export default http