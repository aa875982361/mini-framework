/** 
 * 逻辑层
 */
console.log("逻辑层");
declare var wx: any

// 引入微信的能力模拟实现 taro-h5
(window as any).process = {
    env: {
        TARO_ENV: "devlopment"
    }
};
const globalObj: any = {
    ENABLE_INNER_HTML: true,
    ENABLE_ADJACENT_HTML: true,
    ENABLE_SIZE_APIS: true,
    ENABLE_TEMPLATE_CONTENT: true,
    ENABLE_CLONE_NODE: true,
};
Object.keys(globalObj).map(key => {
    (window as any)[key] = globalObj[key]
})

const Taro = require("@tarojs/taro-h5")
console.log("taro", Taro);
// Taro.getSystemInfo = Taro.getSystemInfoSync
(window as any).wx = Taro
// 小程序里getSystemInfo 是同步的
wx.getSystemInfo = Taro.getSystemInfoSync.bind(Taro)
console.log("taro.getSystemInfo", Taro.getSystemInfo());
const res = wx.getSystemInfo()
console.log("wx.getSystemInfoSync", res);



// 子窗口的函数名
const logicAcceptMessageName = "onMyMessage";
(window as any)[logicAcceptMessageName] = function(data: any){
    console.log("逻辑层接收到数据", data);
}
/**
 *  通信层发送数据方法名
 */
const sendMessageToRenderName = "sendMessageToRender"
/**
 * 发送数据到渲染层
 * @param data 数据
 */
function setMessageToRender(data: any){
    /** 发送信息给渲染层的方法名 */
    parent.window[sendMessageToRenderName](data)
}

/**
 * 小程序初始化方法
 */
function App(AppConfig: any){
    
}
