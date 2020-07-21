const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    goalItem: {},
    goalId: '',
    btnBg:'btn-bg',
    isDisplay:false
  },
  onLoad(options) {
    if (options.goalId) {
      this.setData({
        goalId: options.goalId
      })
      let apiUrl = api.getGoalsDetails + '?goalId=' + options.goalId
      let data = {}
      let method = 'GET'
      let header = 'application/json'
      app.request(apiUrl, data, method, header, false).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.setData({
            goalItem: res.data,
            isDisplay:true
          })
        }
      })
    }
  },

  addGoals() {
    let apiUrl = api.addGoals + '?goalId=' + this.data.goalId
    let data = {
      goalId: this.data.goalId
    }
    let method = 'POST'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, true).then(res => {
      if (res.code == 0) {
        this.setData({
          btnBg:'btn-bg-gray'
        })
        my.showToast({
          type: 'success',
          content: '添加成功',
          duration: 2000,
          success: () => {
            my.navigateBack({ delta: 2 })
          },
        });
      }
    })
  }
});
