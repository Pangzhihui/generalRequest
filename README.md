# <center>通用的api调用方法<center>

### restful接口格式规范:
##### http(s)://ip:prt/应用名/模块名/ ```diff -[get][post]-[url][json]``` /具体业务名 
 
ps：请注意红色区域规则

示例：http://localhost:8080/cloudbus/common/<font color=red >get-url</font>/getEnumDic

---
### 通用的api调用方法:
#### 一、方法介绍:

http.js

```javascipt
const http = function (parA, parB, parC, parD) {
	let url = ''  //url地址 ***必传***
	let params = null  //请求参数 要求json格式 
	let methodType = ''  //请求类型：post/delete/put/get
	let paramsType = ''  //传参类型：url/json  
	... //javascipt
}
export default http
```

返回值：返回一个prosmise对象

#### 二、使用说明:

<font color=#3366FF>1.在main.js文件中引入http和xhr，并在Vue原型上进行定义</font>

```javascipt
import http from './assets/api/http.js'
import xhr from './assets/api/apiserver.js'

Vue.prototype.$http = http
Vue.prototype.$xhr = xhr //javascipt

```

<font color=#3366FF>2.在页面中调用</font>

<font color=#46ace8>接口为规范格式时：</font>    
       
```javascipt
this.$http('/cloudbus/refCheck/get-url/getRefCheckPageList',{
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  }); //javascipt
```
<font color=#46ace8>接口为非规范格式时，注意提供第三和第四个参数：</font>

```javascipt
this.$http('/cloudbus/refCheck/getRefCheckPageList',{
    firstName: 'Fred',
    lastName: 'Flintstone'
  },'get','url')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  }); //javascipt
```



<font color=#46ace8>同时，也兼容以前的api调用方式：</font>
	

```javascipt
this.$xhr.get('/cloudbus/refCheck/getRefCheckPageList',{
    params:{
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
}).then(function (response) {
    console.log(response);
}).catch(function (error) {
    console.log(error);
}); //javascipt

```
