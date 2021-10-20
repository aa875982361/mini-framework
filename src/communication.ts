/**
 * 通信逻辑
 */
console.log("系统层逻辑");

// 父窗口的方法

// 子窗口接受数据的function
const childWindowOnMessageName = "onMyMessage";
/**
 * 发送数据到另外一个节点
 * @param id 
 * @param data 
 */
function sendMessage(id: string, data: any): void{
    console.log("sendMessage", id, data);
    
    const iframe: Element | null = document.getElementById(id)
    if(!iframe){
        console.error("找不到ifram，id为：", id);
        return
    }
    const childWindow = (<HTMLIFrameElement>iframe).contentWindow
    // 检查是否注册完成
    if(childWindow?.document?.readyState=="complete"){
        // 注册完成才发消息
        (childWindow as any)[childWindowOnMessageName](data)
    }else{
        // 没有注册完成 则等待完成之后发消息
        const oldOnload = childWindow?.onload
        childWindow && (childWindow.onload = function(event: Event): void{
            oldOnload?.call(this, event)
            console.log("iframe 初始化完成 传入通信数据");
            (childWindow as any)[childWindowOnMessageName](data)
        })
        console.info("iframe 没有初始化完成，等待初始化完成才通信， id:", id)
    }
}
/**
 * 传递数据给渲染层
 * @param data 数据
 */
function logicSendMessageToRender(data: any){
    sendMessage("render", data)
}
/**
 * 传递数据给逻辑层
 * @param data 数据
 */
function renderSendMessageToLogic(data: any){
    sendMessage("logic", data)
}

window.logicSendMessageToRender = logicSendMessageToRender
window.renderSendMessageToLogic = renderSendMessageToLogic