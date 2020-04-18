import React, { Component } from 'react';

import { actions, connect } from 'mirrorx';
import { Checkbox,Menu,Form } from 'tinper-bee';
import AcHeader from 'ac-header';
import SplitButton from 'components/SplitButtonEnable';
import Modal from 'bee-modal';

import Btns from 'components/Btns';

import headIcon from 'static/images/headerIcon/BasicArchives/2.svg';
import './index.less';

const { Item } = Menu;
class DepartmentHeader extends Component {
    
    state={
        show:false
    }
    /**
     * 保存树节点
     *
     */
    
    onClickSave = e => {
        e.preventDefault();
        this.props.submit();
    }
    /**
     * 取消保存树节点
     *
     */
    onClickCancel = () => {
        actions.department.setStatus('browse');
        this.props.resetForm();
    }

    
    /**
     * 改变部门使用状态
     *
     */
    changeUsingStatus = (param) => {
        actions.department.setUsingStatus(param);
    }
    
    /**
     * 选择树节点
     *
     * @param {*} value 选择展示树节点使用状态
     */
    onSelect = (value) => {
        actions.department.updateState({
            showStop: value
        })
    }
    
    
    /**
     * 启/停用状态变更
     * @param {*} id 选中的当前节点
     * @param {*} vo 选中当前节点的详细信息
     */
    onClickUpdatestatus = (id,vo) => {
        console.log(vo)
        if(vo.enable===0 || vo.enable===2){
            this.setState({
                show:true,
                usingId:id,
                usingVo:vo
            })
            Modal.confirm({
                title: '温馨提示',
                keyword: '警告',
                content: "是否同步启用下级?",
                onOk: ()=> {
                    this.confirm(true);
                },
                onCancel:()=> {
                   this.confirm(false);
                },
                confirmType: 'two'
            })
        }else if(vo.enable===1){
            vo.enable=2
            actions.department.setCurrentNode(id);
            actions.department.updatestatus(vo);
        }
    }
    
    
    /**
     * 点击使用状态
     *
     * @param {*} flag 启用1，停用0
     */
    enabledClick = flag => {
        const { currentNode } = this.props,
            { id,innercode,isEnd } = currentNode;
        const data = {
            vo:{
                id,
                enable: flag,
                innercode,
                isEnd,
            },
            includChild:false
        }
        if(flag==1 && isEnd==0){
            this.setState({
                show:true
            })
        }else{
            actions.department.updatestatus(data);
        }
    }
    
    /**
     * 从树结构中获取指定节点，及父节点
     *
     * @param {*} bool 是否包含子节点
     */
    confirm = bool => {
        const {usingId,usingVo} = this.state;
        let vo = usingVo;
        vo.enable = 1;
        vo.includChild = bool;
        actions.department.setCurrentNode(usingId);
        actions.department.updatestatus(vo);
        this.setState({
            show:false,
            usingId:null,
            usingVo:null
        });
    }
    
    render() {
        const { status, currentNode,currentSelectedId } = this.props,
            { id } = currentNode;
        const { show } =this.state;
        const hasNode = !!id;
        
        return (
            <AcHeader icon={<img src={headIcon}/>}
                      className='department-header'
                      title='部门'>
                <span className='position-to-left'>
                    <Checkbox 
                        inverse 
                        defaultChecked={true}
                        className='department-header-checkbox' 
                        onChange={this.onSelect} 
                        disabled={status === 'edit'}>显示停用</Checkbox>
                </span>
                {
                    status === 'browse' ?
                        <SplitButton
                            enabledClick={()=>{this.onClickUpdatestatus(currentSelectedId,currentNode);}}
                            disabledClick={()=>{this.onClickUpdatestatus(currentSelectedId,currentNode);} }>
                        </SplitButton>
                    :
                        <Btns
                            powerBtns={ this.props.powerBtns }
                            btns={{
                                save:{
                                    onClick:e=>this.onClickSave(e)
                                },
                                cancel:{
                                    onClick:e=>this.onClickCancel(e)
                                }
                            }}
                        />
                }
            </AcHeader>
        )
    }
}

export default connect(status => status.department)(Form.createForm()(DepartmentHeader));
