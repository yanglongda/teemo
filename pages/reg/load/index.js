const app = getApp()
const api = require('/bin/api/index.js');
Page({
  data: {
  },
  onLoad() {
    my.getAuthCode({
      scopes: ['auth_user', 'auth_ecard'],
      success: (res) => {
        let url = api.initCardData + '?authCode=' + res.authCode + '&cardNo=';
        let method = 'POST';
        let header = "application/json";
        let data = {
          authCode: res.authCode,
          cardNo: ''
        };
        app.request(url, data, method, header, false).then(res => {
          console.log(res);
          if (res.code == 0) {
            my.redirectTo({
              url: '/pages/results/success/index',
            });
          }
          if (res.code == 500) {
            my.redirectTo({
              url: '/pages/results/error-page/index?type=child&message=' + res.msg
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
