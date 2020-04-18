## 项目启动调试

### 1、环境准备

- node.js (10.15+)【必需】

- npm (6+)【必需，安装node时候自带，无需单独下载】

### 2、安装依赖包

依次执行以下命令：

> 安装 ynpm 和 ucf-cli 全局工具

```
npm install ynpm-tool -g

npm install ucf-cli -g

```

> 安装项目依赖包

```
ynpm install

```


### 3、更改代理配置

设置 ucf.config.js 配置文件中的proxy，

```js
proxy: [
  {
    // true 开启当前配置，false 关闭当前配置
    enable: true,
    headers: {
      // 与下方url一致即可
      "Referer": "https://mock.yonyoucloud.com"
    },
    // 代理的路由到对方路由
    router: [
      '/mock'
    ],
    //代理到的地址
    url: 'https://mock.yonyoucloud.com'
  }
]
```


### 4、启动服务本地调试
> 项目启动3003端口，请确保不被占用，或者通过更改 package.json 第七行的 3003 更改端口号

```
npm start
```

浏览器自动打开 [一主多子界面](http://127.0.0.1:3003/purchase#/)


## 打包产出命令

```
npm run build
```

注意：环境部署时，必须要替换指定字符串。如下

> 如使用开发者中心部署，dockerfile 参考 docs/dockerfile.md 文件。替换时注意要带 /，参考示例

- 一主多子上下文  pom.fe.new.ctx      示例：/demo-contract-server
- 树卡上下文  pom.fe.treecard.ctx     示例：/treecard/demo-treecard-server
- 单表上下文  pom.fe.currency.ctx     示例：/currency/demo-server
- 参照上下文  pom.fe.mdf.ctx          示例：/upc-fe
- 打印  pom.fe.print.domain          示例：https://u8cprint-daily.yyuap.com
- 附件  pom.fe.attchment.domain      示例：https://yb-daily.yyuap.com
- 流程  pom.fe.ys.domain             示例：https://ezone-u8c-daily.yyuap.com


## 注：如果要开发节点等请参考[详细ucf文档](http://tinper.org/ucf-web/)
