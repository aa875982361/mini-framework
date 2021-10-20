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
    const { eventName = "" } = data
    console.log("page 是否存在对应的方法", !!page[eventName]);
    console.log("event", data.event);
    
    page[eventName] && page[eventName](data.event)
}
/**
 *  通信层发送数据方法名
 */
const sendMessageToRenderName = "logicSendMessageToRender"
/**
 * 发送数据到渲染层
 * @param data 数据
 */
function sendMessageToRender(data: any){
    /** 发送信息给渲染层的方法名 */
    parent.window[sendMessageToRenderName](data)
}

/**
 * 小程序初始化方法
 */
function App(AppConfig: any){

}

// 引入某个页面的逻辑
const page: any = {
    setData: function(data: any, callback?: () => {}) {
        console.log("page setdata", data);
        sendMessageToRender(data)
        callback && callback()
    },
    onLoad: function(): void{
        console.log("page onload");
        const renderPage = require("./render/render.js")
        console.log("renderPage", renderPage);
        renderPage.run({page})
    }
}

page.onLoad()

