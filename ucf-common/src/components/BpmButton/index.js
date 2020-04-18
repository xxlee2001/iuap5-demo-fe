import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.less';


const propTypes = {
    width: PropTypes.number, // 弹框宽度
    height: PropTypes.number, // 弹框高度
    appsource: PropTypes.string, // 业务标识
    businessKey: PropTypes.string, // 业务实例id
    callback:PropTypes.func,//回调函数
};

const defaultProps = {
    width: 850,
    height: 510,
    appsource: 'caep',
    callback:()=>{}
};


class BpmButton extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() { }

    onBpmFlow = () =>{
        let {width, height, appsource, businessKey,callback} = this.props;
        let data = {
            width: width,
            height: height,
            appsource: appsource,
            businessKey: businessKey
        };
        this.flowCompIns = window.flowComp(data)
        this.flowCompIns.showFlowBox({
            onClose(data){
                callback()
            }
        })
    }

    render() {
        return (
            // <Button shape="border" className="ml8" onClick={this.onBpmFlow}></Button>
            <span onClick={this.onBpmFlow} className={this.props.className}>{this.props.children}</span>

        )
    }
}
BpmButton.propTypes = propTypes;
BpmButton.defaultProps = defaultProps;
export default BpmButton;
