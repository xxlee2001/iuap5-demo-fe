/**
 * 服务请求类
 */
import request from "utils/request";

//定义接口地址
const URL = {
    "GET_ORG_TREE": `${pom.fe.new.ctx}/treecard/getdepttree`,
    "GET_LIST":  `${pom.fe.new.ctx}/allowance/list`,
    "GET_DETAIL":`${pom.fe.new.ctx}/allowance/getAllowanceInfoById`,
    "SAVE": `${pom.fe.new.ctx}/allowance/saveEntity`,
    "DELETE":  `${pom.fe.new.ctx}/allowance/deleEntity`,
    "GET_SEND":`${pom.fe.new.ctx}/allowance/sendMessage`,
    "GET_ORG_DETAIL": `${pom.fe.new.ctx}/treecard/getvo`,
}


/**
 * 根据参照选择的部门id 获取左侧树结构
 * @param {*} params 
 */
export const getDepartmentTree = ({ pid,searchValue }) => {
    return request(URL.GET_ORG_TREE, {
        method: "get",
        params: { 
            pid,
            searchValue,
            level:'0'
         }
    })
}

/**
 * 获取主列表
 * @param {*} data
 */
export const getList = data => {
    return request(URL.GET_LIST, {
        method: "post",
        data
    });
}

/**
 * 保存 新增、修改
 * @param {*} params
 */
export const save = data => {
    return request(URL.SAVE, {
        method: "post",
        data
    });
}

/**
 * 删除
 * @param {*} data
 */
export const del = data => {
    return request(URL.DELETE, {
        method: "post",
        data
    });
}

/**
 * 获得详细信息
 * @param {*} params 
 */
export const getDetail = params =>{
    return request(URL.GET_DETAIL, {
        method: "get",
        params
    });
}

/**
 * 获取部门明细
 * @param {*} id 
 */
export const getDepartmentDetail = (id) => {
    return request(URL.GET_ORG_DETAIL, {
        method: "get",
        params: { id }
    })
}
/**
 * 发送消息
 * @param {*} params 
 */
export const sendMsg = params =>{
    return request(URL.GET_SEND, {
        method: "get",
        params
    });
}