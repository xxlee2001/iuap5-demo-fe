import AcTips from 'ac-tips';
import cloneDeep from 'clone-deep';
import request from 'utils/request';
import 'ac-tips/build/AcTips.css';

export const Success = (msg) => {
    AcTips.create({ content: msg, type: 'success', duration: 3000, })
}

export const Error = (msg) => {
    AcTips.create({ content: msg, type: 'error', duration: 3000, })
}

export const Warning = (msg) => {
    AcTips.create({ content: msg, type: 'warning', duration: 3000, })
}

export const Info = (msg) => {
    AcTips.create({ content: msg, color: 'info', duration: 3000 });
}
/**
 * 数据返回统一处理函数
 * @param {*} response
 * @param {*} successMsg 成功提示
 */
export const processData = (response, successMsg) => {
    let result = {};
    try {
        if (typeof response != 'object') {
            Error('数据返回出错：1、请确保服务运行正常；2、请确保您的前端工程代理服务正常；3、请确认您已在本地登录过应用平台');
            return { result: null };
        }
        if (response.code == '200') {
            if (successMsg) {
                Success(successMsg);
            }
            result.status = 'success';
            result.data = response.data;
            return { result };
        } else {
            Error(`${response.message || 'request error'}`);
            result.status = 'error';
            return { result };
        }
    } catch (e) {
        return { result };
    }
}

/**
 * param拼接到url地址上
 * @param {*} url
 * @param {*} params
 * @param {*} prefix
 */
export const paramToUrl = (url, params, prefix) => {
    if (!prefix) prefix = '';
    if (url.indexOf('?') == -1) {
        url += '?r=' + Math.random();
    }
    for (let attr in params) {
        if ((attr == 'pageIndex') || (attr == 'pageSize')) {
            url += '&' + attr + '=' + params[attr];
        } else {
            url += '&' + prefix + attr + '=' + params[attr];
        }
    }
    return url;
}

/**
 * json转换指定的前缀
 * @param {JSON} json
 * @param {JSON} prefix
 */
export const jsonToUrl = (json, prefix = "search_") => {
    let obj = {};
    for (let attr in json) {
        if ((attr == 'pageIndex') || (attr == 'pageSize')) {
            obj[`${attr}`] = json[attr];
        } else {
            obj[`${prefix}${attr}`] = json[attr];
        }
    }
    return obj;
}

// 后台乱码转换
export const convert = (text) => {
    let element = document.createElement("p");
    element.innerHTML = text;
    let output = element.innerText || element.textContent;
    element = null;
    return output;
}

export const setCookie = (name, value, options) => {

    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    let expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        let date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    let path = options.path ? '; path=' + options.path : '';
    let domain = options.domain ? '; domain=' + options.domain : '';
    let s = [cookie, expires, path, domain, secure].join('');
    let secure = options.secure ? '; secure' : '';
    let c = [name, '=', encodeURIComponent(value)].join('');
    let cookie = [c, expires, path, domain, secure].join('')
    document.cookie = cookie;

}

export const getCookie = (name) => {

    let cookieValue = null;
    if (document.cookie && document.cookie != '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    // 按照总设部规范，调整为下划线
    // if (typeof cookieValue != 'undefined' && cookieValue != null) {
    //     cookieValue = cookieValue.replace(/-/, "_");
    // }
    return cookieValue;
}


/**
 * 生成唯一字符串
 */
export function uuid() {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i += 1) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';
    return s.join('');
}





/**
 *
 * @description 树节点添加子数据
 * @export
 * @param {array} [parentArray=[]]
 * @param {array} [childArray=[]]
 * @returns
 */
export function addChild(parentArray = [], childArray = []) {

    let parentLen = parentArray.length;
    if (parentLen == 0 || childArray.length == 0) {
        return [];
    }
    let parentId = childArray[0].parentId;

    for (let i = 0; i < parentLen; i++) {
        let item = parentArray[i];
        if (item.id === parentId) {
            item['isSon'] = 2;
            let newChildren = [];
            if (Array.isArray(item['children'])) {
                let isObtain = item['children'].some(item => {
                    return item['id'] == (childArray.length && childArray[0]['id']);
                });

                if (!isObtain) {
                    newChildren = cloneDeep(item['children']).concat(childArray);
                } else {
                    newChildren = cloneDeep(item['children']);
                }

            } else {
                newChildren = childArray;
            }
            /* let newChildren = (typeof item['children'] === 'undefined' && !item['children']) ? childArray : cloneDeep(item['children']).concat(childArray);
            item['children'] = newChildren; */
            item['children'] = newChildren;
            break;
        } else {
            let temp = item['children'];
            if (typeof temp !== 'undefined' && Array.isArray(temp) && temp.length) {
                setTimeout(function () {
                    addChild(item['children'], childArray);
                }, 0);

            }
        }
    }

    return parentArray;
}

