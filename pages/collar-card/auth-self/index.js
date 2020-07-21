const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    userInfo: {
      name: '',
      idCard: '',
      studentName: '',
      studentIdCard: '',
      mobile: ''
    },
    hiddenInfo: {
      name: '',
      idCard: '',
      mobile: ''
    },
    idCard: '',
    type: '',
    userRole: '',
    nextStep: false
  },
  // 获取授权码并授权
  authToStudyCard() {
    let name = this.data.userInfo.name;
    let idCard = this.data.userInfo.idCard;
    let mobile = this.data.userInfo.mobile;
    if (name && idCard && mobile) {
      if (!this.data.nextStep) {
        my.showLoading({
          content: '正在提交...',
        });
        let method = 'POST'
        let header = 'application/json'
        let url = api.addCard
        my.getAuthCode({
          scopes: ['auth_user', 'auth_ecard'],
          success: (res) => {
            let data = {
              authCode: res.authCode,
              name: name,
              idCard: idCard,
              mobile: mobile,
              type: this.data.type,
              userRole: this.data.userRole
            };
            app.request(url, data, method, header, false).then(res => {
              if (res.code == 0) {
                app.setGlobalLocalStorage('cardNo', res.cardNo);
                app.setGlobalLocalStorage('reloadIndex', true);
                app.setGlobalLocalStorage('reloadMe', true);
                app.setGlobalLocalStorage('reloadApp', true);
                // my.switchTab({
                //   url: '../index/index?info=' + true, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                // });
                my.redirectTo({
                  url: '../../reg/load/index?info=' + true, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
                });
                my.hideLoading();
              }
              if (res.code == 500) {
                // 开卡失败 跳转到开卡失败页面
                my.redirectTo({
                  url: '../results/error-page/index?type=self&message=' + res.msg
                  // url: '../../results/success/index'
                });
                my.hideLoading();
              }
            })
          },
          fail: (res) => {
            my.hideLoading();
          }
        });
        this.setData({
          nextStep: true
        })
      }
    }

  },
  // 如果在角色选择页拒绝授权，需要重新授权
  authToCard() {
    my.getAuthCode({
      scopes: ['auth_user', 'auth_ecard'],
      success: (res) => {
        console.info(res)
        if (res.authCode) {
          if (my.request) {
            my.request({
              url: api.registerByAlipay, // 目标服务器url
              method: 'POST',
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'x-zsxx-type': app.requestHeardType
              },
              data: {
                "authCode": res.authCode
              },
              dataType: 'json',
              success: (res) => {
                if (res.data.code == 0) {
                  this.setData({
                    userInfo: res.data.userInfo,
                    hiddenInfo: res.data.userInfo
                  })
                  app.setGlobalUserInfo(res.data.userInfo)
                  app.setGlobalToken(res.data.token);
                }
                if (res.data.code == 500) {
                  // 开卡失败 跳转到开卡失败页面
                  my.redirectTo({
                    url: '../error/index?errorInfo=' + res.data.msg + '&isSelf='
                  });
                }
              },
              fail: (error => {
                my.redirectTo({
                  url: '/pages/error/index?errorInfo=&isSelf='
                });
              })
            });
          }

        }
      },
      fail: (res) => {
        my.hideLoading();
      }
    });
  },

  onReady() {

  },

  onLoad(options) {
    let reg = /(.{1}).*(.{1})/;
    let reg1 = /(.{1}).*/;
    let reg2 = /(.{3}).*(.{2})/;
    if (app.getGlobalUserInfo()) {
      this.setData({
        userInfo: app.getGlobalUserInfo(),
        hiddenInfo: {
          idCard: app.getGlobalUserInfo().idCard.replace(reg, "$1****************$2"),
          mobile: app.getGlobalUserInfo().mobile.replace(reg2, "$1******$2"),
          name: app.getGlobalUserInfo().name.replace(app.getGlobalUserInfo().name.length > 2 ? reg : reg1, app.getGlobalUserInfo().name.length > 2 ? "$1*$2" : "$1*")
        }
      })
    } else {
      // 如果在角色选择页拒绝授权，需要重新授权
      this.authToCard();
    }
    this.setData({
      type: options.type,
      userRole: options.userRole
    })
    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
  onShow() {
    this.setData({
      nextStep: false
    })
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  },
});
