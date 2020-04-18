/**
 * 入口、导入组件样式、渲染
 */

import React from 'react';
import { render } from 'mirrorx';
import mirror, { connect } from 'mirrorx';
import IndexView from './Components/IndexView';
import model from './model'
import 'ac-btns/build/Btns.css'
import 'ac-header/build/AcHeader.css';
import 'ac-form-layout/build/FormLayout.css';
import './app.less';

// 数据和组件UI关联、绑定
mirror.model(model);

const App =  connect(state => state.department)(IndexView);

render(<App />, document.querySelector("#app"));