const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    goalList: [],
  },
  onLoad() {
    this.getInfo();
  },

  getInfo() {
    let apiUrl = api.getCardGoalsList
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      let arr = [];
      if (res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(x => {
            if (x.added) {
              arr.push(x)
            }
          })
        }
        this.setData({
          goalList: arr
        })
      }
    })
  },

  deleteGoals(event) {
    let me = this;
    let id = event.target.dataset.form.id;
    console.log(id);
    let apiUrl = api.deleteGoals
    let data = {
      goalId: id
    }
    let method = 'POST'
    let header = 'application/json'
    my.confirm({
      title: '提示',
      content: '确定删除选择的目标吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          app.request(apiUrl, data, method, header, true).then(res => {
            if (res.code == 0) {
              my.showToast({
                type: 'success',
                content: '删除成功',
                duration: 1000,
                success: (res) => {
                  me.getInfo();
                },
              });
            }
          })
        }
      },
    });
  }
});
