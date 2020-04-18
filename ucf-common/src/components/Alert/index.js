import React, { Component } from 'react';
import PropTypes from "prop-types";
import PopDialog from 'components/Pop';
import { Icon } from 'tinper-bee';
import './index.less';


const propTypes = {
    title: PropTypes.string,
    confirmFn: PropTypes.func,
    cancelFn: PropTypes.func,
    context: PropTypes.string,
    show: PropTypes.bool,
    keywords:PropTypes.string,
};

const defaultProps = {
    title: "提示信息",
    confirmFn: PropTypes.func,
    context: "确认要删除吗 ?",
    show: false,
    keywords: '删除',
};

class AlertDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: !!props.show
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.show != nextProps.show) {
            this.setState({ show: nextProps.show })
        }
    }

    //确认回调函数
    confirmFn = () => {
        let { confirmFn } = this.props;
        // this.close();
        confirmFn && confirmFn();
    }

    //取消回调函数
    cancelFn = () => {
        let { cancelFn } = this.props;
        // this.close();
        cancelFn && cancelFn();

    }

    close = () => {
        this.setState({
            show: false
        })
    }

    dialogBtnConfig = [
        {
            label: '确定',
            fun: this.confirmFn,
            colors: 'primary'
        },
        {
            label: '取消',
            fun: this.cancelFn,
            shape: 'border'
        },
    ]

    render() {
        let { context, children, keywords } = this.props;
        //按钮组 
        return (
            <span >
                <span
                    className="alert-modal-title"
                    onClick={() => { this.setState({ show: true }) }}
                >
                    {children}
                </span>
                <PopDialog
                    className="nc-alert" // 设置弹框样式
                    show={this.state.show} //默认是否显示
                    close={this.cancelFn}
                    title={<span className="nc-alert-title">{this.props.title}</span>}
                    size="sm"
                    backdrop={false}
                    closeButton={false}
                    btns={this.dialogBtnConfig}>
                    <span className="nc-alert-keyword"><Icon type='uf-exc-c-2' className='nc-alert-icon'></Icon>{keywords}</span>
                    <span className="nc-alert-context">{context}</span>
                </PopDialog>
            </span>
        )
    }
}

AlertDialog.propTypes = propTypes;
AlertDialog.defaultProps = defaultProps;
export default AlertDialog;
