// import axios from './axios.js'
import store from './store'
// import config from '~/config.js'

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
	let paramObj = {}, arr= url.split('?')
	if(arr.length>1){
		let keyValueArr = arr[1].split('&')
		keyValueArr.forEach(item => {
			const keyValue = item.split('=')
			paramObj[keyValue[0]] = keyValue[1]
		})
	}
	return paramObj
}
export const setParams = obj => {
	let arr=[]
	for(let key in obj){
		arr.push(`${key}=${obj[key]}`)
	}
	return `?${arr.join('&')}`
}
/**
 * @param {obj} 任意参数
 * @returns {String}
 * @description 判断参数类型
 */
export const getType = (obj) => {
  //tostring会返回对应不同的标签的构造函数
  let toString = Object.prototype.toString;
  let map = {
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  if(obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
}
export const getToken = () => {
  const token = localStorage.getItem('ACCESSTOKEN')
  return token || false
}
export const getUser = () => {
  const val = localStorage.getItem('USERINFO')
  return val ? JSON.parse(val) : false
}
/**
 * @param {data} 任意参数
 * @returns {Object}
 * @description 任意数据深拷贝
 */
export const deepClone = (data) => {
  let type = getType(data);
  let obj;
  if(type === 'array'){
    obj = [];
  } else if(type === 'object'){
    obj = {};
  } else {
    //不再具有下一层次
    return data;
  }
  if(type === 'array'){
    for(let i = 0, len = data.length; i < len; i++){
      obj.push(deepClone(data[i]));
    }
  } else if(type === 'object'){
    for(let key in data){
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
}

export const  base64ToBlob= (dataurl) => {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}

export const imgUrlToBase64 = (url, callBack) => {
	var image = new Image();

	image.onload=function(){

		// for( let key in image){
			// console.log('key', key)
		// }
		// console.log('image.currentSrc', image.currentSrc)
		var width = image.width;
		var height = image.height;
		_compress( url,
			{width: width, height:height, quality: 0.6, type: ''} ,
			image.name,
			callBack
		)
	};
	image.src= url;

}

/**
 * @param {thisfile} 图片文件
 * @param {callBack} 回调函数
 * @returns {base64, filename}
 * @description 图片压缩并转base64
 */
export const imgToBase64 = (thisfile, callBack) => {
  // var file= $(domName).get(0).files[0]
  var file= thisfile
	console.log('size', file.size)
  var reader = new FileReader();
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    var image = new Image();
    var self= this
    image.src= e.target.result;
    image.onload=function(){
      var width = image.width;
      var height = image.height;
      _compress(self.result,
        {width: width, height:height, quality: 0.6, type: file.type} ,
        file.name,
        callBack
      )
    };
  }
}
export const _compress = (path, obj, name, callBack) => {
  var img = new Image();
  img.src = path;
  img.onload = function () {
    var that = this;
    // 默认按比例压缩
    var w = that.width,
      h = that.height,
      scale = w / h;
    w = obj.width || w;
    h = obj.height || (w / scale);
    if(w> 800){
    	w= 800
	    h= 800/scale
    }
    var quality = 0.6;  // 默认图片质量为0.7
    //生成canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // 创建属性节点
    var anw = document.createAttribute("width");
    anw.nodeValue = w;
    var anh = document.createAttribute("height");
    anh.nodeValue = h;
    canvas.setAttributeNode(anw);
    canvas.setAttributeNode(anh);
    ctx.drawImage(that, 0, 0, w, h);
    // 图像质量
    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality;
    }
    // quality值越小，所绘制出的图像越模糊
    var base64 = canvas.toDataURL(obj.type|| 'image/png', quality);
    // var base64 = canvas.toDataURL('image/png', quality);
    // console.log(base64)
    // 返回base64的值
    callBack(base64, name )
  }

}

export const formatMoney =(val, decimals, dec_point, thousands_sep)=> {
  /*
  　　 * 参数说明：
  　　 * number：要格式化的数字
  　　 * decimals：保留几位小数
  　　 * dec_point：小数点符号
  　　 * thousands_sep：千分位符号
  　　 * */
  if(val=== undefined || val=== null ) return ''
  let number = (val + '').replace(/[^0-9+-Ee.]/g, '');
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      let k = Math.pow(10, prec);
      return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  let re = /(-?\d+)(\d{3})/;
  while(re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

/**
 * @param {String|Number} data 各种日期格式
 * @param {String} timeStamp 格式字符串,默认值 yyyy-MM-dd
 * @returns {String} 相对时间字符串
 */
export const formatDate= (value1, format) => {
	if (value1) {
		// console.log('转化之前',value);
		let value= null
		if( typeof value1== 'string'){
			let value2= value1.replace(/-/g,'/')
			value = new Date(value2);
			if(value=='Invalid Date'){
				value= new Date(value1)
			}
		}else{
			value= new Date(value1)
		}

		// console.log('转化hi后',value);
		let o = {
			"M+": value.getMonth() + 1, //month
			"d+": value.getDate(),    //day
			"h+": value.getHours(),   //hour
			"m+": value.getMinutes(), //minute
			"s+": value.getSeconds(), //second
			"q+": Math.floor((value.getMonth() + 3) / 3),  //quarter
			"S": value.getMilliseconds() //millisecond
		}
		if(!format) format='yyyy/MM/dd'
		if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
			(value.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)if (new RegExp("(" + k + ")").test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	} else {
		return '';
	}
};


export const isIos= () => {
	// let u = navigator.userAgent
	let isIOS = !!(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))
	return isIOS
}

export const isWeixn=()=>{
	let ua = navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i)=="micromessenger") {
		return true;
	} else {
		return false;
	}
}


/**
 * @description 改变对象key
 * @param keyObj {Object} key数组对象,每组key长度必须相同
 * @param obj {Object} 要改变key的对象（按情况需使用深拷贝对象）
 * @param before {String} 改变前的key集合
 * @param after {String} 改变后的key集合
 * @returns {Object} 改变key后的对象
 * @使用范例 let turn= new turnKey({
	            key1:['a', 'b'],
				key2:['a1', 'b1'],
				key3:['a2', 'b2'],
			})
            console.log( turn({a: 123, b:456}, 'key1', 'key3'))  //{a2: 123, b2:456}
 */
export const turnKey= function(keyObj){
	return (obj, before, after)=>{
		let res= {}
		for(let key in obj){
			for(let i in keyObj[before]){
				if(keyObj[before][i]== key){
					res[keyObj[after][i]]= obj[key]
				}
			}
		}
		return res
	}
}

export const reg={
	idcard: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
	vehicle: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/,
	vin: /^[A-Z0-9]{17}$/,
	name:/^[\u4E00-\u9FA5]{2,5}$/,
	mobile: /^1[3456789]\d{9}$/,
}

export const getUrlParam= (name)=> {
	let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	let r = window.location.search.substr(1).match(reg);
	// if(r!=null)return  unescape(r[2]); return null;
	if(r!=null)return r[2];
	return null;
}


export const getWeixinId=()=>{
	if(isWeixn()){
		let unionid= localStorage.getItem("UNIONID");
		let state= getUrlParam('state')
		let URL = encodeURIComponent(window.location.href)
		if( !unionid &&!state){
			let appId = config.appid
			window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${URL}&response_type=code&scope=snsapi_userinfo&state=snsapi_base#wechat_redirect`
		}
		if(!unionid && state=='snsapi_base'){
			// console.log("getUrlParam('code')", getUrlParam('code'))
			axios.axiosHxx({
				url: '/operate/controller/wxlogin',
				method: 'post',
				data: {
					code: getUrlParam('code'),
				}
			}).then(res=>{
				if(res.data.success) {
					// this.UnionID = res.data.openId.openId
					localStorage.setItem("UNIONID",res.data.data.unionid);
					localStorage.setItem("OPENID",res.data.data.openid);
					history.replaceState(null, null, window.location.origin + window.location.hash)
				}
			})
		}

		let shareLink= getUrlParam('share')
		if(shareLink){
			// alert(decodeURIComponent(shareLink))
			window.location.href=window.location.origin + decodeURIComponent(shareLink)
		}
	}
}

export const getwxticket= (jsApiList, callback) => {
	axios.axiosQixiu.get('/weixin/hxx/ticket/jsapi?url='+ (window.location.href.split('#')[0]),
		{constBaseUrl: true}).then(res=>{
		// axios.get('/weixin/qixiu/ticket/jsapi?url='+('http://192.168.169.121:8888?code=0716QWVV0hJ0b22adjVV0QF6WV06QWVe&state=snsapi_base')).then(res=>{
		wx.config({
			debug: false,
			appId: config.appid,
			timestamp: res.data.timeStamp,
			nonceStr: res.data.uuid,
			signature: res.data.signature,
			jsApiList: jsApiList
		})
	})
}

export const getLocation= ()=>{
	return new Promise((resolve, reject) => {
		if(store.state.app.location.success){
			resolve(true)
		}else{
			AMap.plugin('AMap.Geolocation', () => {
				let geolocation = new AMap.Geolocation({
					// timeout: 2000,
				});
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', (res)=>{
					console.log('getLocation.res', JSON.stringify(res) )
					store.commit('setLocation', {
						success: true,
						lng: res.position.lng,
						lat: res.position.lat,
						address: res.formattedAddress,
						citycode: res.addressComponent.citycode,
						adcode: res.addressComponent.adcode,
						province: res.addressComponent.province,
						city: res.addressComponent.city,
					})
					resolve(true)
				});
				AMap.event.addListener(geolocation, 'error', (err)=>{
					// console.log(err)
					resolve(false)
				});
			});
		}
	});
}