// 处理子节点,type为0 表示查找; type为1 表示删除
export function handleChild(parentArray, child, type) {
    let parentLen = parentArray.length,
        resChild = {};
    // isDelete = false;

    for (let i = 0; i < parentLen; i++) {
        let item = parentArray[i];
        if (item.id == child.id) {
            if (type === 0) {
                resChild = item;
                return resChild;
            } else {
                parentArray.splice(i, 1);
                return true;
            }
        } else {
            if (typeof item['children'] !== 'undefined') {
                resChild = handleChild(item['children'], child, type);

                // 查找节点
                if (type == 0 && (Object.keys(resChild).length > 0)) {
                    return resChild;
                }

                if (type === 1 && typeof resChild === 'boolean' && resChild) {
                    if (!item['children'].length) {
                        item['isSon'] = 1;
                    }
                }

            }
        }
    }

    return resChild;
}

/**
 * 后端数据附加key
 * @param {*} arrayobject
 */
export function resultDataAdditional(arrayobject) {
    if (Array.isArray(arrayobject)) {
        return Array.from(arrayobject, (x, i) => ({ ...x, key: i }))

    } else {
        return [];
    }
}


/**
 * 深度 obj 合并
 * const a = {a: 1, b: 2, c: 3, d: {key: 2, value: 4}, e: [1, 2, 3]};
 * const b = {a: 3, d: {key:4}, e: [4, 5]};
 * 1. 如果值为{},则覆盖
 * 2. 如果数组全覆盖
 * 3 否则深度
 * @param def
 * @param obj
 * @returns {*}
 */
export function deepAssign(preData, nextData) {
    for (const preKey in preData) {
        const preChildrenKeys = Object.keys(preData[preKey]);
        let nextChildrenKeys = 0;
        if (nextData[preKey] && !Array.isArray(preData[preKey])) {
            nextChildrenKeys = Object.keys(nextData[preKey]);
        }
        if (preChildrenKeys.length > 0 && nextChildrenKeys.length > 0) {
            deepAssign(preData[preKey], nextData[preKey]);
        } else {
            const tempNextValue = nextData[preKey];
            if (tempNextValue !== undefined) {
                preData[preKey] = tempNextValue;
            }
        }
    }
    return preData;
}

/**
 * 对请求回来带有分页的数据 解构，拼装
 * @param obj
 * @param param
 * @returns {{list: *, pageIndex: *, totalPages: *, total: *, pageSize: *}}
 */
export function structureObj(obj, param) {
    const { content, number, totalPages, totalElements, size } = obj;
    let { pageSize } = param;
    if (!pageSize) {
        pageSize = size;
    }
    return {
        list: content,
        pageIndex: number + 1,
        totalPages: totalPages,
        total: totalElements,
        pageSize,// 结构请求的pageSize,
    };

}

/**
 * 初始化 state 里的带有分页的 obj
 * @param obj
 * @returns {{list: Array, pageIndex: number, totalPages: number, total: number, pageSize: *}}
 */
export function initStateObj(obj) {
    const { pageSize } = obj;
    return {
        list: [],
        pageIndex: 0,
        totalPages: 0,
        total: 0,
        pageSize,
    };

}


export function clearTrimObj(data) {
    for (const key in data) {
        const keys = Object.keys(data[key]);
        if (keys.length > 0) {
            if (Array.isArray(data[key])) {
                for (const [index, ele] of data[key].entries()) {
                    if (typeof ele === 'object') {
                        clearTrimObj(ele);
                    } else {
                        data[key][index] = ele.trim();
                    }
                }
            } else {
                clearTrimObj(data[key]);
            }

        } else {
            data[key] = data[key].trim();
        }
    }
    return data;
}


/**
 * 获得按钮切换状态
 *
 * @param {string} action 按钮类型
 * @param {string} status 按钮状态
 * @returns Object
 */
