/**
 * 入口、导入组件样式、渲染
 */

import React from 'react';
import mirror, { render, Router,Route,connect } from 'mirrorx';

import App from './routes/IndexView';
import Edit from './routes/Edit';
import model from './model'

// 全局样式
import 'styles/ac-theme.less';
import 'ac-header/build/AcHeader.css'
import 'ac-btns/build/Btns.css';
import 'ac-tips/build/AcTips.css';
import 'ac-datepicker/build/DatePicker.css'
import 'ac-search-cn/build/AcSearchPanel.css';
import 'ac-split-area/build/SplitArea.css';
import 'ac-form-layout/build/FormLayout.css';
import 'ac-gridcn/build/Gridcn.css'
import './app.less';


mirror.model(model);


const indexContainer = connect(state => state.treeTable)(App);
const editContainer = connect(state => state.treeTable)(Edit);


// 设置mirrorx 路由加载方式
mirror.defaults({
    historyMode: "hash"
});

render(<Router>
	<div className="route-content">
        <Route exact path="/" component={indexContainer} />
        <Route exact path="/edit" component={editContainer} />
    </div>
</Router>, document.querySelector("#app"));