/** 
 * 逻辑层
 */
console.log("逻辑层");

// 子窗口的函数名
const logicAcceptMessageName = "onMyMessage";
(window as any)[logicAcceptMessageName] = function(data: any){
    console.log("逻辑层接收到数据", data);
}
/** 发送信息给渲染层的方法名 */
const sendMessageToRenderName = "sendMessageToRender"
parent.window[sendMessageToRenderName]("我是逻辑层的数据")


