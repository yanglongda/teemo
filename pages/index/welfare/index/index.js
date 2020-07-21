const app = getApp();
Page({
  data:{
    webViewUrl:'https://yqjk.jxedu.gov.cn?cardId=&globalToken=',
  },
  onLoad() {
    this.webViewContext = my.createWebViewContext('web-view-1');
    console.log(app.getGlobalLocalStorage('cardId'))
    let cardId = app.getGlobalLocalStorage('cardId');
    let globalToken = app.getGlobalLocalStorage('globalToken');
    let url = `https://yqjk.jxedu.gov.cn?cardId=${cardId}&globalToken=${globalToken}`;
    this.setData({
      webViewUrl: url
    })

  },
  // 接收来自H5的消息
  onMessage(e) {
    console.log(e); //{'sendToMiniProgram': '0'}
    // 向H5发送消息
  this.webViewContext.postMessage({'sendToWebView': '1'});
  }
})
