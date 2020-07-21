const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    goalList: [],
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  },
  onLoad() {
    let apiUrl = api.getGoalList
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        this.setData({
          goalList: res.data
        })
      }
    })
  },
  // 跳转到小目标的详情页面
  toDetails(event) {
    var id = event.target.dataset.form.id;
    console.log(event.target.dataset.form.id);
    my.navigateTo({
      url: '../goal-details/index?goalId=' + id
    });
  }
});
