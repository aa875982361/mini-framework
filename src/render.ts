/**
 * 渲染层
 */
 const KBoneUI = require('kbone-ui/wx-components') // 只引入内置组件

 KBoneUI.register()
interface VDom {
    uid?: number,
    type?: string,
    tagName?: string,
    attributes?: Attribute[],
    children?: VDom[],
    content?: string,
    dataSet?: object
}

interface Attribute {
    key: string,
    value: string | boolean
}

console.log("渲染层逻辑")
/**
 *  通信层发送数据方法名
 */
 const sendMessageToLoficName = "renderSendMessageToLogic"
 /**
  * 发送数据到渲染层
  * @param data 数据
  */
 function sendMessageToLogic(data: any){
     /** 发送信息给渲染层的方法名 */
     parent.window[sendMessageToLoficName](data)
 }
// 子窗口接收数据
const renderAcceptMessageName = "onMyMessage";
/** 渲染层接收到外部传入的数据，根据传入数据渲染页面 */
(window as any)[renderAcceptMessageName] = function(data: any){
    console.log("渲染层接收到数据", data);
    if(data?.vdoms){
        
    }
}
