import React, { Component,Fragment } from 'react';

import { Tree, Icon, FormControl,Form  } from 'tinper-bee';
import { actions, connect } from 'mirrorx'
import Modal from 'bee-modal';
import AcTips from 'ac-tips';

import Btns from 'components/Btns';
import { throttle } from 'utils';

import './index.less';

const TreeNode = Tree.TreeNode;

class DepartmentTree extends Component {

    state = {
        disabled: false,
        expandedKeys: [],
        autoExpandParent: true,
        selectedKeys: [],
        delShow:false,//删除模态框展示
        delId:null//删除Id
    }

    /**
     * 点击树节点
     *
     * @param {*} ids 树节点数组
     */
    onClickTreeNode = ids => {
        const id = ids[0];
        actions.department.setStatus('browse');
        if(id==='root'){
            actions.department.setFakeRoot(id);
        }else{
            actions.department.setCurrentNode(id)                   
        }
        this.setState({
            selectedKeys: [id]
        })
    }

    /**
     * 过滤并改变树节点，搜索使用
     *
     * @param {*} value
     */
    onTreeChange = async (value) => {
       const filterData = await actions.department.getTreeData({
            searchValue:value
        });
        let res = [];
        this.getSearchResult(filterData, value.trim(), res);
        this.setState({
          expandedKeys: res,
          autoExpandParent: true,
        });
    }
    
    
    /**
     * 二次确认删除
     * @param {*} bool 是否包含子节点
     */
    delConfirm = bool => {
        const {delId} = this.state;
        console.log(delId)
        if(bool){
            actions.department.delDepartment(delId);
        }
        this.setState({
            delShow:false,
            delId:null
        })
        this.resetForm();
    }
    
    
    /**
     * 获取过滤后树节点的返回值
     *
     * @param {*} arr 树结构数据
     * @param {*} params 过滤参数
     * @param {*} res 返回的key值组装成数组
     */
    getSearchResult = (arr, param, res) => {
        arr && arr.map(obj => {
            if (param === '') {
                res = [];
            }
            else if (obj.children) {
                if (obj.name.includes(param)) {
                    res.push(obj.id);
                }
                this.getSearchResult(obj.children, param, res);
            }
            else if (obj.name.includes(param)) {
                res.push(obj.id);
            }
        })
    }

    /**
     * 树节点展开
     *
     * @param {*} expandedKeys 展开的节点数组
     */
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    /**
     * 渲染树节点title
     *
     * @param {*} treeData 树结构数据
     * @return JSX Node
     */
    renderTitle = treeData => {
        const {
            name,
            id,
            enable,
             } = treeData;
        const {form, currentSelectedId} = this.props
        const enableCss = enable == 1 ? 'refer-tree-title' : 'refer-tree-title unenable';
        const isRootBtn = {
            add: {
                onClick: e => {
                    this.onClickAdd(e,currentSelectedId,enable);
                }
            },
        }
        const pwBtn = {
            update: {
                onClick: e => {
                    this.onClickEdit(e,currentSelectedId);
                }
            },
            add: {
                onClick: e => {
                    this.onClickAdd(e,currentSelectedId,enable);
                }
            },
            delete: {
                onClick: e => {
                    this.onClickDel(e,currentSelectedId);
                }
            },
        }
        return (
            <span className='title'>
                <span className={enableCss}>{ name }</span>
                <Btns 
                //powerBtns={ this.props.powerBtns } 
                type='icon' btns = {id !== 'root' ? pwBtn : isRootBtn } maxSize={99}/>
            </span>
        )
    }

    /**
     * 树节点渲染
     *
     * @param {*} treeData 树结构数据
     * @return JSX Node
     */
    renderTreeNode = treeData => {
        const { showStop } = this.props;
        const {
            expandedKeys,
            autoExpandParent,
            selectedKeys } = this.state;

        const title = this.renderTitle(treeData);

        const { id, children } = treeData;
        const cls = {
            'search-result': autoExpandParent && expandedKeys.includes(id),
            'current-selected': selectedKeys.includes(id)
        }

        const hide = !showStop && (treeData.enable === 0||treeData.enable === 2);
        return (
            <TreeNode title={title} key={id} icon={Array.isArray(children)?<Icon type="uf-treefolder" />:false} className={cls} style={{ display: hide ? 'none' : 'block' }}>
                {
                    Array.isArray(children) && children.map(item => {
                        return this.renderTreeNode(item);
                    })
                }
        </TreeNode>)
    }

    /**
     * 初始化书渲染
     *
     */
    initOnLoadData = async () => {
        const res = await actions.department.getTreeData();
      Array.isArray(res) && res.length!==0 && actions.department.setCurrentNode(res[0].id);
    }
    
    
    /**
     * 删除节点
     * @param {*} id 选中的当前节点
     */
    onClickDel = async (e, id) => {
        e.stopPropagation()
        this.setState({
            delShow:true,
            delId:id
        })
        Modal.confirm({
            title: '温馨提示',
            keyword: '警告',
            content: "是否确认删除?",
            onOk: ()=> {
                this.delConfirm(true);
            },
            onCancel:()=> {
               this.delConfirm(false);
            },
            confirmType: 'two'
        })        
    }
    
    
    /**
     * 编辑树卡详情
     * @param {*} id 选中的当前节点
     */
    onClickEdit = (e, id) => {
        e.stopPropagation();
        actions.department.setStatus('edit');
        if(id){
            actions.department.setCurrentNode(id)
        }
        this.setState({
            selectedKeys: [id]
        })
    }
    
    
    /**
     * 重置表单
     */
    resetForm = () => {
        this.props.form.resetFields();
        this.setState({
            editFlag:false
        });
    }
    /**
     * 新增树卡详情
     * @param {*} id 选中的当前节点，将作为新增部门的父节点
     */
    onClickAdd = (e, id, status) => {
        e.stopPropagation();
        if(status==0 || status==2){
            AcTips.create({content: '部门启用后才可新增子节点', type:'error', duration: 3000, })
        }else{
            actions.department.setStatus('add')
            this.resetForm();
            if(id && id!=='root'){
              actions.department.setCurrentNode(id)
            }
            this.setState({
                selectedKeys: [id]
            })
        }
    }
    
    componentDidMount () {
        this.setState({
            expandedKeys:'root'
        });
        this.initOnLoadData();
    }

    render() {
        const { status, treeData } = this.props;
        const { expandedKeys,delShow  } = this.state;
        const classnames = status !== 'browse' ? 'department-tree disabled' : 'department-tree';
        return (
            <div className={classnames}>
                <FormControl
                    placeholder="编码/名称"
                    onChange={throttle(this.onTreeChange)}
                    type="search"
                    disabled={ status === 'edit' || status === 'add'}
                />
                <Tree
                    defaultExpandAll={false}
                    cancelUnSelect={true}
                    showLine={true}
                    onSelect={this.onClickTreeNode}
                    defaultCheckedKeys={this.selectedKeys}
                    expandedKeys={expandedKeys}
                    onExpand={this.onExpand}
                    showIcon
                    openIcon={<Icon type="uf-reduce-s-o" className='nc-tree-open' />}
                    closeIcon={<Icon type="uf-add-s-o" className='nc-tree-close' />}
                >
                    {
                        Array.isArray(treeData) && treeData.map(data => {
                            return this.renderTreeNode(data);
                        })
                    }
                </Tree>
            </div>
        )
    }
}

export default connect(state => state.department)(Form.createForm()(DepartmentTree));