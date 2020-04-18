/**
 * 数据模型类
 */
import { actions } from "mirrorx";
import * as api from "./service";
import { processData,getPowerBtn } from 'utils';

export default {
    name: "department",
    initialState: {
        status: 'browse', //  browse edit add
        onPageLoading: false,
        treeData: [{
                    id:'root',
                    name:'部门',
                    isRoot: true,
                    enable:1,
                    children:[]
                 }],
        showStop: true,
        currentNode: {},
        currentSelectedId:null,
        usingStatus: true,
        DepartTypes: [
            { key: '1', name: '销售部门' },
            { key: '2', name: '管理部门' },
            { key: '3', name: '基本生产部门' },
            { key: '4', name: '辅助生产部门' },
            { key: '5', name: '福利部门' },
            { key: '6', name: '基建部门' },
        ],
        powerBtns: []
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
         * @param {*} id 当前节点id 
         */
        async setCurrentNode(id) {
            actions.department.showLoading(true);
            const { result } = processData(await api.getDepartmentDetail(id));
            if (result && result.data) {
                actions.department.updateState({
                    currentNode: result.data,
                    currentSelectedId:id,
                })
            }
            actions.department.showLoading(false);
        },
        /**
         * 点继虚拟根节点特殊处理
         * @param {*} id 当前节点id 
         */
        async setFakeRoot(id) {
            actions.department.showLoading(true);
            actions.department.updateState({
                currentNode:{},
                currentSelectedId:'root',
            })                
            actions.department.showLoading(false);
        },
        /**
         * 添加部门
         * @param {*} data 提交表单数据
         * @param {*} isEdit 是否编辑态，默认不开启
         */
        async addDepartment(data, isEdit=false) {
            actions.department.showLoading(true);
            const resp = await api.addDepartment(data);
            let { result } = processData(resp, '操作成功');
            if (result && result.data) {
                actions.department.updateState({
                    currentNode: result.data
                })
                actions.department.setStatus('browse');
                actions.department.reload();
            }
            actions.department.showLoading(false);
        },

        /**
         * 删除树节点
         * @param {*} id 当前节点
         */
        async delDepartment(id) {
            actions.department.showLoading(true);
            const data = [id];
            const resp = await api.delDepartment(data);
            actions.department.showLoading(false);
            processData(resp, '删除成功');
            actions.department.setStatus('browse');
            actions.department.updateState({
                currentNode:{},
                currentSelectedId:null,
            })
            actions.department.reload();
        },

        /**
         * 重新加载树卡
         */
        reload(params, getState) {
            actions.department.getTreeData({
                pid:'',
                searchValue:''
            });
        },

        /**
         * 设置状态
         * @param {*} status 部门状态
         */
        setStatus(status) {
            actions.department.updateState({
                status
            })
        },
    /**
     * 按钮权限
     * @param {} params
     */
    async getPower(params) {
      const {result} = processData(await getPowerBtn(params))
      console.log(result)
      if (result.data && result.data.authperm) {
        actions.department.updateState({
          powerBtns: result.data.authperm
        })
      }
    },

        /**
         * 展示loading
         */
        showLoading( param ) {
            actions.department.updateState({ onPageLoading: param});
        },

        /**
         * 启用/停用
         */
        async updatestatus(param){
            processData(await api.updatestatus(param), '操作成功');
            actions.department.setCurrentNode(param.id);
            actions.department.reload();
        }
    }
};
