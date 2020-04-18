/**
 * 数据模型类
 */

import { actions } from "mirrorx";
import * as api from "./service";
import { processData, getPowerBtn } from "utils";

export default {
    name: "treeTable",
    initialState: {
        status: 'browse', //  browse edit add
        onPageLoading: false,
        treeData: {
            id:'root',
            name:'部门',
            isRoot: true,
            enable:1,
            children:[]
         },
        showStop: true,
        currentNode: {},
        currentSelectedId:null,
        currentSelectedName:null,
        usingStatus: true,
        showLoading: false,
        queryObj: {
          list: [],//列表数据
          pageIndex: 0,
          pageSize: 10,
          totalPages: 0,
          total: 0,
        },
        dataNumObj:{
            "5": 0,
            "10": 1,
            "20": 2,
            "15": 3,
            "25": 4,
            "50": 5,
            "1": 6,
        },
        selectedRow: [],  // 已选中行的数据
        detailObj: {},//详情数据
        searchParam: {
          status: '1',
          currencyName: ''
        },//查询条件，带到详情页面
        powerBtns: [],
    },
    reducers: {
        /**
         * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
         * @param {*} state
         * @param {*} data
         */
        updateState(state, data) {
            return {
                ...state,
                ...data
            };
        }
    },
    effects: {
        /**
         * 获取树的数据
         * @param 
         */
        /**
         * 获取树的数据
         * @param 
         */
        async getTreeData(params,getState){
            const { result } = processData(await api.getDepartmentTree(params));
            if(result && result.data){
                actions.department.updateState({
                     treeData: [{
                        id:'root',
                        name:'部门',
                        isRoot: true,
                        enable:1,
                        children:result.data.data
                     }]                
                 });
                return Promise.resolve(result.data.data)
            }
        },


        /**
         * 获取节点详细信
         * @param {*} id 
         */
        async setCurrentNode(id) {
            actions.treeTable.showLoading(true);
            const { result } = processData(await api.getDepartmentDetail(id));
            if (result && result.data) {
                actions.treeTable.updateState({
                    currentNode: result.data,
                    currentSelectedId:id,
                })
            }
            actions.treeTable.showLoading(false);
        },
        /**
         * 获取节点详细信
         * @param {*} name 
         */
        async setCurrentNodeName(name) {
            actions.treeTable.updateState({
                currentSelectedName:name,
            });
        },
        /**
         * 重新加载树卡
         * @param {*} params 
         * @param {*} getState 
         */
        reload(params, getState) {
            actions.treeTable.getTreeData({
              pid:'',
              searchValue:''
            });
        },

        /**
         * 设置状态
         */
        setStatus: (status)=>{
            actions.treeTable.updateState({
                status
            })
        },

        showLoading: ( param ) => {
            actions.treeTable.updateState({ onPageLoading: param});
        },
        /**
         * 路由跳转
         * @param {*} param
         */
        goto({type, record, searchParam}, getState) {
          // btnFlag 0表示新增、1表示编辑，2表示查看详情
          switch (type) {
            case 'index':
              actions.routing.push({
                pathname: '/'
              })
              break;
            case 'add':
              actions.routing.push({
                pathname: '/edit',
                search: `?btnFlag=0`
              })
              actions.treeTable.updateState({
                detailObj: {}
              })
              break;
            case 'edit':
              actions.routing.push({
                pathname: '/edit',
                search: `?btnFlag=1`
              })
              actions.treeTable.updateState({
                detailObj: record
              })
              break;
            case 'detail':
              actions.routing.push({
                pathname: '/edit',
                search: `?btnFlag=2`
              })
              actions.treeTable.updateState({
                detailObj: record,
                searchParam
              })
              break;
          }
        },
        
        /**
         * 加载列表数据
         * @param {*} param
         * @param {*} getState
         */
        async loadData(params, getState) {
          actions.treeTable.updateState({showLoading: true})
          const {result} = processData(await api.getList(params))
          const data = result.data;
          const content = data.content;
          content.forEach((item, index) => {
            item.index = data.number * data.size + index
          })
          const updateData = {
            showLoading: false, queryObj: {
              total: data.totalElements,
              totalPage: data.totalPages,
              pageSize: data.size,
              pageIndex: data.number,
              list: content
            }
          }
          actions.treeTable.updateState(updateData)
        },
        
        /**
         * 新增/保存
         * @param {*} params
         * @param {*} getState
         */
        async save(params, getState) {
          let cb = null
          if (params.callback) {//详情停用
            cb = params.callback
            params = params.data
          }
          let {result} = processData(await api.save(params), '操作成功')
          if (result.status == 'success') {
            if (cb) {//详情停用
              cb()
            } else {
              actions.treeTable.goto({
                type: 'index'
              })
            }
          }
        },
        
        /**
         * 删除
         * @param {*} params
         * @param {*} getState
         */
        async delete(params, getState) {
          let cb = null
          if (params.callback) {//详情删除返回首页
            cb = params.callback
            params = params.data
          }
          let {result} = processData(await api.del(params), '删除成功')
          console.log(result)
          if (result.status == 'success') {
            if (cb) {//详情删除返回首页
              cb()
            }
          }
        },
        
        /**
         * 按钮权限
         * @param {} params
         */
        async getPower(params) {
          const {result} = processData(await getPowerBtn(params))
          if (result.data && result.data.authperm) {
            actions.treeTable.updateState({
              powerBtns: result.data.authperm
            })
          }
        },
        
        /**
         * 获得详细数据
         */
        async getDetail(params) {
          actions.treeTable.updateState({showLoading: true})
          const {result} = processData(await api.getDetail(params))
          const data = result.data
          actions.treeTable.updateState({
            showLoading: false,
            detailObj: data
          })
        },
        /**
         * 获得详细数据
         */
        async getSendMsg(params) {
          actions.currencyType.updateState({showLoading: true})
          const {result} = processData(await api.sendMsg(params), '发送成功')
          console.log(result)
          actions.currencyType.updateState({showLoading: false})
        } 
    }
};
