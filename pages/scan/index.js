const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    id: '',
    failure: false,
    text: '无法识别二维码，请确认后重试',
    pages: ''
  },
  onLoad(options) {
    console.log(options);
    if (options.code == 'failure') {
      this.setData({
        failure: true,
        pages: options.pages
      })
    } else {
      this.setData({
        id: options.code,
        failure: false,
        pages: options.pages
      })
      this.qrcode(options.code, 'scanned')
    }
  },

  qrcode(id, state) {
    let apiUrl = api.storeUserInfo
    let data = {
      qrcode: id,
      status: state
    }
    let method = 'POST'
    let header = 'application/x-www-form-urlencoded'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 500) {
        this.setData({
          failure: true,
          text: '二维码已过期，请刷新登录页再扫码'
        })
      }
    })
  },

  confirm() {
    let me = this;
    this.qrcode(this.data.id, 'confirmed');
    my.showLoading({
      content: '加载中',
    });
    setTimeout(function() {
      if (me.data.pages == 'me') {
        my.switchTab({
          url: '/pages/me/me/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
        });
      } else {
         my.switchTab({
          url: '/pages/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
        });
      }
    }, 1000)
  },
  cancel() {
    let me = this;
    this.qrcode(this.data.id, 'canceled');
    my.showLoading({
      content: '加载中',
    });
    setTimeout(function() {
      if (me.data.pages == 'me') {
        my.switchTab({
          url: '/pages/me/me/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
        });
      } else {
         my.switchTab({
          url: '/pages/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
        });
      }

    }, 1000)
  },
  onScan() {
    my.scan({
      type: 'qr',
      success: (res) => {
        if (new RegExp("^lg#1#d#.*$").test(res.code)) {
          my.navigateTo({
            url: '/pages/scan/index?code=' + res.code + "&pages=" + this.data.pages
          });
        } else {
          my.navigateTo({
            url: '/pages/scan/index?code=failure' + "&pages=" + this.data.pages
          });
        }
      },
    });
  },
});
