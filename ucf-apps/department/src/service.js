/**
 * 服务请求类
 */
import request from "utils/request";

//定义接口地址
const URL = {
    GET_ORG_TREE: `${pom.fe.new.ctx}/treecard/getdepttree`,
    ADD_ORG: `${pom.fe.new.ctx}/treecard/savevo`,
    DEL_ORG: `${pom.fe.new.ctx}/treecard/delevo`,
    GET_ORG_DETAIL: `${pom.fe.new.ctx}/treecard/getvo`,
    UPDATESTATUS: `${pom.fe.new.ctx}/treecard/updatestatus`
}


/**
 * 根据参照选择的部门id 获取左侧树结构
 * @param {*} params 
 */
export const getDepartmentTree = (params) => {
    const pid = params?params.pid:'',
          searchValue = params?params.searchValue:'';
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
 * 添加部门
 * @param {*} params 
 */
export const addDepartment = (params) => {
    return request(URL.ADD_ORG, {
        method: "post",
        data: params
    })
}

/**
 * 删除部门
 * @param {*} params 
 */
export const delDepartment = (params) => {
    return request(URL.DEL_ORG, {
        method: "post",
        data: params
    })
}

/**
 * 启用停用
 * @param {*} params 
 */
export const updatestatus = (params) => {
    return request(URL.UPDATESTATUS, {
        method: "get",
        params: {
            enable:params.enable,
            id:params.id,
            includChild:params.includChild
        }
    })
}