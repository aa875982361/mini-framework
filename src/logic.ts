/** 
 * 逻辑层
 */
 declare interface Window {
    App: Function,
    Page: Function,
    wx: any,
    process: any,
    onMyMessage: Function,

}
declare var wx: any

console.log("逻辑层");



// ----------------------- 引入微信的能力模拟实现 taro-h5 ------------
window.process = {
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
window.wx = Taro
// 小程序里getSystemInfo 是同步的
wx.getSystemInfo = Taro.getSystemInfoSync.bind(Taro)
console.log("taro.getSystemInfo", Taro.getSystemInfo());
const res = wx.getSystemInfo()
console.log("wx.getSystemInfoSync", res);

// 子窗口接受数据的处理函数
window.onMyMessage = function(data: any){
    console.log("逻辑层接收到数据", data);
    const { eventName = "" } = data
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

// ---------------------------- 小程序初始化函数 ------------------------
/**
 * 回调id映射回调函数
 */
interface CallbackMap {
    [id: string | number]: any;
}
/**
 * 页面注册对象
 */
interface PageObj {
    data?: any,
    onLoad?: Function,
    onReady?: Function,
    onShow?: Function,
    onHide?: Function,
    onUnload?: Function,
    onPullDownRefresh?: Function,
    onReachBottom?: Function,
    onShareAppMessage?: Function,
}

/**
 * 页面实例拥有的内部方法
 */
interface PageInstanceInner {
    isRender: Boolean,
    setData: Function,
    firstRender: Function,
    sendMessageToRender: Function
}

/**
 * 页面实例类型
 */
type PageInstance = PageInstanceInner & PageObj
/**
 * id和页面注册对象的映射
 */
interface PageObjMap {
    [pageId: number | string] : PageObj
}


const BASE_KEY = [
    'data',
    'onLoad',
    'onReady',
    'onShow',
    'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onShareAppMessage',
]
const CAN_RUN_BASE_KEY = ["onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom", "onShareAppMessage"]
const callbackMap: CallbackMap = {}
let callbackId = 1
const maxCallbackId = 1 << 30

/**
 * 传入回调函数获得一个回调id，后面根据回调id运行回调函数
 * @param {*} callback 回调函数
 * @param {*} pageObj 绑定对象
 * @returns 
 */
function getCallbackId(callback: Function, pageObj: any){
    if(typeof callback === "function"){
        // 上一个callbackid+1 
        const currentId = callbackId++
        callbackMap[currentId] = callback.bind(pageObj)
        if(callbackId > maxCallbackId){
            callbackId = 1
        }
        return currentId
    }
    return -1
}
/**
 * 根据id找到回调函数并运行
 * @param {*} id 
 */
function runCallbackById(id: number){
    const callback = callbackMap[id]
    if(typeof callback === "function"){
        callback()
    }
}
/**
 * 获得一个传输数据对象
 * @param {*} data 渲染数据
 * @param {*} pageObj 页面对象
 * @param {*} callback 回调函数
 * @returns 
 */
function getSendMessageObj(data: any, pageObj: any, callback: Function){
    const callbackId = getCallbackId(callback, pageObj)
    return {
        pageId: pageObj.id,
        data: data,
        callbackId
    }
}
/**
 * 渲染页面
 * @param pageInstance 
 */
function PageRun(pageInstance: PageInstance){
    // console.log("pageInstance", pageInstance);
    // 初始化页面逻辑
    if(!pageInstance.data){
        pageInstance.data = {}
    }

    // 处理内部页面的setData
    pageInstance.setData = function(obj: any = {}, callback: Function){
        // console.log("inner page setData", obj);
        Object.keys(obj).map(key => {
            let nValue = obj[key]
            // TODO: 没有处理 'a.b.c': 777 的情况
            pageInstance.data[key] = nValue
        })
        // 上面是先赋值给页面data，然后再传递数据给渲染层
        // 如果在页面还没有渲染就调用setData，丢弃，不处理，因为首次渲染会将全部data传递给渲染层
        if(pageInstance.isRender){
            // 传递数据给渲染层，并设置渲染完成的回调
            pageInstance.sendMessageToRender(obj, callback)
        }
    }

    /**
     * 发送数据给渲染层
     * @param {*} data 
     * @param {*} callback 
     */
    pageInstance.sendMessageToRender = function(data: any, callback: Function){
        // 向渲染层发送整个渲染data，并设置回调function
        const sendData = getSendMessageObj(data, pageInstance, callback)
        pageInstance.isRender = true
        sendMessageToRender(sendData)
    }

    /**
     * 首次渲染
     */
    pageInstance.firstRender = function(){
    // 调用发送数据给渲染层
        pageInstance.sendMessageToRender(pageInstance.data, pageInstance, firstRenderCallback)
    }

    // 处理不会运行的生命周期函数
    /** 首次渲染回调 */
    const firstRenderCallback = function(cb: Function){
        console.log("firstRenderCallback");
        if(typeof cb === "function"){
            cb.call(pageInstance)
        }
        // 页面渲染完成
        if(typeof pageInstance.onReady === "function"){
            pageInstance.onReady()
        }

        // 页面渲染完成
        if(typeof pageInstance.onShow === "function"){
            pageInstance.onShow()
        }
        wx.hideLoading({})
    }
    // 先运行onLoad
    if(pageInstance.onLoad){
        pageInstance.onLoad()
    }
    // 再触发首次渲染
    pageInstance.firstRender()
}
/**
 * 小程序初始化方法
 */
window.App = function App(AppConfig: any){

}
/**
 * 图片的映射
 */
const pageObjMap: PageObjMap = {}
let pageObjId = 1
let currentPageObjId = pageObjId
/**
 * 小程序页面初始化
 */
window.Page = function Page(pageObj: any) {
    console.log("page", pageObj);
    pageObj.id = pageObjId
    currentPageObjId = pageObjId
    pageObjMap[pageObjId] = pageObjMap
    pageObjId++
}

// ----------------------- 加载外部js ----------------------------
// 解决循环依赖问题
const cloneObjMap = {}
/** 深复制 */
function deepClone(obj: any): any {
    if (!obj || typeof obj !== "object") { 
        return obj
    }
    const isArray = Array.isArray(obj)

    const clone: any = isArray ? [] : Object.assign({}, obj)
    if(isArray){
        for(let i=0; i<obj.length; i++){
            obj[i] = deepClone(obj[i])
        }
    }else{
        Object.keys(clone).forEach((key: string) => {
            const value = obj[key]
            clone[key] = deepClone(value)
          },
        )
    }
    return clone
}
  
/**
 * 加载js文件
 * @param url 
 * @param callback 
 */
function loadJs(url: string, callback?: Function) {
    // 增加一个脚本标签
    const script = document.createElement("script")
    const fn = callback || function (){}
    script.type = "text/javascript"

    script.onload = function onload() {
        fn()
    }
    script.src = url
    document.getElementsByTagName("head")[0].appendChild(script)
}

loadJs("http://192.168.120.64:8091/js/logic/calculate.es5.js", ()=>{
    console.log("资源加载成功");
    console.log("currentPageObjId", currentPageObjId);
    const pageObj = pageObjMap[currentPageObjId]
    console.log("当前的pageObj", pageObj);
    const pageInstance = deepClone(pageObj)
    
})


