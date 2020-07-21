const app = getApp();
const api = require('/bin/api/index.js');
// 特征检测
my.canIUse('page.events.onBack');

Page({
  data: {
    checkSrc: '/assets/index/2.0/checked.png',
    uncheckSrc: '/assets/index/2.0/uncheck.png',
    btnDisabled: false,  //是否同意终身学习电子卡服务协议
    openNotice: false,
    noticeContent: '',
  },
  // 同意协议的勾选框
  checkChange(e) {
    if (this.data.checkSrc == '/assets/index/2.0/checked.png') {
      this.setData({
        checkSrc: '/assets/index/2.0/uncheck.png',
        btnDisabled: true
      })
    } else {
      this.setData({
        checkSrc: '/assets/index/2.0/checked.png',
        btnDisabled: false
      })
    }
  },
  // 支付宝授权
  authToStudyCard(event) {
    console.log(event);
    let _this = this;
    let identity = event.buttonTarget.dataset.field; //用来区分代领卡或者本人领卡
    my.showLoading({
      content: '加载中...'
    });
    // 获取支付宝授权
    my.getAuthCode({
      scopes: ['auth_user', 'auth_ecard'],  //授权类型
      success: (res) => {
        if (res.authCode) {
          if (my.request) {  // 判断my.request接口的兼容性
            my.request({
              url: api.registerByAlipay,
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-zsxx-type': app.requestHeardType
              },
              dataType: 'json',
              data: {
                "authCode": res.authCode,
                "formId": event.detail.formId
              },
              success: (res) => {
                if (res.data.code == 0) {
                  //将用户信息和token信息设置为全局变量
                  app.setGlobalUserInfo(res.data.userInfo);
                  app.setGlobalToken(res.data.token);
                  my.hideLoading();
                  //  授权成功后跳转
                  console.log(res);
                  _this.getCard(identity, res.data.haveCard);
                }
                if (res.data.code == 500) {
                  my.redirectTo({
                    url: '../../results/error/index?errorInfo=' + res.data.msg
                  });
                }
              },
              fail: (error => {
                my.redirectTo({
                  url: '../../results/error/index?errorInfo='
                })
              })
            });
          }
        }
      },
      fail: (result => {
        my.hideLoading();
      })
    });
  },
  // 本人领卡或者代领卡
  //value 区分是本人领卡还是代领卡
  getCard(value, haveCard) {
    if (!this.data.btnDisabled) { //是否勾选终身学习电子卡服务协议
      if (value == 'self') {
        if (!haveCard) {
          my.navigateTo({ //loading页面判断用户身份  以及判断通过哪个入口领取中小学生的终身学习电子卡
            url: '../../reg/loading/index?value=' + value
          });
        } else {
          my.showToast({
            type: 'none',
            content: '本人已领卡！',
            duration: 3000
          });
        }
      } else {
        my.navigateTo({ //loading页面判断用户身份  以及判断通过哪个入口领取中小学生的终身学习电子卡
          url: '../../reg/loading/index?value=' + value
        });
      }
    } else {
      this.showTips();
    }
  },
  // 关闭公告
  closableClick() {
    this.setData({
      openNotice: false
    })
  },

  showTips() {
    my.showToast({
      type: 'none',
      content: '请同意《江西省终身学习电子卡服务协议》',
      duration: 3000
    });
  },

    // 终身学习电子卡协议
  redirctToAgreement() {
    my.navigateTo({
      url: '../agreement/index'
    });
  },
  onLoad() {

  },
  onShow() {
    // 添加通知公告
    let systemNotice = app.getGlobalLocalStorage('systemNotice');
    if (systemNotice && systemNotice.length > 0) {
      systemNotice.forEach(x => {
        if (x.noticePlace == 'identity') {
          this.setData({
            openNotice: true,
            noticeContent: x.content
          })
        }
      })
    }
  }
})

