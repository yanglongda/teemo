const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    identity: []
  },
  onLoad(query) {
     this.getUserIdentity();
    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },

  // 加载身份
  updateIdentity() {
    my.showLoading({
      content: '正在更新...',
    });
    let cardNo = app.getGlobalLocalStorage('cardNo')
    let apiUrl = api.updateIdentity
    let data = {
      // "cardNo": cardNo
    }
    let method = 'POST'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false)
      .then(res => {
        if (res.code == 0 && res.updateFlag) {
          my.showToast({
            type: 'success',
            content: '更新成功！',
            duration: 3000
          });
          this.getUserIdentity();
        } else {
          my.hideLoading();
          my.showToast({
            type: 'error',
            content: '系统繁忙，请稍后再试！',
            duration: 3000
          });
        }
      })
  },
  // 获取用户信息
  getUserIdentity() {
    let me = this;
    let url = api.getUserIdentity;
    let method = 'POST';
    let header = 'application/json'
    let data = {};
    if(my.request){
      my.request({
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-zsxx-token': app.getGlobalToken('globalToken'),
        'x-zsxx-type': app.requestHeardType,
        'x-zsxx-cardNo': app.getGlobalLocalStorage('cardNo')
      },
      success: function (res) {
        if (res.data.code == 0) {
          me.setData({
            identity: res.data.homePageInfo.identityNameList
          })
        }
        my.hideLoading();
      },
      fail: (error => {
        my.redirectTo({
          url: '/pages/error/index?errorInfo=&isSelf='
        });
      })
    })
    }
    
  },
  onShow() {
    // 小程序启动，或从后台被重新打开
    // console.log(options);
  },
  goBack() {
    my.navigateBack();
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  },
});
