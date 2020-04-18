import { getCookie,processData,Error } from 'utils'
import request from 'utils/request';


const localeObj = {//打印地址语言对应示例节点语言
    "zh_CN":'cn',
    "en_US":'en'
}

const printOrigin =`${pom.fe.print.domain}`;
const GET_TENANT = `${pom.fe.new.ctx}/contract/session_context_info`;
const GET_PRINT_CODE = `${pom.fe.new.ctx}/contract/defaultprintcode`;

let locale = localeObj[getCookie('locale')]||'cn';

let tenantid = window.jDiworkContext&&window.jDiworkContext.tenantId;

const print = {
    /**
     * 获取打印租户ID
     * @param {*} params
     */
    requestTenant:(param) => {
        return request(GET_TENANT, {
            method: "get",
            param
        });
    },
    /**
     * 获取printcode
     * @param {*} params
     */
    requestPrintCode:() => {
        return request(GET_PRINT_CODE, {
            method: "get",
        });
    },

    printDesign:async (callback)=>{
        if(!tenantid){
            try {
                let { result } =  processData(await print.requestTenant());
                tenantid = result.data.tenantId;
            } catch (error) {
                Error('request Error');
                console.log(error);
                return
            }
        }
        let { result:res } =  processData(await print.requestPrintCode());
        let printCode = res.data.printcode;
        window.open(`${printOrigin}/u8cprint/design/getDesign?printcode=${printCode}&lang=${locale}&tenantId=${tenantid}&u8cServerCode=u8cServerCode&domainDataBaseByCode=0b3f7f67-78b9-485d-8d91-c871ab446ab9&currentMainClassCode=7c03a217-568e-4fa6-99ec-346d83cf09f2&meta=1`);
        callback&&callback()
    },
    printView:async (dataId,callback)=>{
        let serverUrl = `${window.location.origin}${pom.fe.new.ctx}/contract/dataForPrint`;
        if(dataId){
            if(!tenantid){
                try {
                    let { result } =  processData(await print.requestTenant());
                    tenantid = result.data.tenantId;
                } catch (error) {
                    Error('获取租户信息失败');
                    console.log(error);
                    return
                }
            }
            let { result:res } =  processData(await print.requestPrintCode());
            let printCode = res.data.printcode;
            window.open(`${printOrigin}/u8cprint/design/getPreview?printcode=${printCode}&lang=${locale}&tenantId=${tenantid}&serverUrl=${serverUrl}&params=${encodeURIComponent(JSON.stringify({id:dataId}))}&sendType=6&mate=1&domainDataBaseByCode=0b3f7f67-78b9-485d-8d91-c871ab446ab9&classifyCode=f3d59066-098c-4031-82d0-3e8f1a9f50a5`)
        }else{
            Error('请先选择一条数据')
        }
        callback&&callback()
    }
}

export default print;