// Page({
//   data: {
//     check: true,
//     userInfo: {},
//     disabled: false,
//     isSelf: true,
//     isOut: false,
//     closeShow: true,
//     openNotice: false,
//     noticeContent: '',
//     isLoop: { loop: true, leading: 500, trailing: 800, fps: 40 },
//     isWebView: false,
//     modalOpened: false,
//   },
//   radioChange(event) {
//     this.setData({
//       check: event.detail.value
//     })
//   },

//   // 页面跳转
//   // 传出参数   type 1本人/2代领    userRole 1中小学2 大学生3 教师4 社会公众
//   redirctToCardSelects(identity, self) {
//     this.setData({
//       isSelf: !self
//     })
//     if (app.getGlobalLocalStorage("isUma")) {
//       app.globalData.uma.trackEvent('redirctToCardSelects', { 'identity': identity })
//     }
//     let settings = app.getGlobalLocalStorage("authType"); //判断中小学入口是否只打开支付宝入口
//     if (this.data.check) { //判断是否勾选电子卡服务协议
//       if (!this.data.disabled) {
//         switch (identity) {
//           case 'student':
//             if (settings == "both") { //authType认证开卡类型 both: (小程序+支付宝)双认证, self:(电子卡)单认证,alipay:(支付宝)单认证
//               this.setData({
//                 modalOpened: true
//               })
//             } else if (settings == "alipay") { //alipay:(支付宝)单认证
//               this.navigateToMiniPro();
//             } else {  //self:(电子卡)单认证
//               this.setData({
//                 modalOpened: false
//               })
//               my.navigateTo({
//                 url: '../card-select/index?isSelf=' + this.data.isSelf
//               });
//             }
//             this.setData({
//               disabled: true
//             })
//             break;
//           case 'university':
//             if (!self) {
//               this.setData({
//                 isOut: true
//               })
//               my.navigateToMiniProgram({
//                 appId: '77700091',
//                 path: 'pages/isv/index',
//                 extraData: {
//                   sourceId: '2019041763911283',
//                   sceneCode: 'AUTHENTICATE',
//                   chInfo: 'edu_jx',
//                   returnPage: 'pages/index/index',
//                   returnData: JSON.stringify({ state: "page" }),
//                 },
//                 success: (res => {
//                   console.log(JSON.stringify(res))
//                 })
//               });
//               this.setData({
//                 disabled: true
//               })
//             } else {
//               this.showTips1()
//             }
//             break;
//           case 'teacher':
//             if (!self) {
//               my.navigateTo({
//                 url: '../auth-self/index?type=1&userRole=3'
//               });
//               this.setData({
//                 disabled: true
//               })
//             } else {
//               this.showTips1()
//             }
//             break;
//           case 'society':
//             if (!self) {
//               my.navigateTo({
//                 url: '../auth-self/index?type=1&userRole=4'
//               });
//               this.setData({
//                 disabled: true
//               })
//             } else {
//               this.showTips1()
//             }
//             break;
//         }
//       }
//     } else {
//       this.showTips()
//     }
//   },
//   onModalClose() {
//     this.setData({
//       modalOpened: false,
//       disabled: false
//     });
//   },
//   // 小程序跳转
//   navigateToMiniPro() {
//     this.setData({
//       modalOpened: false,
//       isOut: true
//     })
//     my.navigateToMiniProgram({
//       appId: '77700194',
//       path: 'pages/issuance-ecard-landing/index',
//       extraData: {
//         sourceId: '2019041763911283',
//         sceneCode: 'AUTHENTICATE',
//         chInfo: 'edu_jx',
//         returnPage: 'pages/index/index',
//         returnData: JSON.stringify({ state: "page" }),
//       },
//       success: (res => {
//         console.log(JSON.stringify(res))
//       })
//     });
//   },
//   navigateToCardSelect() {
//     this.setData({
//       modalOpened: false
//     })
//     my.navigateTo({
//       url: '../card-select/index?isSelf=' + this.data.isSelf
//     });
//   },
//   showTips() {
//     my.showToast({
//       type: 'none',
//       content: '请同意《江西省终身学习电子卡服务协议》',
//       duration: 3000
//     });
//   },

