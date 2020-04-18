/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React from "react";
import mirror, { render, Router } from "mirrorx";
import Routes from './routes'

import "./app.less";

mirror.defaults({
  historyMode: "hash"
});

render(<Router>
    <Routes />
  </Router>, document.querySelector("#app"));
