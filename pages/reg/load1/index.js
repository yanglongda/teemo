const app = getApp()
const api = require('/bin/api/index.js');
Page({
  data: {},
  onLoad(options) {
    // let qrCode = options.qrCode;
    // let bizContent = options.bizContent;
    my.getAuthCode({
      scopes: ['auth_user', 'auth_ecard'],
      success: (res) => {
        let url = api.qrCodeLogin;
        let method = 'POST';
        let header = "application/json";
        let data = {
          authCode: res.authCode,
          qrCode: app.getGlobalLocalStorage("qrCode") 
        };
        app.request(url, data, method, header, false).then(res => {
          if (res.code == 0) {
            app.setGlobalLocalStorage('cardNo', res.cardInfo.cardNo);
            app.setGlobalLocalStorage('reloadIndex', true);
            my.switchTab({
              url: '/pages/index/index',
            });
          }
          if (res.code == 500) {
            my.redirectTo({
              url: '../../results/error-page1/index?type=child&message=' + res.name
            });
          }
          if(res.code == 501){
            my.redirectTo({
              url: '../../results/error/index?errorInfo=' + res.msg +'&isBinding=true'
            });
          }
        })
      },
      fail: (res) => {
        my.hideLoading();
      }
    });

    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  }
});
