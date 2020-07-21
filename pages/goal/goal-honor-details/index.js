const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    honorId: '',
    currentIndex: 0,
    honorItemList: [],
    percent:'',
  },
  onLoad(options) {
    console.log(options);
    this.setData({
      honorId: options.hornorId
    })
    this.getMedalItemList(options.hornorId)
  },
  //获取勋章详细信息
  getMedalItemList(id) {
    console.log(id)
    let me = this;
    let apiUrl = api.getMedalItemList + '?typeId=' + id
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.setData({
            honorItemList: res.data,
            percent:1+'/'+ res.data.length
          })
        }
      }
    })
  },
  bannerChange: function(e) {
    let current = e.detail.current;
    this.setData({
      currentIndex: current,
      percent:(current + 1) + '/' + this.data.honorItemList.length
    })
  },
});
