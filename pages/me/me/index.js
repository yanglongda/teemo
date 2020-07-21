const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    homePageInfo: {},
    avatar: '',
    show: 3,
    score: 0,
    defaultUserInfo:{},
    studyId:''
  },


  onLoad(query) {
     this.getCardList();
  },
  // // 获取学习值
  getCardPoint() {
    let url = api.getCardPoint;
    let method = 'GET';
    let header = 'application/json';
    let data = {};
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        this.setData({
          score: res.data.point
        })
      }
    })
  },

  // 获取所有的卡
    getCardList() {
      
      let url = api.queryIsOpenCard;
      let data = {};
      let method = 'GET';
      let header = 'application/json';
      app.request(url, data, method, header, true).then(res => {
        if (res.code == 0) {
          let defaults = [];
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].cardNo == app.getGlobalLocalStorage("cardNo")) {
                this.setData({
                  defaultUserInfo: res.data[i],
                  studyId:res.data[i].studyId
                })
              }
            }
          }
        }
      })
    },
  onReady() {

    // 页面加载完成
  },
  onShow() {
    this.getCardPoint()
    if(app.getGlobalLocalStorage("reloadMe")){
      this.getCardList();
      app.setGlobalLocalStorage("reloadMe",false)
    }
    if (app.getGlobalLocalStorage("cardInfo")) {
      this.setData({
        homePageInfo: app.getGlobalLocalStorage("cardInfo"),
        show: 0
      })
    } else {
      this.setData({
        show: 1
      })
    }
  },

  // 页面跳转
  onCardClick() {
    my.navigateTo({
      url: '/pages/me/personal/index',
    });
  },
  schoolRollClick() {
    my.navigateTo({
      url: '/pages/me/school-roll/school-roll',
    });
  },
  onIdentityClick(info) {
    console.log(info);
    my.navigateTo({
      url: '/pages/me/identity/identity?info=' + JSON.stringify(info),
    });
  },
  onCardRecordClick() {
    my.navigateTo({
      url: '/pages/me/card-record/index',
    });
  },

  redirctToCardManage() {
    my.navigateTo({
      url: '/pages/card/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用         
    });
  },
  //学分值详情页
  onPointClick(event) {
    let totalScore = event.target.dataset.score;
    my.navigateTo({
      url: '/pages/me/point-details/index?point=' + totalScore
    })
  },

  onAccountPassClick() {
    console.log(this.data.studyId);
    my.navigateToMiniProgram({
      appId: '2019091067164053',
      extraData: {
        "cardId": app.getGlobalLocalStorage('cardId'),
        "accountNo": this.data.studyId
      },
      success: (res) => {
        console.log(JSON.stringify(res))
      },
      fail: (res) => {
        console.log(JSON.stringify(res))
      }
    });
  },


  // 关于我们  更新页面

  upgradeVersionRec() {
    my.navigateTo({
      url: '/pages/me/about/index', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。 参数规则如下：路径与参数之间使用         
    });
  },

  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
});
