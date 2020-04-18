/**
 * App模块
 */

import React, { Component } from 'react';

import { Loading } from 'tinper-bee';
import PageLayout from 'bee-page-layout';

import DepartmentTree from './Components/DepartmentTree';
import Table from './Components/table/indexView';
import DepartmentHeader from './Components/DepartmentHeader';

import './index.less';

const {  Header,Content, LeftContent, RightContent } = PageLayout;

class App extends Component {

    state = {
        leftW: 250,
        leftMinW: 250,
        isMoving: false,
        data:[],
        func1:null,
    }

    /**
     * 开始调整左侧树区域的宽度
     * 
     */
    startResize = () => {
        this.setState({
            isMoving: true
        })
    }

    /**
     * 结束调整左侧树区域的宽度
     * 
     */
    stopResize = () => {
        this.setState({
            isMoving: false
        })
    }

    /**
     * 鼠标移动监听方法
     * 
     * @param {*} event 原生事件
     */
    mouseMove = (e) => {
        const { isMoving, leftMinW } = this.state
        if (isMoving) {
            // 像素减2 是为了优化拖动效果，防止指针图标闪
            this.setState({
                leftW: e.clientX > leftMinW ? (e.clientX - 2) : leftMinW
            })
        }
    }

    /**
     * 子节点
     * 
     */
    childValue = (data,func1)=>{
        this.setState({
            data,
            func1
        }); 
    }
    /**
     * 清除子节点
     * 
     * 
     */
    clearChildVal = () => {
        this.setState({
            data:[]
        })
        this.Child.getData();
      }

    onRef=(ref)=>{
        this.Child=ref;
    }

    render() {
        let { status, onPageLoading, usingStatus, showStop } = this.props;
        return (
            <div className="department">
                <PageLayout>
                    <Header>
                        <DepartmentHeader
                            status={status}
                            usingStatus={usingStatus}
                            data={this.state.data}
                            func1={this.state.func1}
                             func2={this.clearChildVal}
                        />
                    </Header>
                    <Content onMouseUp={this.stopResize} onMouseLeave={this.stopResize} onMouseMove={this.mouseMove}>
                        <LeftContent style={{width: this.state.leftW + 'px', }}>
                            <DepartmentTree
                                status={status}
                                showStop={showStop}
                            />
                        </LeftContent>
                        <div class="drag-line" draggable={false} style={{ left: this.state.leftW + 'px' }} draggable={false} onMouseDown={this.startResize}></div>
                        <RightContent style={{left: this.state.leftW + 'px', }}>
                            <Table 
                                    getChildValue={this.childValue}
                                    onRef={this.onRef}
                            />
                        </RightContent>
                    </Content>
                </PageLayout>
                <Loading show={onPageLoading}/>

            </div>
        );
    }
}

App.displayName = "App";
export default App;
