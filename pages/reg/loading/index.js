const app = getApp()
const api = require('/bin/api/index.js');
Page({
  data: {
    openModal: false,
    identityType: 'self',
    type: '',
    userRole: '',
    isOut: false
  },
  onLoad(options) {
    this.setData({
      identityType: options.value
    })
    if (options.value == 'self') {
      this.setData({
        type: '1'
      })
      this.getUserType();  //获取用户身份
      this.getSettings('self'); //判断哪个入口领取中小学生学习卡
    } else {
      this.getSettings('instead');
      this.setData({
        type: '2'
      })
    }
  },

  getUserType() {
    let _this = this;
    let url = api.getUserType;
    let method = 'POST';
    let header = "application/json";
    let data = {};
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (res.userType) { //1中小学生2大学生3其他（社会公众/老师）
          this.setData({
            userRole: res.userType
          })
          switch (res.userType) {
            case '1':  //（支付宝，本身或者两者）
              _this.redirectToByAuthType('self');
              break;
            case '2':  //跳转到支付宝小程序
              // _this.universityCardToAlipay();
              _this.navigateToAuthSelf()
              break;
            case '3': //跳转到领卡信息页
              _this.navigateToAuthSelf()
              break;
          }
        }
      }
    })
  },
  //跳转到本人领卡信息页
  navigateToAuthSelf() {
    my.redirectTo({
      url: '../../collar-card/auth-self/index?type=' + this.data.type + '&userRole=' + this.data.userRole
    });
  },
  //跳转到代领卡信息页
  navigateToAuthInstead() {
    my.redirectTo({
      url: '../../collar-card/auth/index?type=' + this.data.type + '&userRole=' + this.data.userRole
    });
  },
  //根据不同的入口跳转不同的页面
  redirectToByAuthType(type) {
    let _this = this;
    let authType = app.getGlobalLocalStorage("authType");
    if (authType == 'both') {
      //打开弹窗或者打开弹窗新页面
      this.setData({
        openModal: true
      })
    } else if (authType == 'alipay') {
      //打开支付宝小程序
      this.setData({
        openModal: false
      })
      if (type == 'self') {
        _this.studentCardToAlipaySlef()
      } else {
        _this.studentCardToAlipay();
      }
    } else {
      //跳转到本地页面
      if (type == 'self') {
        _this.navigateToAuthSelf()
      } else {
        _this.navigateToAuthInstead()
      }

    }
  },

  //大学生领卡
  universityCardToAlipay() {
    let _this = this;
    let authType = app.getGlobalLocalStorage("authType");
    if (authType == 'both' || authType == 'alipay') {
      this.setData({
        isOut: true
      })
      my.navigateToMiniProgram({
        appId: '77700091',
        path: 'pages/isv/index',
        extraData: {
          sourceId: '2019041763911283',
          sceneCode: 'AUTHENTICATE',
          chInfo: 'edu_jx',
          returnPage: 'pages/index/index',
          returnData: JSON.stringify({ state: "page" }),
        },
        success: (res => {
          console.log(JSON.stringify(res))
        })
      });
    }else{
      _this.navigateToAuthSelf();
    }
  },

  studentCardToAlipaySlef() {
    this.setData({
      isOut: true
    })  

    my.navigateToMiniProgram({
      appId: '77700194',
      path: 'pages/issuance-ecard/index',
      extraData: {
        sourceId: '2019041763911283',
        sceneCode: 'AUTHENTICATE',
        chInfo: 'edu_jx',
        returnPage: 'pages/index/index',
        returnData: JSON.stringify({ state: "page" }),
      },
      success: (res => {
        console.log(JSON.stringify(res))
      })
    });
  },

  //支付宝入口领取中小学生卡
  studentCardToAlipay() {
    this.setData({
      isOut: true
    })
    my.ap.navigateToAlipayPage({
      appCode: 'ecardParent',
      // path: 'alipays://platformapi/startapp?appId=68687110&url=%2Fwww%2Fform.html%3Fview%3Dk12%26scene%3DSTUDENT_CARD',
      success: (result) => {
        console.log(result)
      },
      fail:(res) => {
        console.log(res)
      }
    });

    // my.navigateToMiniProgram({
    //   appId: '77700194',
    //   path: 'pages/issuance-ecard-landing/index',
    //   extraData: {
    //     sourceId: '2019041763911283',
    //     sceneCode: 'AUTHENTICATE',
    //     chInfo: 'edu_jx',
    //     returnPage: 'pages/index/index',
    //     returnData: JSON.stringify({ state: "page" }),
    //   },
    //   success: (res => {
    //     console.log(JSON.stringify(res))
    //   })
    // });
  },
  // 获取系统设置
  getSettings(type) {
    let _this = this;
    let apiUrl = api.getSystemSettings
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        // return res.data.authType;
        app.setGlobalLocalStorage("authType", res.data.authType);
        if (type == 'instead') {
          this.setData({
            userRole: '1'
          })
          _this.redirectToByAuthType('instead');
        }
      } else {
        my.redirectTo({
          url: '/pages/results/error/index?errorInfo=' + res.msg
        });
      }
    })
  },
  onShow() {
    if (this.data.isOut) {
      my.switchTab({
        url: '/pages/index/index',
      })
    }
  }
});
