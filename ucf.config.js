/*
 * @Descripttion:
 * @version:
 * @Date: 2019-08-13 10:18:25
 * @LastEditTime: 2019-08-14 11:30:48
 */
/**
 * UCF配置文件
 * 全新详细文档请访问 https://www.yuque.com/ucf-web/book/zfy8x1
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return {
        context: '',
        // 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
        // bootList: true,
        // 启动这两个模块，启动调试、构建
        bootList: true,
        // 代理的配置
        proxy: [
            //代理
            {
                enable: true,
                headers: {
                    "Referer": "http://10.190.253.185",
                    "Cookie": "locale=zh_CN; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=zh_CN; _yht_code_uuid=9694c2c1-5a1a-42d9-8eb9-091beadad443; at=ab6d10d4-7536-4292-bc4d-0fe7300007bb; yonyou_uid=3ef1bd98-274f-494b-8e17-e8f3bac1a4b9; yonyou_uname=%25E6%259D%258E%25E7%25BF%2594%25E5%25AE%2587; yht_username=ST-M2VmMWJkOTgtMjc0Zi00OTRiLThlMTctZThmM2JhYzFhNGI5_aHR0cDovLzEwLjE5MC4yNTMuMTg1L3dvcmtiZW5jaC9sb2dpbl9saWdodD95aHRkZXN0dXJsPS95aHRzc29pc2xvZ2luJnlodHJlYWxzZXJ2aWNlPWh0dHA6Ly8xMC4xOTAuMjUzLjE4NQ.._1587086580510-QmVfnduP9p6fUngBjYnx-10.190.253.185__3ef1bd98-274f-494b-8e17-e8f3bac1a4b9; yht_usertoken=Btt3LxvXnIT2riEKPqlCALeZ9ybZLskai5OqHmR2toJ3IzsFjSJsc3Ugr44vGI4YEqHjibRh%2BiObSy7zkLVzEg%3D%3D; yht_access_token=bttZXRlc0g4SUxROU5lWEp4ZlNNdERIWDkrQ1lpZXNZOG0weW02cjlDa2ZWWkQ0Z21WZkFsMHk4eitWTzI1MWIvZFVBdDdkMmV4QUJmaGhFRDhqUmFRRmdCUW94Uld1cnVYV0RXdGZHTFM2TU09XzNlZjFiZDk4LTI3NGYtNDk0Yi04ZTE3LWU4ZjNiYWMxYTRiOV8xMC4xOTAuMjUzLjE4NTo4MF8xNTg3MDg2NTgwNDky__1587086580726; wb_at=LMjFoOlFPCjHMfsFibmShmmHMKhEMgkFMbsSMglFoCgRy8gG9BrXZAKmb6nuEy7vEi7rF5qxGMFtFMfnEpcublshSPriZ5vraocoakvrZPcnc6vrZAKjSQGmcQCrILvrZAKybovobowuSoktCmkncACkRPwySQCoZPGkIPgmcA3sExuwF5qwHM3tFiNyEi7qGJkkXnrutmusrumrnmjJlOemctIvoseNmf4iRmwjnmknvmkorpknur; threeNumber=d0jjxhhs_false; orgManager=d0jjxhhs_false; adminOrgId=d0jjxhhs_1653013206077696; adminOrgName=d0jjxhhs_%E7%85%99%E5%8F%B0; userRoleCode=d0jjxhhs_tenantAdmin; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODcwODY2NDMsInNlc3Npb24iOiJ7XCJjbGllbnRJcFwiOlwiMTAuMjAxLjMuNTZcIixcImNyZWF0ZURhdGVcIjoxNTg3MDg2NTgwLFwiZXh0XCI6e1wib3JnU3RhdHVzXCI6XCJtdWx0aVwiLFwib3JnTWFuYWdlclwiOmZhbHNlLFwieWh0X3VzZXJuYW1lXCI6XCJTVC1NMlZtTVdKa09UZ3RNamMwWmkwME9UUmlMVGhsTVRjdFpUaG1NMkpoWXpGaE5HSTVfYUhSMGNEb3ZMekV3TGpFNU1DNHlOVE11TVRnMUwzZHZjbXRpWlc1amFDOXNiMmRwYmw5c2FXZG9kRDk1YUhSa1pYTjBkWEpzUFM5NWFIUnpjMjlwYzJ4dloybHVKbmxvZEhKbFlXeHpaWEoyYVdObFBXaDBkSEE2THk4eE1DNHhPVEF1TWpVekxqRTROUS4uXzE1ODcwODY1ODA1MTAtUW1WZm5kdVA5cDZmVW5nQmpZbngtMTAuMTkwLjI1My4xODVfXzNlZjFiZDk4LTI3NGYtNDk0Yi04ZTE3LWU4ZjNiYWMxYTRiOVwiLFwiYWRtaW5cIjp0cnVlLFwibG9nb1wiOlwiaHR0cDovLzEwLjE5MC4yNTMuMTg1OjgwL2FwcHRlbmFudC9pbWFnZXMvTE9HTy5wbmdcIixcInlodF91c2VydG9rZW5cIjpcIkJ0dDNMeHZYbklUMnJpRUtQcWxDQUxlWjl5YlpMc2thaTVPcUhtUjJ0b0ozSXpzRmpTSnNjM1VncjQ0dkdJNFlFcUhqaWJSaCtpT2JTeTd6a0xWekVnPT1cIixcInlodF9hY2Nlc3NfdG9rZW5cIjpcImJ0dFpYUmxjMGc0U1V4Uk9VNWxXRXA0WmxOTmRFUklXRGtyUTFscFpYTlpPRzB3ZVcwMmNqbERhMlpXV2tRMFoyMVdaa0ZzTUhrNGVpdFdUekkxTVdJdlpGVkJkRGRrTW1WNFFVSm1hR2hGUkRocVVtRlJSbWRDVVc5NFVsZDFjblZZVjBSWGRHWkhURk0yVFUwOVh6TmxaakZpWkRrNExUSTNOR1l0TkRrMFlpMDRaVEUzTFdVNFpqTmlZV014WVRSaU9WOHhNQzR4T1RBdU1qVXpMakU0TlRvNE1GOHhOVGczTURnMk5UZ3dORGt5X18xNTg3MDg2NTgwNzI2XCIsXCJ0aHJlZU51bWJlclwiOmZhbHNlfSxcImp3dEV4cFNlY1wiOjYwLFwiand0VmFsaWREYXRlXCI6MCxcImxhc3REYXRlXCI6MTU4NzA4NjU4MyxcImxvY2FsZVwiOlwiemhfQ05cIixcInByb2R1Y3RMaW5lXCI6XCJkaXdvcmtcIixcInNlc3Npb25FeHBNaW5cIjoyMTYwLFwic2Vzc2lvbklkXCI6XCJMTWpGb09sRlBDakhNZnNGaWJtU2htbUhNS2hFTWdrRk1ic1NNZ2xGb0NnUnk4Z0c5QnJYWkFLbWI2bnVFeTd2RWk3ckY1cXhHTUZ0Rk1mbkVwY3VibHNoU1ByaVo1dnJhb2NvYWt2clpQY25jNnZyWkFLalNRR21jUUNySUx2clpBS3lib3ZvYm93dVNva3RDbWtuY0FDa1JQd3lTUUNvWlBHa0lQZ21jQTNzRXh1d0Y1cXdITTN0RmlOeUVpN3FHSmtrWG5ydXRtdXNydW1ybm1qSmxPZW1jdEl2b3NlTm1mNGlSbXdqbm1rbnZta29ycGtudXJcIixcInNvdXJjZUlkXCI6XCJkaXdvcmtcIixcInRlbmFudElkXCI6XCJkMGpqeGhoc1wiLFwidXNlcklkXCI6XCIzZWYxYmQ5OC0yNzRmLTQ5NGItOGUxNy1lOGYzYmFjMWE0YjlcIn0iLCJzdWIiOiJkaXdvcmsifQ._9NMNet6Ig8TzRhPbLONxTeBPmbWn00wLvhBMDuIjX4"
                },
                //要代理访问的对方路由
                router: [
                    //  '/demo-server',
                    '/u8c-baseservice',
                    '/treecard',
                    '/currency',
                    '/upc-fe',
                    '/org-fe',
                    '/premises-cdn',
                    '/workbench',
                    '/fepages',
                    '/treecard',
                    '/cooperation',
                    '/department',
                    '/contract'
                ],
                url: "http://10.190.253.185"
            },
            {
                enable: true,
                headers: {
                    "Referer": "http://127.0.0.1:8080/",
                    "Cookie": "locale=zh_CN; org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE=zh_CN; _yht_code_uuid=9694c2c1-5a1a-42d9-8eb9-091beadad443; at=ab6d10d4-7536-4292-bc4d-0fe7300007bb; yonyou_uid=3ef1bd98-274f-494b-8e17-e8f3bac1a4b9; yonyou_uname=%25E6%259D%258E%25E7%25BF%2594%25E5%25AE%2587; yht_username=ST-M2VmMWJkOTgtMjc0Zi00OTRiLThlMTctZThmM2JhYzFhNGI5_aHR0cDovLzEwLjE5MC4yNTMuMTg1L3dvcmtiZW5jaC9sb2dpbl9saWdodD95aHRkZXN0dXJsPS95aHRzc29pc2xvZ2luJnlodHJlYWxzZXJ2aWNlPWh0dHA6Ly8xMC4xOTAuMjUzLjE4NQ.._1587086580510-QmVfnduP9p6fUngBjYnx-10.190.253.185__3ef1bd98-274f-494b-8e17-e8f3bac1a4b9; yht_usertoken=Btt3LxvXnIT2riEKPqlCALeZ9ybZLskai5OqHmR2toJ3IzsFjSJsc3Ugr44vGI4YEqHjibRh%2BiObSy7zkLVzEg%3D%3D; yht_access_token=bttZXRlc0g4SUxROU5lWEp4ZlNNdERIWDkrQ1lpZXNZOG0weW02cjlDa2ZWWkQ0Z21WZkFsMHk4eitWTzI1MWIvZFVBdDdkMmV4QUJmaGhFRDhqUmFRRmdCUW94Uld1cnVYV0RXdGZHTFM2TU09XzNlZjFiZDk4LTI3NGYtNDk0Yi04ZTE3LWU4ZjNiYWMxYTRiOV8xMC4xOTAuMjUzLjE4NTo4MF8xNTg3MDg2NTgwNDky__1587086580726; wb_at=LMjFoOlFPCjHMfsFibmShmmHMKhEMgkFMbsSMglFoCgRy8gG9BrXZAKmb6nuEy7vEi7rF5qxGMFtFMfnEpcublshSPriZ5vraocoakvrZPcnc6vrZAKjSQGmcQCrILvrZAKybovobowuSoktCmkncACkRPwySQCoZPGkIPgmcA3sExuwF5qwHM3tFiNyEi7qGJkkXnrutmusrumrnmjJlOemctIvoseNmf4iRmwjnmknvmkorpknur; threeNumber=d0jjxhhs_false; orgManager=d0jjxhhs_false; adminOrgId=d0jjxhhs_1653013206077696; adminOrgName=d0jjxhhs_%E7%85%99%E5%8F%B0; userRoleCode=d0jjxhhs_tenantAdmin; jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODcwODY2NDMsInNlc3Npb24iOiJ7XCJjbGllbnRJcFwiOlwiMTAuMjAxLjMuNTZcIixcImNyZWF0ZURhdGVcIjoxNTg3MDg2NTgwLFwiZXh0XCI6e1wib3JnU3RhdHVzXCI6XCJtdWx0aVwiLFwib3JnTWFuYWdlclwiOmZhbHNlLFwieWh0X3VzZXJuYW1lXCI6XCJTVC1NMlZtTVdKa09UZ3RNamMwWmkwME9UUmlMVGhsTVRjdFpUaG1NMkpoWXpGaE5HSTVfYUhSMGNEb3ZMekV3TGpFNU1DNHlOVE11TVRnMUwzZHZjbXRpWlc1amFDOXNiMmRwYmw5c2FXZG9kRDk1YUhSa1pYTjBkWEpzUFM5NWFIUnpjMjlwYzJ4dloybHVKbmxvZEhKbFlXeHpaWEoyYVdObFBXaDBkSEE2THk4eE1DNHhPVEF1TWpVekxqRTROUS4uXzE1ODcwODY1ODA1MTAtUW1WZm5kdVA5cDZmVW5nQmpZbngtMTAuMTkwLjI1My4xODVfXzNlZjFiZDk4LTI3NGYtNDk0Yi04ZTE3LWU4ZjNiYWMxYTRiOVwiLFwiYWRtaW5cIjp0cnVlLFwibG9nb1wiOlwiaHR0cDovLzEwLjE5MC4yNTMuMTg1OjgwL2FwcHRlbmFudC9pbWFnZXMvTE9HTy5wbmdcIixcInlodF91c2VydG9rZW5cIjpcIkJ0dDNMeHZYbklUMnJpRUtQcWxDQUxlWjl5YlpMc2thaTVPcUhtUjJ0b0ozSXpzRmpTSnNjM1VncjQ0dkdJNFlFcUhqaWJSaCtpT2JTeTd6a0xWekVnPT1cIixcInlodF9hY2Nlc3NfdG9rZW5cIjpcImJ0dFpYUmxjMGc0U1V4Uk9VNWxXRXA0WmxOTmRFUklXRGtyUTFscFpYTlpPRzB3ZVcwMmNqbERhMlpXV2tRMFoyMVdaa0ZzTUhrNGVpdFdUekkxTVdJdlpGVkJkRGRrTW1WNFFVSm1hR2hGUkRocVVtRlJSbWRDVVc5NFVsZDFjblZZVjBSWGRHWkhURk0yVFUwOVh6TmxaakZpWkRrNExUSTNOR1l0TkRrMFlpMDRaVEUzTFdVNFpqTmlZV014WVRSaU9WOHhNQzR4T1RBdU1qVXpMakU0TlRvNE1GOHhOVGczTURnMk5UZ3dORGt5X18xNTg3MDg2NTgwNzI2XCIsXCJ0aHJlZU51bWJlclwiOmZhbHNlfSxcImp3dEV4cFNlY1wiOjYwLFwiand0VmFsaWREYXRlXCI6MCxcImxhc3REYXRlXCI6MTU4NzA4NjU4MyxcImxvY2FsZVwiOlwiemhfQ05cIixcInByb2R1Y3RMaW5lXCI6XCJkaXdvcmtcIixcInNlc3Npb25FeHBNaW5cIjoyMTYwLFwic2Vzc2lvbklkXCI6XCJMTWpGb09sRlBDakhNZnNGaWJtU2htbUhNS2hFTWdrRk1ic1NNZ2xGb0NnUnk4Z0c5QnJYWkFLbWI2bnVFeTd2RWk3ckY1cXhHTUZ0Rk1mbkVwY3VibHNoU1ByaVo1dnJhb2NvYWt2clpQY25jNnZyWkFLalNRR21jUUNySUx2clpBS3lib3ZvYm93dVNva3RDbWtuY0FDa1JQd3lTUUNvWlBHa0lQZ21jQTNzRXh1d0Y1cXdITTN0RmlOeUVpN3FHSmtrWG5ydXRtdXNydW1ybm1qSmxPZW1jdEl2b3NlTm1mNGlSbXdqbm1rbnZta29ycGtudXJcIixcInNvdXJjZUlkXCI6XCJkaXdvcmtcIixcInRlbmFudElkXCI6XCJkMGpqeGhoc1wiLFwidXNlcklkXCI6XCIzZWYxYmQ5OC0yNzRmLTQ5NGItOGUxNy1lOGYzYmFjMWE0YjlcIn0iLCJzdWIiOiJkaXdvcmsifQ._9NMNet6Ig8TzRhPbLONxTeBPmbWn00wLvhBMDuIjX4"
                },
                //要代理访问的对方路由
                router: [
                    '/demo-server',
                ],
                url: "http://127.0.0.1:8080/"
            }
        ],
        // 静态托管服务
        static: 'ucf-common/src',
        // 展开打包后的资源文件，包含图片、字体图标相关
        res_extra: true,
        // 构建资源的时候产出sourceMap，调试服务不会生效
        open_source_map: true,
        // CSS loader 控制选项
        css: {
            modules: false
        },
        // 全局环境变量
        global_env: {
            'process.env.__CLIENT__': JSON.stringify(false),//让mdf2.0不加载lang文件，后期可能会去掉
            __MODE__: JSON.stringify(env),
            'process.env.NODE_ENV': JSON.stringify(env),
            'process.env.STATIC_HTTP_PATH': env == 'development' ? JSON.stringify(`./static`) : JSON.stringify("../static"),
            'pom.fe.mdf.ctx': env == 'development' ? JSON.stringify("/u8c-baseservice") : JSON.stringify('${pom.fe.mdf.ctx}'),//参照上下文   例如：/upc-fe/uniform
            'pom.fe.new.ctx': env == 'development' ? JSON.stringify("/demo-server") : JSON.stringify('${pom.fe.new.ctx}'),//一主多子
            'pom.fe.print.domain': env == 'development' ? JSON.stringify('http://172.20.48.11') : JSON.stringify('${pom.fe.print.domain}'),//打印
            'pom.fe.ys.domain': env == 'development' ? JSON.stringify('http://172.20.48.11') : JSON.stringify('${pom.fe.ys.domain}'),//流程
            'pom.fe.attchment.domain': env == 'development' ? JSON.stringify('http://172.20.48.11') : JSON.stringify('${pom.fe.attchment.domain}')//附件
        },
        // 别名配置
        alias: {
            components: path.resolve(__dirname, 'ucf-common/src/components/'),
            utils: path.resolve(__dirname, 'ucf-common/src/utils/'),
            static: path.resolve(__dirname, 'ucf-common/src/static/'),
            styles: path.resolve(__dirname, 'ucf-common/src/styles/')
        },
        // 构建排除指定包
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "tinper-bee": "TinperBee",
            "prop-types": "PropTypes",
            "jDiwork": "jDiwork"
        },
        // 加载器Loader
        loader: [
            {
                test: /\.(map)$/,
                loader: 'ignore-map-loader',
                include: path.resolve('node_modules/@mdf'),
            }
        ],
        // 调试服务需要运行的插件
        devPlugins: [],
        // 构建服务需要运行的插件
        buildPlugins: [
            new CopyWebpackPlugin([
                {
                    from: 'ucf-common/src/static/',
                    to: `static`
                }
            ])
        ],
    }
}
