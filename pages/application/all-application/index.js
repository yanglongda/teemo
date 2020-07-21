const app = getApp();
const api = require('/bin/api/index.js')
const common = require('/bin/common/common.js')
Page({
  data: {
    applicationList: '',
    applicationActive: 0,
    schoolName: '',
  },
  onLoad() {
    this.getAllApplication()
  },
  onShow() {
    if (app.getGlobalLocalStorage("reloadApp")) {
      this.getAllApplication();
      app.setGlobalLocalStorage("reloadApp", false)
    }
  },
  getAllApplication() {
    let _this = this;
    let url = api.getApplicationList;
    let method = 'POST';
    let header = 'application/json';
    let data = {};
    app.request(url, data, method, header, true).then(res => {
      if (res.code == 0) {
        console.log(res.applictionList)
        if (res.applictionList && res.applictionList.length > 0) {
          res.applictionList.forEach(x => {
            x.title = x.tagName;
            if (x.applicationDtoList && x.applicationDtoList.length > 0) {
              x.applicationDtoList.forEach(item => {
                if (item.applicationTypeList && item.applicationTypeList.length > 0) {
                  item.applicationTypeList.forEach((y, index) => {

                    if (y.applicationList.length > 0) {
                      y.applicationList.forEach(rec => {
                        rec.text = rec.appTitle;
                        rec.icon = rec.appIcon
                      })
                    }
                  })
                }
              })
            }
          })
          console.log(res.applictionList)
          _this.setData({
            applicationList: res.applictionList
          })
        }
      }
    })
  },
  handleTabChange({ index }) {
    this.setData({
      applicationActive: index,
    });
  },

  handleTabClick({ index }) {
    this.setData({
      applicationActive: index,
    });
  },

  //小程序跳转
  onAppItemClick(event) {
    let obj = event.target.dataset.item;
    common.doAppClick(obj.operateType, obj.appId, obj.appUrl, obj.appTitle, obj.funcDesc, obj.appParam);
  },
});