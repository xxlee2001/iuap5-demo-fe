//更新参照，修改参照内字体资源地址
const exec = require('child_process').exec;
const os = require('os');
let replaceCmd = 'cp -R node_modules/@yonyou/mdf-refer/dist/* ucf-common/src/static/mdf-refer/';
if(os.platform()=='win32'){//window系统
    replaceCmd = 'copy -R node_modules/@yonyou/mdf-refer/dist/* ucf-common/src/static/mdf-refer/';
}
exec(replaceCmd,error=>{//替换文件
    if(error){
        console.log(`ERROR: copy ERROR! `)
        console.log(error);
    }else{
        console.log(`SUCCESS: copy SUCCESS! `);
    }
})




