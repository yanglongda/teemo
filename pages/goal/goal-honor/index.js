const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    honorList: [],
  },
  onLoad() {
    let apiUrl = api.getMedalTypeList
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      console.log(res);
      if (res.code == 0) {
        this.setData({
          honorList: res.data
        })
      }
    })
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  },
  //跳转到勋章详情页
  toHonorDetails(event){
    let id = event.target.dataset.form.id;
    my.navigateTo({
      url:'../goal-honor-details/index?hornorId='+id
    });
  }
});
