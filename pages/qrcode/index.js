import drawQrcode from '../../utils/weapp.qrcode.esm.js';
const app = getApp();
const api = require('/bin/api/index.js');
const common = require('/bin/common/common.js')

Page({
  data: {
    avatar: '',
    name: '',
    studyNo: ''
  },
  onLoad() {
    // 禁止页面下拉
   if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
  onReady() {
    let me = this;
    if (app.getGlobalLocalStorage("cardNo")) {
      common.getCardInfo(function() {
        me.setData({
          avatar: app.getGlobalLocalStorage("cardInfo").avatar,
          name: app.getGlobalLocalStorage("cardInfo").name,
          studyNo: app.getGlobalLocalStorage("cardInfo").studyId
        })
        me.refreshCode(false);
      });
    }

  },
  refreshCode(force) {
    let me = this;
    my.showLoading({
      content: '加载中...'
    });
    me.getQrcode(force)
    me.data.inter = setInterval(function() {
      me.getQrcode(force)
    }, 5000)
  },

  forceRefreshCode() {
    my.showLoading({
      content: '加载中...'
    });
    this.getQrcode(true);
  },

  getQrcode(force) {
    let url = api.getQrcode + "?force=" + force;
    let method = 'POST';
    let header = 'application/json';
    let data = {
      // idCard:app.getGlobalUserInfo("idCard").idCard
    };
    if (force) {
      data = {
        force: true
      }
    }
    app.request(url, data, method, header, false).then(res => {
      my.hideLoading();
      if (res.code == 0) {
        drawQrcode({
          width: 180,
          height: 180,
          canvasId: 'myQrcode',
          // ctx: my.createCanvasContext('myQrcode'),
          text: res.qrcode.codeValue,
          // v1.0.0+版本支持在二维码上绘制图片
        })
      }
    })
  },
  onShow() {

  },
  onUnload() {
    clearInterval(this.data.inter)
    // 页面隐藏
  }

});
