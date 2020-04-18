import React, { Component,Fragment } from 'react';
import PropTypes from "prop-types";
import { Modal,Loading } from 'tinper-bee';
import Btns from 'ac-btns';
import AcGrids from 'ac-gridcn';
import cloneDeep from 'clone-deep'
import 'ac-btns/build/Btns.css';
import 'ac-gridcn/build/Gridcn.css';
import request from 'utils/request';
import { Error,processData } from 'utils';
import './style.less';

const PROCESSKEY = '1634484878545152'

const propTypes = {
    record:PropTypes.object,//单据对象
    callback:PropTypes.func,//回调函数
    type:PropTypes.oneOfType(['button','line']),//按钮类型
};

const defaultProps = {
   record:{},
   callback:()=>{},
   type:'line'
};

class ApprovalBoard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            data:[],
            selectIndex:0,
            showLoading:false,
            allDataObj:{},
            showModal:false,
            data2:[]
        }

        this.columns=[
            {
                title: "环节名称",
                dataIndex: "activityName",
                key: "activityName",
            },
            {
                title: "被指派人",
                dataIndex: "userName",
                key: "userName",
                render:(text,record,index)=>{
                    return <span>{this.getUserName(record)}</span>
                }   
            },
            {
                title: "操作",
                dataIndex: "e",
                key: "e",
                textAlign:'center',
                render:(text,record,index)=>{
                    return <span className='approval-board-operation' onClick={()=>{this.appoint(index)}}>指派</span>
                }
            },
        ]
        this.columns2=[
            {
                title: "编码",
                dataIndex: "code",
                key: "code",
            },
            {
                title: "名称",
                dataIndex: "name",
                key: "name" 
            },
        ]
    }

    getUserName = (record)=>{
        if(record.participants.length){
            let names = [];
            record.participants.forEach(item=>{
                names.push(item.name);
            })
            return names.join(',')
        }else{
            return ''
        }
    }
    /**
     * 指派
     */
    appoint = (selectIndex) =>{
        this.setState({
            selectIndex,
            showModal:true,
        })
    }

    onClick = ()=>{
        this.setState({
            showLoading:true
        })
        let record = this.props.record;
        delete record.ts;
        record.subscribeDate = new Date(record.subscribeDate.substr(0,10)).toISOString();
        let url = `${pom.fe.new.ctx}/contract/bpmSubmit/assignCheck`;
        request(url, {
            method: "post",
            data:{
                entity:record
            },
            params:{
                category:PROCESSKEY,
                orgId:record.orgId
            }
        }).then(res=>{
            let { result } = processData(res);
            this.setState({
                showLoading:false
            })
            if(result.status=='success'){
                if(result&&result.data&&result.data.assignAble){
                    let data = result.data.assignInfo.assignInfoItems;
                    let data2 = data[this.state.selectIndex].participants;
                    this.setState({
                        allDataObj:result.data,
                        data:data,
                        show:true,
                        data2
                    })
                }else{//直接提交
                    this.sampleSubmit()
                }
            }
            
        }).catch(error=>{
            Error(error);
            this.setState({
                showLoading:false
            })
        })
        
    }

    close = ()=> {
        this.setState({
            show: false
        });
    }

    closeModal=()=>{
        this.setState({
            showModal:false
        })
    }


    ok=()=>{
        //https://wbalone-dev.yyuap.com/demo-contract-server/swagger-ui.html?wb_at=LMjpvuqjdQLLnfqbqDm4K7sQBCC7jbZrmnkdwZlokdknqf
        //保存数据
        this.setState({
            showLoading:true
        })
        let record = this.props.record;
        delete record.ts;
        let allDataObj = this.state.allDataObj;
        allDataObj.assignInfo.assignInfoItems=this.state.data;
        allDataObj.vo = {
            entity:record
        };
        let url = `${pom.fe.new.ctx}/contract/bpmSubmit/assignSubmit`;
        if(this.props.submitProcessInstJudgeGo)url = `${pom.fe.new.ctx}/contract/submitProcessInstJudgeGo`;
        request(url, {
            method: "post",
            data:allDataObj,
            params:{
                category:PROCESSKEY,
                needSaved: false,
                orgId:record.orgId,
                processInstId:record.processInstId
            }
        }).then(res=>{
            let { result } = processData(res,'提交成功');
            this.props.callback()
            this.setState({
                show:false,
                showLoading:false
            })
        }).catch(error=>{
            this.props.callback(error)
            Error(error)
            this.setState({
                showLoading:false
            })
        })

    }

    /**
     * 直接提交
     */
    sampleSubmit=()=>{
        this.setState({
            showLoading:true
        })
        let url = `${pom.fe.new.ctx}/contract/bpmSubmit/commonSubmit`;
        let record = this.props.record;
        delete record.ts;
        record.subscribeDate = new Date(record.subscribeDate.substr(0,10)).toISOString();
        let data = {
            entity:record,
        }
        if(this.props.submitProcessInstJudgeGo){
            url = `${pom.fe.new.ctx}/contract/submitProcessInstJudgeGo`;
            data = {
                assignInfo:{},
                description:null,
                createType:null,
                assignSingle:false,
                assignAll:false,
                assignAble:true,
                vo:{
                    entity:record,
                }
            }
        }
        request(url, {
            method: "post",
            data:data,
            params:{
                category:PROCESSKEY,
                needSaved: false,
                orgId:record.orgId,
                processInstId:record.processInstId
            }
        }).then(res=>{
            let { result } = processData(res,'提交成功');
            this.props.callback()
            this.setState({
                showLoading:false
            })
        }).catch(error=>{
            Error(error);
            this.setState({
                showLoading:false
            })
        })
    }


    getSelectedDataFunc = (selectData, record, index) => {
        this.setState({
            selectData
        });
        let _list = cloneDeep(this.state.data2);
        const allChecked = selectData.length == 0?false:true;
        if(!record){
            _list.forEach(item=>{
            item._checked = allChecked;
          })
        }else{
            _list[index]['_checked'] = record._checked;
        } 
        this.setState({
            data2:_list
        })
    }

    confirmOk=()=>{
        let index  = this.state.selectIndex;
        let data = cloneDeep(this.state.data);
        let participants = []
        this.state.selectData.forEach(item => {
            delete item._checked
            participants.push(item)
        });
        data[index].participants=participants;
        this.setState({
            data,
            showModal:false
        })
    }

    render() {
        return (
            <Fragment >
                <Loading show={this.state.showLoading} />
                <Btns type={this.props.type}
                    btns={{
                        pbmsubmit:{
                            onClick:this.onClick
                        }
                    }}
                />
                <Modal
                    backdropClassName="approval-board-modal-backdrop"
                    size = 'xlg'
                    dialogClassName='approval-board-modal'
                    show = { this.state.show }
                    onHide = { this.close } 
                    autoFocus ={false}
                    enforceFocus={false}
                    >
                    
                        <Modal.Header closeButton>
                            <Modal.Title>指派</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <AcGrids
                                rowKey={(record, index) => index}
                                columns={this.columns}
                                data={this.state.data}
                                multiSelect={false}
                                scroll = {{y:500}}
                           />
                        </Modal.Body>
                        <Modal.Footer>
                            <Btns
                                btns={{
                                    confirm:{
                                        onClick:this.ok
                                    },
                                    cancel:{
                                        onClick:this.close
                                    },
                                }}
                            />
                        </Modal.Footer>
                </Modal>


                <Modal
                    show={this.state.showModal}
                    onHide={this.closeModal}
                    dialogClassName='approval-board-modal2'
                >
                    <Modal.Header closeButton>
                        <Modal.Title>选择人员</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <AcGrids
                            rowKey={(record, index) => index}
                            columns={this.columns2}
                            data={this.state.data2}
                            multiSelect={true}
                            scroll = {{y:500}}
                            getSelectedDataFunc={this.getSelectedDataFunc}
                            paginationObj={null}
                           />
                    </Modal.Body>

                    <Modal.Footer>
                        <Btns
                            btns={{
                                confirm:{
                                    onClick:this.confirmOk
                                },
                                cancel:{
                                    onClick:this.closeModal
                                },
                            }}
                        />
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        )
    }
}

ApprovalBoard.propTypes = propTypes;
ApprovalBoard.defaultProps = defaultProps;
export default ApprovalBoard;