//   showTips1() {
//     my.showToast({
//       type: 'error',
//       content: '本人已领卡！',
//       duration: 2000
//     });
//   },

//   // 终身学习电子卡协议
//   redirctToAgreement() {
//     my.navigateTo({
//       url: '../agreement/index'
//     });
//   },
//   // 关闭公告
//   closableClick() {
//     this.setData({
//       openNotice: false
//     })
//   },
//   onShow() {
//     this.setData({
//       isWebView: false
//     })
//     // 添加通知公告
//     let systemNotice = app.getGlobalLocalStorage('systemNotice');
//     if (systemNotice && systemNotice.length > 0) {
//       systemNotice.forEach(x => {
//         if (x.noticePlace == 'identity') {
//           this.setData({
//             openNotice: true,
//             noticeContent: x.content
//           })
//         }
//       })
//     }
//     this.setData({
//       disabled: false
//     })
//     if (this.data.isOut) {
//       my.redirectTo({
//         url: '../reg/load/index'
//       });
//     }

//   },
//   authToStudyCard(value) {
//     var identity = value.buttonTarget.dataset.identity;
//     my.showLoading({
//       content: "加载中..."
//     });
//     my.getAuthCode({
//       scopes: ['auth_user', 'auth_ecard'],
//       success: (res) => {
//         if (res.authCode) {
//           if (my.request) {
//             my.request({
//               url: api.registerByAlipay, // 目标服务器url
//               method: 'POST',
//               headers: {
//                 'content-type': 'application/x-www-form-urlencoded',
//                 'x-zsxx-type': app.requestHeardType
//               },
//               data: {
//                 "authCode": res.authCode,
//                 "formId": value.detail.formId
//               },
//               dataType: 'json',
//               success: (res) => {
//                 if (res.data.code == 0) {
//                   this.setData({
//                     userInfo: res.data.userInfo
//                   })
//                   app.setGlobalUserInfo(res.data.userInfo)
//                   app.setGlobalToken(res.data.token);
//                   my.hideLoading();
//                   // 授权成功后跳转
//                   this.redirctToCardSelects(identity, res.data.haveCard);
//                 }
//                 if (res.data.code == 500) {
//                   my.redirectTo({
//                     url: '../error/index?errorInfo=' + res.data.msg + '&isSelf=' + this.data.isSelf
//                   });
//                 }
//               },
//               fail: (error => {
//                 my.redirectTo({
//                   url: '/pages/error/index?errorInfo=&isSelf='
//                 });
//               })
//             });
//           }

//         }
//         return true;
//       },
//       fail: (result => {
//         my.hideLoading();
//         // 真机上error码为11的时候表示暂不授权
//       })
//     });

//   },
//   onLoad(options) {
//     if (options.isSelf == 'false') {
//       this.setData({
//         isSelf: false
//       })
//     } else {
//       this.setData({
//         isSelf: true
//       })
//     }
//     // 获取系统设置
//     let apiUrl = api.getSystemSettings
//     let data = {}
//     let method = 'GET'
//     let header = 'application/json'
//     app.request(apiUrl, data, method, header, false).then(res => {
//       if (res.code == 0) {
//         app.setGlobalLocalStorage("authType", res.data.authType)
//       } else {
//         my.redirectTo({
//           url: '/pages/error/index?errorInfo=' + res.msg
//         });
//       }
//     })
//     // 禁止页面下拉
//     if (my.setCanPullDown) {
//       my.setCanPullDown({
//         canPullDown: false
//       })
//     }
//   },
//   events: {
//     onBack() {
//       return false
//     },

//   }
// });
