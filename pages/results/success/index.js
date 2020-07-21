const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    userInfo: {},
    identity: [],
    userType: '',
    EuserType: '',
    showWelfare:false, //默认显示领红包
  },
  onLoad() {
    this.getStudyUserInfo();
    this.getCardType();
  },
  // 获取信息
  getStudyUserInfo() {
    let url = api.getInfo + '?cardNo=' + app.getGlobalLocalStorage("cardNo");
    let method = 'GET';
    let header = 'application/json';
    let data = {

    };
    app.request(url, data, method, header, false).then(res => {
      console.log(res);
      if (res.code == 0) {
        if (res.cardInfo) {
          this.setData({
            userInfo: res.cardInfo
          })
        }
      }
    })
  },
  getCardType() {
    let url = api.getCardType + '?cardNo=' + app.getGlobalLocalStorage("cardNo");
    let method = 'GET';
    let header = 'application/json';
    let data = {

    };
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.userCardInfo) {
          console.log(res.userCardInfo.userType);
          switch (res.userCardInfo.userType) {
            case '1':
              this.setData({
                userType: '小学生卡',
                EuserType: ' Primary school student e-card'
              });
              break;
            case '2':
              this.setData({
                userType: '中学生卡',
                EuserType: 'Secondary school student e-card'
              });
              break;
            case '3':
              this.setData({
                userType: '大学生卡',
                EuserType: 'College student e-card'
              });
              break;
            case '4':
              this.setData({
                userType: '教师卡',
                EuserType: 'Teacher e-card'
              });
              break;
            case '5':
              this.setData({
                userType: '社会公众卡',
                EuserType: 'Public e-card'
              });
              break;
            case '6':
              this.setData({
                userType: '学生卡',
                EuserType: 'Student e-card'
              });
              break;
          }
        }
      }
    })
  },
  backToIndex() {
    my.switchTab({
      url: '/pages/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数
    });
  },
  // 点击福利跳转到指定页面
  redirctToWelfare(){
    my.ap.navigateToAlipayPage({
      path:'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fqr.alipay.com%2Fcpx15069cngadjycn1euac4',
    })
  },
  onShow() {

  },
});
