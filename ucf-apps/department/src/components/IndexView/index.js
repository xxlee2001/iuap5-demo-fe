/**
 * App模块
 */

import React, { Component } from 'react';
import { Loading } from 'tinper-bee';
import PageLayout from 'bee-page-layout';
import DepartmentTree from '../Components/DepartmentTree';
import DepartmentCard from '../Components/DepartmentCard';
import DepartmentHeader from '../Components/DepartmentHeader';
import './index.less';

const {
    Header,
    Content,
    LeftContent,
    RightContent } = PageLayout;

class App extends Component {
    
    state = {
        leftW: 250,
        leftMinW: 250,
        isMoving: false
    }
    /**
     * moving状态变更
     */
    startResize = () => {
        this.setState({
            isMoving: true
        })
    }
    /**
     * moving状态变更
     */
    stopResize = () => {
        this.setState({
            isMoving: false
        })
    }
    /**
     * moving状态变更
     */
    mouseMove = e => {
        const { isMoving, leftMinW } = this.state
        if (isMoving) {
            // 像素减2 是为了优化拖动效果，防止指针图标闪
            this.setState({
                leftW: e.clientX > leftMinW ? (e.clientX - 2) : leftMinW
            })
        }
    }
    
    onRef= ref =>{
        this.DepartmentCard = ref;
    }
    
    render() {
        const {
            status,
            onPageLoading,
            currentNode,
            usingStatus,
            showStop } = this.props;
        return (
            <div className="department">
                <PageLayout>
                    <Header>
                        <DepartmentHeader
                            status={status}
                            usingStatus={usingStatus}
                            submit={
                                ()=>{
                                    this.DepartmentCard.submit && this.DepartmentCard.submit()
                                }
                            }
                        />
                    </Header>
                    <Content onMouseUp={this.stopResize} onMouseLeave={this.stopResize} onMouseMove={this.mouseMove}>
                        <LeftContent style={{width: this.state.leftW + 'px', }}>
                            <DepartmentTree
                                status={status}
                                showStop={showStop}
                            />
                        </LeftContent>
                        <div class="drag-line"
                             style={{ left: this.state.leftW + 'px' }}
                             onMouseDown={this.startResize}></div>
                        <RightContent style={{left: this.state.leftW + 'px', }}>
                            <DepartmentCard
                                status={status}
                                currentNode={currentNode}
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

export default App;