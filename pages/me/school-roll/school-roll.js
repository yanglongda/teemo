const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    userBaseInfo: {}
  },
  // 获取学籍信息
  getSchoolRollInfo() {
    let url = api.getSchoolRollInfo;
    let method = 'POST';
    let header = 'application/json';
    let data = {};
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.userBaseInfo) {
          this.setData({
            userBaseInfo: res.userBaseInfo
          })
        }
      }
    })
  },
  onLoad() {
    this.getSchoolRollInfo();
    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
  goBack() {
    my.navigateBack();
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  }
});
