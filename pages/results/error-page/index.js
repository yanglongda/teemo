
const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    type: '',
    message:'可能身份证输入有误哦~',
    hidden:true,
    isSubCode:false
  },
  submitAgain() {
    if (this.data.type == 'self') {
      my.redirectTo({
        url: '../auth-self/index?type=1&userRole=',
      });
    } else {
      my.redirectTo({
        url: '../auth/index?type=2&userRole=',
      });
    }

  },
  onLoad(options) {
    if(options.isSubCode){
      this.setData({
        isSubCode:true
      })
    }
    this.setData({
      type: options.type,
      message:options.message
    })
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
  },
});
