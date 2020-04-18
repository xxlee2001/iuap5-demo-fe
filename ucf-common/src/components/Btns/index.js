import React, { Component } from 'react';
import PropTypes from "prop-types";
import AcBtns from 'ac-btns';
import { getQueryString } from 'utils'

import 'ac-btns/build/Btns.css'


const propTypes = {
    forcePowerBtns:PropTypes.array
};

const defaultProps = {
    forcePowerBtns:[]
};

class Btns extends Component {
    

    onClick=(e,item)=>{
        let serviceCode = getQueryString('serviceCode', window.location.href);
        jDiwork.recordLog(
            serviceCode,
            {
                operCode:item.code,
                button:item.name
            },
        )
    }
    render() {
        let { forcePowerBtns,...other } = this.props;//临时去掉按钮权限 powerBtns
        return <AcBtns {...other} onClick={this.onClick} 
            forcePowerBtns={forcePowerBtns.concat(['cancel','search','clear','template','save','first','previous','next','last'])}
        />
    }
}

Btns.propTypes = propTypes;
Btns.defaultProps = defaultProps;
export default Btns;