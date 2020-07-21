const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    hasGoal: null,
    goalList: [],
  },
  onLoad() {

  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
    this.getCardGoalsList()
  },
  //获取已添加的目标列表
  getCardGoalsList() {
    let apiUrl = api.getCardGoalsList
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.setData({
            hasGoal: 2,
            goalList: res.data
          })
        } else {
          this.setData({
            hasGoal: 1,
          })
        }
      }
    })
  },
  // 跳转到添加目标页面
  redirectToAddGoal() {
    my.navigateTo({
      url: '../goal-item/index'
    });
  },
  //redirctToClock 跳转到打卡页面
  redirctToClock(event) {
    console.log(event);
    var id = event.target.dataset.form.id;
    my.navigateTo({
      url: '../goal-clock/index?goalId=' + id
    });
  },
  //跳转到目标管理页面
  redirectToGoalManage() {
    my.navigateTo({
      url: '../goal-manage/index'
    });
  },

  //跳转到勋章页面
  redirectToHonors() {
    my.navigateTo({
      url: '../goal-honor/index'
    });
  }
});
