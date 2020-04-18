/**
 * 启用、停用下拉按钮
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'tinper-bee';
import Btns from 'ac-btns';
import SplitButton from 'ac-split-button'
import 'ac-split-button/build/SplitButton.css'
import './index.less';

const Item = Menu.Item;

const propTypes = {
    enabledClick:PropTypes.func,//点击启用的回调
    disabledClick:PropTypes.func,//点击停用的回调
    enabledDisabled:PropTypes.bool,//是否禁用启用
    disabledDisabled:PropTypes.bool,//是否禁用停用
};

const defaultProps = {
    enabledClick:()=>{},
    disabledClick:()=>{},
};


class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    
    itemClick=(value)=>{
        if(value=='enable'){
            this.props.enabledClick()
        }else{
            this.props.disabledClick()
        }
    }

    render() {
        let { className,disabled,enabledDisabled,disabledDisabled } = this.props;
        let clss = 'split-button-enable';
        const menuList= (
            <Menu >
              {/* <Item key="enable" onClick={()=>{enabledDisabled?'':this.itemClick('enable')}}>
                  <Btns 
                    type='line'
                    btns={{
                      enable:{
                        disabled:enabledDisabled
                      }
                  }}/>
              </Item> */}
              <Item key="disable" onClick={()=>{disabledDisabled?'':this.itemClick('disable')}}>
                  <Btns 
                    type='disable'
                    btns={{
                        disabled:{
                            disabled:disabledDisabled
                        }
                  }}/>
              </Item>
            </Menu>
        );
        if(className)clss+=' '+className
        return (
            <span className={clss}>
                <SplitButton menuList={menuList} colors='primary' >
                <Btns 
                   type='line'
                   btns={{
                      enable:{
                          disabled:enabledDisabled,
                          onClick:()=>{enabledDisabled?'':this.itemClick('enable')}
                      }
                  }}/>
                </SplitButton>
            </span>
            
        )
    }
}
Button.propTypes = propTypes;
Button.defaultProps = defaultProps;
export default Button;
