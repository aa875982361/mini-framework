/**
 * 渲染层
 */

console.log("渲染层逻辑")
// 子窗口的函数名
const renderAcceptMessageName = "onMyMessage";
(window as any)[renderAcceptMessageName] = function(data: any){
    console.log("渲染层接收到数据", data);
}

setTimeout(() => {
    /** 发送信息给逻辑层的方法名 */
    const sendMessageToLogicName = "sendMessageToLogic"
    parent.window[sendMessageToLogicName]("我是渲染层的数据")
}, 100);
