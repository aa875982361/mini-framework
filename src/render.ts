/**
 * 渲染层
 */
import Vue, { VNode } from "vue"
const KboneUI = require("./render/kbone-ui")

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

console.log("KboneUI", KboneUI)
// 引入weui组件
Vue.use(KboneUI)
console.log("初始化vue节点", (Vue as any)?.options?.components);

var app3 = new Vue({
    el: '#app',
    data: {
        seen: true
    },
    render: function(creatElememt, hook): VNode{
        return creatElememt("k-button",undefined, ["666"])
    },
    mounted: function(){
        console.log("mounted");
    }
})