export const cityIsSupport= (getItem)=>{
	let hasCity= false, thisCityCode= store.state.app.city.regionId, confList= config.location
	if(thisCityCode){
		let code= thisCityCode.toString().substring(0, 3)
		for(let i in confList){
			if(confList[i].adcode.toString().substring(0, 3)==code) {
				hasCity= getItem? confList[i]: code
			}
		}
	}
	return hasCity
}

export const getCityToken= ()=>{
	let qixiutoken= store.state.user.qixiutoken, nowCode= cityIsSupport()
	let useToken= nowCode? qixiutoken[nowCode+ 'qxToken'] : false
	return useToken
}

export const getTimeAgo = (time_str)=>{
	var now = new Date();
	var date = new Date(time_str.replace(/-/g,'/'));
//计算时间间隔，单位为分钟
	var inter = parseInt((now.getTime() - date.getTime())/1000/60);
	if(inter == 0){
		return "刚刚";
	}
//多少分钟前
	else if(inter < 60){
		return inter.toString() + "分钟前";
	}
//多少小时前
	else if(inter < 60*24){
		return parseInt(inter/60).toString() + "小时前";
	}
//本年度内，日期不同，取日期+时间  格式如  06-13 22:11
	else if(now.getFullYear() == date.getFullYear()){
		return ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2)
			// + " " + date.getHours() + ":" + date.getMinutes();
	}
	else{
		return date.getFullYear().toString().substring(2, 3)
			+ "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2)
			// + " " + date.getHours() + ":" + date.getMinutes();
	}
}
//车架号校验码校验
export  const checkVin = (str)=>{
    if(str.length != 17){
        return false;
    }
    var vin = {
        "0":0,
        "1":1,
        "2":2,
        "3":3,
        "4":4,
        "5":5,
        "6":6,
        "7":7,
        "8":8,
        "9":9,
        "A":1,
        "B":2,
        "C":3,
        "D":4,
        "E":5,
        "F":6,
        "G":7,
        "H":8,
        "J":1,
        "K":2,
        "L":3,
        "M":4,
        "N":5,
        "P":7,
        "R":9,
        "S":2,
        "T":3,
        "U":4,
        "V":5,
        "W":6,
        "X":7,
        "Y":8,
        "Z":9,
    }
    var power = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
    var value = 0;
    for(let i =0;i<str.length;i++){
        if(!vin[str[i]] && str[i] != 0){
            return false;
        }else{
            value += vin[str[i]] * power[i];
        }
    }
    var y =  value % 11;
    //转X为10
    var x = 0;
    if(str[8] == "X") x = 10
    else x = str[8];
    if(y == x){
        return true;
    }else{
        return false;
    }
}