export function getButtonStatus(action, status) {
    let enabledObj = {};
    switch (status) {
        case 'view':
            enabledObj = {
                add: false,
                edit: false,
                del: false,
                down: false,
                import: false,
                export: false,
                save: true,
                cancel: true
            }

            return enabledObj[action];
        case 'new':
            enabledObj = {
                add: false,
                edit: true,
                del: true,
                down: true,
                import: true,
                export: true,
                save: false,
                cancel: false
            }
            return enabledObj[action];
        case 'edit':
            enabledObj = {
                add: true,
                edit: true,
                del: true,
                down: true,
                import: true,
                export: true,
                save: false,
                cancel: false
            }
            return enabledObj[action];
        default:
            break;
    }
}


/**
 * 过滤脏数据按照|分割的字段
 *
 * @param {object} data
 * @returns
 */
export function filterDataParam(data) {
    let keys = Object.keys(data);
    let values = Object.values(data);
    let arr = [];
    for (let i = 0; i < keys.length; i++) {
        if (keys[i].indexOf('|') > -1) {
            let _key = keys[i].split('|')[0];//字段
            let _index = keys[i].split('|')[1];//当前对象索引
            let _value = values[i];//值
            if (typeof arr[_index] != 'object') {
                arr[_index] = {};
            }
            arr[_index][_key] = _value;
        }
    }
    return arr;
}

/**
 * 删除指定的key数据
 * @param {array} keyData - 选择的数组对象包含key
 * @param {array} res - 系统默认的list数据
 * @returns {array} - 处理后的数组对象数据，用于表数据
 */
export function delArrayByKey(keyData, res) {
    for (let keyItem of keyData) {
        for (let [index, ele] of res.entries()) {
            if (keyItem.key === ele.key) {
                res.splice(index, 1);
                break
            }
        }
    }
    return res;
}


/** 将新数组对象与旧数组相同对象删除
 * @param {array} arrayOld 旧数组对象
 * @param {array} arrayNew 新数组对象
 * @param {string} key  关联字段
 */
export function delListObj(arrayOld, arrayNew, key) {
    if (arrayNew.length === 0) { // 如果新数组为空 直接返回
        return arrayOld;
    }
    for (const eleNew of arrayNew) { // 将新数组对象与旧数组对象合并
        for (const [indexOld, eleOld] of arrayOld.entries()) { //
            if (eleOld[key] === eleNew[key]) {
                arrayOld.splice(indexOld, 1);
                break;
            }
        }
    }
    return arrayOld;

}


/** 将新数组对象与旧数组对象合并
 * @param {array} arrayOld 旧数组对象
 * @param {array} arrayNew 新数组对象
 * @param {string} key  关联字段
 */
export function mergeListObj(arrayOld, arrayNew, key) {
    if (arrayOld.length === 0) { // 如果old数组为空 直接返回
        return arrayNew;
    }
    for (const eleNew of arrayNew) { // 将新数组对象与旧数组对象合并
        let isHas = true;
        for (const [indexOld, eleOld] of arrayOld.entries()) { //
            if (eleOld[key] == eleNew[key]) {
                arrayOld[indexOld] = eleNew;
                isHas = false;
                break;
            }
        }
        if (isHas) {  // 旧数组没有找到
            arrayOld.push(eleNew);
        }

    }
    return arrayOld;
}


/**
 * @description 根据页面视口区域高度计算表格高度，以确定什么时候出滚动条
 * @returns {Number} height表格内容区高度
 */
export function getHeight() {
    let clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight),
        scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    let showHeight = (clientHeight < scrollHeight) && clientHeight || scrollHeight;
    return showHeight;
}


/**
 *
 * @description 排序属性设置
 * @export
 * @param {*} sortParam 排序参数对象数组
 * @returns {Array} 返回排序属性
 */
export function getSortMap(sortParam) {
    // 升排序
    const orderSortParam = sortParam.sort((a, b) => {
        return a["orderNum"] - b["orderNum"];
    })
    let sortMap = [];
    sortMap = orderSortParam.map((sortItem, index) => {
        const { order, field } = sortItem,
            tempObj = {}; // order 排序方式，field排序字段
        const direction = (order === 'ascend' ? "ASC" : "DESC"); //  前后端约定
        let property = field;
        if (field.includes("EnumValue")) {
            property = field.replace("EnumValue", ''); //去掉枚举尾标记，前后端约定
        }
        tempObj[property] = direction;
        return tempObj;
    })
    return sortMap;
}

