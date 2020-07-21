const app = getApp();
const api = require('/bin/api/index.js');
const common = require('/bin/common/common.js')
Page({
  data: {
    isSchoolInfo: false,
    studyUserInfo: {},
    avatar: '',
    idCard: '',
    mobile: ''
  },

  getStudyUserInfo() {
    let reg = /(.{1}).*(.{1})/;
    let reg1 = /(.{3}).*(.{2})/; //显示前三位和后四位
    let url = api.getStudyUserInfo;
    let method = 'POST';
    let header = 'application/json';
    let data = {
      // idCard:app.getGlobalUserInfo("idCard").idCard
    };
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.studyUserInfo) {
          this.setData({
            studyUserInfo: res.studyUserInfo,
            idCard: res.studyUserInfo.idCard.replace(reg, "$1****************$2"),
            mobile: res.studyUserInfo.mobile ? res.studyUserInfo.mobile.replace(reg1, "$1******$2") : ''
          })
        }
      }
    })
  },
  onLoad() {
   
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
  onReady(){
    let me = this;
     if (app.getGlobalLocalStorage("cardNo")) {
      common.getCardInfo(function(){
        me.setData({
          avatar: app.getGlobalLocalStorage('cardInfo').avatar
        })
        me.getStudyUserInfo();
      });
    }
     
  },
  goBack() {
    my.navigateBack();
  }
});
