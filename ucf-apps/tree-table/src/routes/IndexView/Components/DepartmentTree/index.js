import React, { Component } from 'react';

import { Tree, Icon, FormControl } from 'tinper-bee';
import { actions, connect } from 'mirrorx'

import { throttle } from 'utils';
import eventBus from '../helper/eventBus';

import './index.less';

const TreeNode = Tree.TreeNode;

class LeftTree extends Component {

    constructor(props) {
      super(props);
      this.state = {
          disabled: false,
          expandedKeys: [],
          autoExpandParent: true,
          selectedKeys: [],
          asyncTreeData:this.props.treeData,
      }
    }
    /**
     * 点击数节点
     * 
     * @param {*} ids节点id
     */
    onClickTreeNode = (ids) => {
        console.log(ids)
        const id = ids[0]
        if(id!='root'){
            eventBus.emit('FORM_RESET')
            eventBus.emit('SET_ADD','browse')
            actions.treeTable.setStatus('browse')
            actions.treeTable.setCurrentNode(id)
        }
        
        this.setState({
            selectedKeys: [id]
        })
    }

    /**
     *改变树节点
     * 
     * @param {*} value 树节点值
     */
    onTreeChange = async (value) => {
        const { asyncTreeData } = this.state;
        this.getTreeData(null,value);
        let res = [];
        this.getSearchResult(asyncTreeData, value.trim(), res);
        this.setState({
            expandedKeys: res,
            autoExpandParent: true,
        })
    }

    /**
     * 获取搜索结果
     * 
     * @param {*} arr 搜索数组
     * @param {*} param 其他参数
     * @param {*} res 
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
     *树展开
     * 
     * @param {*} expandedKeys 展开节点数组
     */
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    /**
     *渲染树节点标题
     * 
     * @param {*} treeData 树节点数据
     */    
    renderTitle = (treeData) => {
        const {  name, enable } = treeData;
        const enableCss = enable == 1 ? 'refer-tree-title' : 'refer-tree-title unenable';
        return (
            <span className='title'>
                <span className={enableCss}>{ name }</span>
            </span>
        )
    }

    /**
     *渲染树节点
     * 
     * @param {*} treeData 树节点数据
     */ 
    renderTreeNode = (treeData) => {
        const { showStop } = this.props;
        const { expandedKeys, autoExpandParent, selectedKeys } = this.state;
        const { id, children } = treeData;
        const title = this.renderTitle(treeData);
        const cls = {
            'search-result': autoExpandParent && expandedKeys.includes(id),
            'current-selected': selectedKeys.includes(id)
        }

        const hide = !showStop && (treeData.enable === 0||treeData.enable === 2)
        return <TreeNode title={title} key={id} openIcon={<Icon type="uf-treefolder" />} className={cls} style={{ display: hide ? 'none' : 'block' }}>
                {
                    Array.isArray(children) && children.map((item) => {
                        return this.renderTreeNode(item);
                    })
                }
        </TreeNode>
    }



    /**
     *渲染树
     * 
     * @param {*} pid 树的节点id
    * @param {*} searchValue 树搜索内容   
     */ 
    getTreeData = async (pid=null,searchValue='') => {
        const data = await actions.treeTable.getTreeData({
            pid,
            searchValue
        });
        this.setState({
            asyncTreeData:data
        })
    }

    static getDerivedPropsFromState(nextProps,prevState) {
        if(nextProps.treeData!==prevState.asyncTreeData){
            return {
                asyncTreeData:nextProps.treeData
            }
        }
    }

    componentDidMount () {
        this.getTreeData();
    }   
    render() {
        const { status } = this.props;
        const { expandedKeys,asyncTreeData } = this.state;
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
                        Array.isArray(asyncTreeData) && asyncTreeData.map(data => {
                            return this.renderTreeNode(data)
                        })
                    }
                </Tree>
            </div>
        )
    }
}

export default connect(state => state.treeTable)(LeftTree)
