import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Icon, Modal, Button } from 'tinper-bee';
import './index.less';


const propTypes = {
    title: PropTypes.string,
    keywords: PropTypes.string,
    content: PropTypes.string,
    confirmFn: PropTypes.func,
    cancelFn: PropTypes.func,
    show: PropTypes.bool,
};

const defaultProps = {
    title: "提示信息",
    confirmFn: ()=>{},
    cancelFn: ()=>{},
    content: "确认要删除吗 ?",
    show: false,
    keyword: '删除',
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

    render() {
        let { close, title, keyword, content, confirmFn, cancelFn } = this.props;
        //按钮组 
        return (
            <span >
                <Modal
                    centered
                    show={this.state.show}
                    className='nc-modal'
                    onHide={close} 
                    draggable={true}
                    resizable={true}
                    maxWidth={1680}
                    maxHeight={859}
                    minWidth={410}
                    minHeight={201}
                    >
                    <Modal.Header closeButton className='nc-modal-header'>
                        <Modal.Title className='nc-modal-header-title'>{title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className='nc-modal-body'>
                        <span className='nc-modal-body-title'>
                            <Icon type='uf-exc-c-2' className='nc-modal-body-title-icon'></Icon>
                            <span className='nc-modal-body-title-keyword'>{keyword}</span>
                        </span>
                        <span className='nc-modal-body-content'>{content}</span>
                    </Modal.Body>

                    <Modal.Footer className='nc-modal-footer'>
                        <Button className='nc-modal-footer-btn-red' 
                            onClick={confirmFn} 
                            bordered 
                            size='sm'
                            style={{ marginRight: 6 }} >
                            确认
                        </Button>
                        <Button 
                            className='nc-modal-footer-btn-white' 
                            onClick={cancelFn} 
                            colors="secondary" 
                            size='sm'>
                            取消
                        </Button>
                    </Modal.Footer>
                </Modal>
            </span>
        )
    }
}

AlertDialog.propTypes = propTypes;
AlertDialog.defaultProps = defaultProps;
export default AlertDialog;