/**
 *@description 获取分页数据
 *
 * @param {*} value
 * @param {*} type type为0标识为pageIndex,为1标识pageSize
 */
export function getPageParam(value, type, pageParams) {
    let { pageIndex, pageSize } = pageParams;
    if (type === 0) {
        pageIndex = value - 1;
    } else {
        pageSize = value.toLowerCase() !== 'all' && value || 1;
        pageIndex = 0;
    }
    return { pageIndex, pageSize }

}

function isString(str) {
    return (typeof str == 'string') && str.constructor == String;
}


/**
 *@description 处理form的 validateFields 返回空格问题。
 * @param {*} 数据源
 */
export function getValidateFieldsTrim(values) {
    for (const key in values) {
        if (values.hasOwnProperty(key)) {
            const element = values[key];
            if (isString(element)) {
                values[key] = (values[key]).trim();
            }
        }
    }
    return values;
}


export function getQueryString(id, url = window.location.search) {
    url = url + "";
    let regstr = "/(\\?|\\&)" + id + "=([^\\&]+)/";
    let reg = eval(regstr);
    let result = url.match(reg);
    if (result && result[2]) {
        return result[2];
    }
}



/**
 * 获得有权限的按钮
 */
export async function getPowerBtn(param) {
    let { params, context } = param;
    const GETPOWERURL = `${context}/auth/getauthperm`;
    return request(GETPOWERURL, {
        method: "get",
        params: params
    });
}

/**
 * 获得单据编码
 * @param {*} param
 */
export const getBillcode = (param) => {
    let { params, context } = param;
    const GETBILLCODEURL = `${context}/billCodeGenerate/fetchPreCode`;
    return request(GETBILLCODEURL, {
        method: "post",
        data: params
    });
}
/**
 * 取消单据编码
 * @param {*} param
 */
export const cancelBillcode = (param) => {
    let { params, context } = param;
    const CANCELBILLCODEURL = `${context}/billCodeGenerate/cancelPreCode`;
    return request(CANCELBILLCODEURL, {
        method: "post",
        data: params
    });
}

/**
 * 节流
 * @param {*} fn
 * @param {*} delay
 */
export const throttle = function throttle(fn, delay = 400) {
    var timmer

    var _throttle = function _throttle() {
        if (timmer) clearTimeout(timmer)
        let args = arguments
        timmer = setTimeout(() => {
            fn.apply(null, args)
        }, delay)
    }

    return _throttle
}

/**
 * 时间戳格式化
 * @param {*} long
 * @param {*} fmt
 */
export function dateFormate(long, fmt = 'yyyy-MM-dd') {
    let date = new Date(long)
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }

    return fmt;
}


export function toThousands(number) {
    if (number === '') return '';
    if (number === '0') return '0';
    let num = (number || 0).toString();
    let integer = num.split('.')[0];
    let decimal = num.split('.')[1] || '';
    let result = '';
    while (integer.length > 3) {
        result = ',' + integer.slice(-3) + result;
        integer = integer.slice(0, integer.length - 3);
    }
    if (integer) {
        result = integer + result;
        if (num == '.' || num.indexOf('.') == num.length - 1) {
            result = result + '.' + decimal;
        } else if (decimal) {
            result = result + '.' + decimal;
        }
    }
    if (result[0] == '-') {
        result = result.replace('-,', '-')
    }
    return result;
}

export function compareObj(propertyName, sortOrder) {
    return function (object1, object2) {
        const value1 = object1[propertyName] || '';
        const value2 = object2[propertyName] || '';
        if (value2 < value1) {
            return sortOrder === 'asc' ? -1 : 1;
        } else if (value2 > value1) {
            return sortOrder === 'asc' ? 1 : -1;
        } else {
            return 0;
        }
    };
}

/**
 * 数字千分位
 * @param {*} value 值
 * @param {*} flag 是否使用千分位
 * @param {*} fixed 小数位
 */
export function formatThousandth(value, flag = true, fixed = 2) {
    if (isNaN(value))
        return value;
    let result = Number(value).toFixed(fixed);
    return flag ? result.replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : result;
}