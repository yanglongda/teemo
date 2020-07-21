
const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    type: '',
    message:'可能身份证输入有误哦~',
    hidden:true
  },
  submitAgain() {
    my.redirectTo({
      url: '../identity-select/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
    });
    // if (this.data.type == 'self') {
    //   // my.redirectTo({
    //   //   url: '../auth-self/index?type=1&userRole=',
    //   // });
    // } else {
    //   // my.redirectTo({
    //   //   url: '../auth/index?type=2&userRole=',
    //   // });
    // }

  },
  onLoad(options) {
    console.log(options,'33333');
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
