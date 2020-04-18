(function () {
    var script = document.createElement("script");
    script.src = `../static/iform_web/u8c/main.js`;
    script.setAttribute("async", true);
    var flowCompOptions = null;
    window.flowComp = function (options) {
      flowCompOptions = options;
    }
    window.flowCompParams = {
      host: 'https://yb-u8c-daily.yyuap.com'
    }
    window.addEventListener("DOMContentLoaded", function () {
      document.querySelector("body").appendChild(script);
      script.onload = function () {
        flowCompOptions && window.flowComp(flowCompOptions)
      }
    })
  })()