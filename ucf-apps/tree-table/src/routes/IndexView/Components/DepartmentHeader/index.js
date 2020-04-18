import React, { Component, Fragment } from 'react';
import AcHeader from 'ac-header';
import Btns from 'components/Btns';
import { actions, connect } from 'mirrorx';
import { ButtonGroup } from 'tinper-bee';

import eventBus from '../helper/eventBus';
import Modal from 'bee-modal';
import headIcon from 'static/images/headerIcon/BasicArchives/2.svg';
import AcTips from 'ac-tips';
import './index.less';

//树的自定义组织参照一期暂时隐藏
// cb.rest.AppContext.ignoreuniform = true
// cb.rest.AppContext.serviceUrl = `${pom.fe.mdf.ctx}`;
// 
class DepartmentHeader extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:false
        }
    }

    /**
     * 点击保存
     * 
     * @param {*} event 原生事件
     */
    onClickSave = (e) => {
        e.preventDefault();
        eventBus.emit('SAVE');
    }
    /**
     * 点击取消
     * 
     */
    onClickCancel = () => {
        actions.treeTable.setStatus('browse');
        eventBus.emit('FORM_RESET');
    }

    /**
     * 改变使用状态
     * 
     * @param {*} param 状态参数
     */
    changeUsingStatus = (param) => {
        actions.treeTable.setUsingStatus(param);
    }
    /**
     * 选择节点
     * 
     * @param {*} value 节点信息
     */
    onSelect = (value) => {
        actions.treeTable.updateState({
            showStop: value
        })
    }

    /**
     * 启用1 停用0
     */
    enabledClick = (flag) => {
        const { currentNode } = this.props;
        const data = {
            vo:{
                id: currentNode.id,
                enable: flag,
                innercode:currentNode.innercode,
                isEnd:currentNode.isEnd,
            },
            includChild:false
        }
        if(flag==1&&currentNode.isEnd==0){
            this.setState({
                show:true
            })
        }else{
            actions.treeTable.updatestatus(data)
        }
    }

    /**
     * 确认方法
     * 
     * @param {*} bool 是否包含子节点
     */
    confirm=(bool)=>{
        const { currentNode } = this.props;
        const data = {
            vo:{
                id: currentNode.id,
                enable: 1,
                innercode:currentNode.innercode,
                isEnd:currentNode.isEnd,
            },
            includChild:bool
        }
        actions.treeTable.updatestatus(data)
        this.setState({
            show:false
        })
    }

  
      /**
       * 删除
       */
      delete = () => {
        Modal.confirm({
                    title: '确定要删除这条单据吗？',
                    content: '单据删除后将不能恢复。',
                    onOk: async ()=> {
                        await actions.treeTable.delete(this.props.data)
                        this.props.func2();
                    },
                    onCancel:()=> {
                        console.log('Cancel');
                    },
                })
      }

    render() {
        let { currentNode,powerBtns,currentSelectedId } = this.props;

        return (
            <AcHeader icon={<img src={headIcon}/>}
                className='department-header'
                title='部门'
                >
                <span className='position-to-left'>
                    {/*树的自定义组织参照一期暂时隐藏*/}
                    {/*<MdfRefer modelName={'refer'} model={this.modelOrg} config={this.config}></MdfRefer>*/}
                </span>
                <Fragment>
                    <div>
                      <ButtonGroup>
                        <Btns
                            powerBtns={ powerBtns }
                            btns={ {
                              add: {
                                onClick: () => {
                                  actions.treeTable.goto({
                                    type: 'add'
                                  });
                                  if(currentSelectedId){
                                    actions.treeTable.setCurrentNode(currentSelectedId);
                                  }
                                }
                              },
                              delete: {
                                onClick: () => {
                                  if(this.props.data.length<=0){
                                     AcTips.create({
                                        type:'warning',
                                        content:"请先选择数据"
                                    });
                                  }else{
                                    this.delete();
                                  }
                                }
                              }
                            } }/>
                      </ButtonGroup>
                      <Btns
                          powerBtns={ powerBtns }
                          btns={ {
                            export: {
                              onClick: () => {
                                this.props.func1();
                              }
                            }
                          } }
                      />
                  </div>
            </Fragment>
                
                <Modal
                    show={this.state.show}
                    confirmFn={()=>{this.confirm(true)}}
                    cancelFn={()=>{this.confirm(false)}}
                    title='提示信息'
                    keyword=''
                    content='是否同步启用下级'
                />

                
            </AcHeader>
        )
    }
}

export default connect(status => status.treeTable)(DepartmentHeader);
