/**
 * 渲染层
 */
const KBoneUI = require('kbone-ui') // 只引入内置组件

KBoneUI.default.register()
 
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
        const vdoms: VDom[] = data.vdoms
        const documentFrame = document.createDocumentFragment()
        vdoms.map(vdom => {
            const realDom = renderVdom(vdom)
            if(realDom){
                documentFrame.appendChild(realDom)
            }
        })
        console.log("渲染页面", documentFrame);
        
        document.getElementById("app")?.append(documentFrame)
    }
}

function renderVdoms(vdoms: VDom[] = []): DocumentFragment{
    const fragement = document.createDocumentFragment()
    vdoms.map(vdom => {
        const realDom = renderVdom(vdom)
        if(realDom){
            fragement.appendChild(realDom)
        }
    })
    return fragement
}

function renderVdom(vdom: VDom): Element | Text | undefined{
    const {tagName = "", attributes = [], content, children = [], uid} = vdom
    if(!tagName && typeof content === "undefined"){
        return
    }
    if(!tagName){
        return document.createTextNode(content as string)
    }
    let realTagName = "wx-" + tagName
    if(tagName === "text"){
        realTagName = "span"
    }
    const realDom = document.createElement(realTagName)
    realDom.id = uid + ""
    attributes.map((attribute: Attribute) => {
        if(attribute.key.indexOf("bind") === 0){
            const eventName = attribute.key.replace(/bind:?/, "")
            console.log("addEventListener", eventName);
            realDom.addEventListener(eventName, function(event){
                console.log("event", eventName, event);
                sendMessageToLogic({
                    pageId: "1",
                    eventName: attribute.value,
                    event
                })
            })
        }else{
            realDom.setAttribute(attribute.key, attribute.value + "")
        }
    })
    // 处理子节点
    if(children && children.length > 0){
        const childFragement = renderVdoms(children)
        realDom.appendChild(childFragement)
    }
    
    return realDom
}
