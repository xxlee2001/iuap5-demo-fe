(function () {
    var script = document.createElement("script");
    script.src = "https://yb-u8c-daily.yyuap.com/iform_web/flow-comp/main.js?_=1566793206907";
    script.setAttribute("async", true);
    var flowCompOptions = null;
    window.flowComp = function (options) {
        flowCompOptions = options;
    }
    window.flowCompParams = {
        host: "https://yb-u8c-daily.yyuap.com"
    }
    window.addEventListener("DOMContentLoaded", function () {
        document.querySelector("body").appendChild(script);
        script.onload = function () {
            flowCompOptions && window.flowComp(flowCompOptions)
        }
    })
})()