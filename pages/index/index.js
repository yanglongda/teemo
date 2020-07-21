const app = getApp();
const api = require('/bin/api/index.js');
const common = require('/bin/common/common.js')
Page({
  data: {
    commonUsedApplication: [],// 常用应用
    provinceApplication: [], //省级服务应用
    cityApplication: [],//服务应用
    schoolApplication: [], // 校级服务应用
    imageZone: false, //广告位图片是否显示，默认不显示
    userInfo: {},
    flag: 0,
    homePageInfo: {},
    cardNo: '',
    indexFlag: 0,
    provinceServiceLength: false,
    cityServiceLength: false,
    schoolServiceLength: false,
    disabled: false,
    applicationList: [],
    currentIndex: 0,
    bannerApplication: [],
    openNotice: false,
    noticeContent: '',
    isLoop: { loop: true, leading: 500, trailing: 800, fps: 40 },
    canIUse: my.canIUse('favorite'),
    article: {},
    defaultUserInfo: {},
    ctx: '',
    modalShowWelfare:false,//福利弹窗
  },
  // 重新加载页面数据
  reloadPage() {
    // 加载默认卡
    console.log(app.getGlobalLocalStorage('cardNo'));
    let apiUrl = api.getDefaultCard
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false)
      .then(res => {
        if (res.code == 0) {
          app.setGlobalLocalStorage('cardNo', res.cardInfo.cardNo);
          app.setGlobalLocalStorage('cardId', res.cardInfo.id);
          app.setGlobalLocalStorage('cardInfo', res.cardInfo);
          this.setData({
            cardNo: res.cardInfo.cardNo,
            homePageInfo: app.getGlobalLocalStorage("cardInfo")
          })
          this.getCardList();
          this.getCommonApplication();
          this.getNotifucation();
          try{
          this.loadModalWelfar();}catch( e){

          }

        } else {
          // 加载默认卡信息失败
          console.info(res.msg)
        }
      })
  },
  //// 查询是否没有有卡getOpenCardStatus，需要传入authCode
  getOpenCardStatus() {
    let $this = this;
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
        if (res.authCode) {
          if (my.request) {
            my.request({
              url: api.getOpenCardStatus,
              method: 'GET',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-zsxx-type': app.requestHeardType
              },
              data: {
                "authCode": res.authCode
              },
              success: (res => {
                if (res.data.code == 0) {

                  // status 1、未开卡 2、待初始化 3、已开卡
                  if (res.data.status == "1") {
                    // 跳转到主卡选择页面

                    my.redirectTo({
                      url: '/pages/collar-card/identity-select/index'
                    });
                  }
                  if (res.data.status == "3") {
                    $this.getAlipayUserInfo()
                  }
                  if (res.data.status == "2") {
                    // 跳转到loading页
                    my.redirectTo({
                      url: '../reg/load/index'
                    });
                  }
                }
              }),
              fail: (error => {
                my.redirectTo({
                  url: '/pages/results/error/index?errorInfo=&isSelf='
                });
              })
            })
          }
        }
      }
    })
  },

  // 获取支付宝用户信息
  getAlipayUserInfo(e) {
    my.getAuthCode({
      scopes: 'auth_base',
      success: (res => {
        if (my.request) {
          my.request({
            url: api.getClientUserInfo, // 目标服务器url
            method: 'POST',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'x-zsxx-type': app.requestHeardType
            },
            data: {
              "authCode": res.authCode
            },
            dataType: 'json',
            success: (res => {
              this.setData({
                userInfo: res.data.userInfo,
              })
              app.setGlobalUserInfo(res.data.userInfo)
              app.setGlobalToken(res.data.token);
              // 查询开过卡直接刷新页面
              this.reloadPage();
            })
          })
        }

      }),
      fail: (err) => {
        console.log(err);
      }
    })
  },

  // 获取所有的卡
  getCardList() {
   
    let userInfo = this.data.homePageInfo;
    let url = api.queryIsOpenCard;
    let data = {};
    let method = 'GET';
    let header = 'application/json';
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].cardNo == userInfo.cardNo) {
              console.log(res.data[i]);
              this.setData({
                defaultUserInfo: res.data[i]
              })
            }
          }
        }
      }
    })
  },

  // 获取常用应用
  getCommonApplication() {
    let me = this;
    let url = api.queryCommonUsedApplication;
    let method = 'POST';
    let header = 'application/json'
    let data = {};
    app.request(url, data, method, header, false).then(res => {
      let commonApplication = [];
      let common = [];
      if (res.code == 0) {
        commonApplication = res.commonUsedApplication;
        if (commonApplication.length > 0) {
          commonApplication.forEach(function(x, index, arr) {
            x.icon = x.appIcon
            x.text = x.appTitle;
            common.push(x)
          })
        }
      }
      common.push({ icon: '/assets/index/2.0/more_app.png', text: '更多应用', appUrl: '/pages/application/all-application/index', operateType: 'staticinfo' });
      me.setData({
        commonUsedApplication: common,
        indexFlag: 1,
      })
      me.getBannerApplication();
    })
  },
  // 获取广告位应用
  getBannerApplication() {
    let me = this;
    let url = api.queryBannerApplication;
    let method = 'POST';
    let header = 'application/json';
    let data = {};
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        this.setData({
          bannerApplication: res.bannerApplication
        });
        me.getArticles();
        // 卡包显示红点
        console.log(app.getGlobalLocalStorage('carddots'));
        if (app.getGlobalLocalStorage('carddots') > 1) {
          if (my.showTabBarRedDot) {
            my.showTabBarRedDot({
              index: 2
            })
          }
        }
      }
    })
  },

  //获取文章信息
  getArticles() {
    let me = this;
    let url = api.getArticleBannerList;
    let method = 'GET';
    let header = 'application/json';
    let data = {
      type: '新闻资讯'
    };
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        me.setData({
          article: res.list[0]
        })
      }
    })
  },

  onCommonUsedItemClick(ev) {
    let obj = this.data.commonUsedApplication[ev.detail.index];
    common.doAppClick(obj.operateType, obj.appId, obj.appUrl, obj.appTitle, obj.funcDesc, obj.appParam);
  },
  onBannerItemClick(ev) {
    let obj = ev.target.dataset.item;
    common.doAppClick(obj.operateType, obj.appId, obj.appUrl, obj.appTitle, obj.funcDesc, obj.appParam);
  },

  //自定义banner的dots 设置当前active的dot
  bannerChange: function(e) {
    let current = e.detail.current;
    this.setData({
      currentIndex: current
    })
  },

  // 跳转到小目标页面
  redirctToGoal() {
    my.navigateTo({
      url: '../goal/goal/index',
    });
  },
  //跳转到新闻页
  redirctToNews(newsType) {
    console.log(newsType.target.dataset.field);
    my.navigateTo({
      url: '../news/index?type=' + newsType.target.dataset.field
    });
  },
  // 关闭福利弹窗
  onModalCloseWelfare() {
    this.setData({
      modalShowWelfare: false,
    });
  },
  // 点击福利跳转到指定页面
  redirctToWelfare(){
    my.navigateTo({
      url: './welfare/index/index',
    });
    // my.ap.navigateToAlipayPage({
    //   // path:'alipays://platformapi/startapp?url=https%3A%2F%2Fqr.alipay.com%2Fcpx15069cngadjycn1euac4',
    //   path:'https://qr.alipay.com/cpx15069cngadjycn1euac4',
    //   success:(res) => {
    //     my.alert({content:'系统信息' + JSON.stringify(res)}); 
    // },
    // fail:(error) => {
    //     my.alert({content:'系统信息' + JSON.stringify(error)});        
    // }
    // })

   let url = api.updateActivityInfo;
    let data = {};
    let method = 'Get';
    let header = 'application/json';
    // app.request(url, data, method, header, false).then(res => {
    //   console.log(res);
    //  if(res.code=='0'){
    //   //  my.navigateTo({
    //  // url: './welfare/index/index',
    // //});
    //  my.ap.navigateToAlipayPage({
    //   path:'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2Fqr.alipay.com%2Fcpx15069cngadjycn1euac4',
    // })
    //   }
    
    // })

   
  },
  //加载福利窗口
  loadModalWelfar()
  {

     let userInfo = this.data.homePageInfo;
    let url = api.getActivityInfo;
    let data = {};
    let method = 'GET';
    let header = 'application/json';
    // app.request(url, data, method, header, false).then(res => {
    //   console.log(res);
    //   if(res.code=='0'&&res.status==true){

    //       this.setData({
    //   modalShowWelfare: true,
    // });
    //   }
    
    // })

  

  },
  onModalClose() {
    this.setData({
      openNotice: false,
    });
  },
  onLoad(options) {
    my.setTabBarStyle({
      borderStyle: 'white'
    })
    this.getOpenCardStatus();
  },
  getNotifucation() {
    let apiUrl = api.getNotice
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.systemNotice && res.systemNotice.length > 0) {
          app.setGlobalLocalStorage('systemNotice', res.systemNotice);
          res.systemNotice.forEach(x => {
            if (x.noticePlace == 'home') {
              this.setData({
                openNotice: true,
                noticeContent: x.content
              })
            }
          })
        } else {
          app.setGlobalLocalStorage('systemNotice', '');
        }
      } else {
        app.setGlobalLocalStorage('systemNotice', '');
      }
    })
  },

  // 文章详情
  getArticleDetails(event) {
    common.getArticleDetail(event)
  },

  onShow() {
    if (app.getGlobalLocalStorage('cardNo') && app.getGlobalLocalStorage('reloadIndex')) {
      this.setData({
        indexFlag: 0
      })
      app.setGlobalLocalStorage('reloadIndex', false)
      this.getOpenCardStatus();
      //onModalCloseWelfare();
    }
  }
});
