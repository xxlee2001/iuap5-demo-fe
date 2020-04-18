/**
 * 打印按钮组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button,Dropdown,Icon,Menu } from 'tinper-bee';
import { getCookie,processData,Error } from 'utils'
import request from 'utils/request';
import Print from 'components/Print'
import './index.less'

const { Item } = Menu;
const noop = ()=>{};

const propTypes = {
    dataId:PropTypes.string,//数据id
    printDesign:PropTypes.func,//打印设计回调
    printView:PropTypes.func,//打印预览回调
};

const defaultProps = {
    dataId:'',
    printDesign:noop,
    printView:noop
};

const localeObj = {//打印地址语言对应示例节点语言
    "zh_CN":'cn',
    "en_US":'en'
}

const printOrigin ='https://print-daily.yyuap.com/';
const GET_TENANT = `${pom.fe.new.ctx}/contract/session_context_info`

let locale = localeObj[getCookie('locale')]||'cn';

class PrintBtns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tenantid:window.jDiworkContext&&window.jDiworkContext.tenantId
        };
        
    }
    
    /**
     * 获取打印租户ID
     * @param {*} params
     */
    requestTenant = (param) => {
        return request(GET_TENANT, {
            method: "get",
            param
        });
    }


    printDesign = ()=>{
        Print.printDesign(this.props.printDesign());
    }
    printView = ()=>{
        let dataId = this.props.dataId;
        if(dataId){
            Print.printView(dataId,this.props.printView());
        }else{
            Error('请先选择一条数据')
        }
    }

    render() {
        
        
        const printMenu = (
            <Menu>
              <Item key="1" onClick={this.printDesign}>打印设计</Item>
              <Item key="2" onClick={this.printView}>打印预览</Item>
            </Menu>
        );

        let { className, ...other } = this.props;
        let classes = className?'print-btns '+className:'print-btns';
        return (
            <Dropdown 
                    trigger={['click']}
                    overlay={printMenu}
                    animation="slide-up">
                    <Button bordered  className={classes}>
                        打印 
                        <Icon type='uf-anglearrowdown' />
                    </Button>
            </Dropdown>
        )
    }
}
PrintBtns.propTypes = propTypes;
PrintBtns.defaultProps = defaultProps;
export default PrintBtns;
