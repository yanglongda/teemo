const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    userInfo: {
      name: '',
      idCard: '',
      studentName: '',
      studentIdCard: '',
      mobie: ''
    },
    hiddenInfo: {
      name: '',
      idCard: '',
      mobie: ''
    },
    idCard: '',
    disabled: true,
    type: '',
    userRole: '',
    nextStep: false,
    index: 0,
    array: ['母子', '父子', '祖孙', '其他']
  },
  onLoad(query) {
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
      this.authToStudyCard();
    }
    this.setData({
      type: query.type,
      userRole: query.userRole
    })

    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
  // 如果在角色选择页拒绝授权，需要重新授权
  authToStudyCard() {
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
                    hiddenInfo: res.data.userInfo,
                  })
                  app.setGlobalUserInfo(res.data.userInfo)
                  app.setGlobalToken(res.data.token)
                }
                if (res.data.code == 500) {
                  // 开卡失败 跳转到开卡失败页面
                  my.redirectTo({
                    url: '/pages/results/error/index?errorInfo=' + res.data.msg + '&isSelf='
                  });
                }
              },
              fail: (error => {
                my.redirectTo({
                  url: '/pages/results/error/index?errorInfo=&isSelf='
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
  // 确认并授权
  confirmToAuth(code) {
    let method = 'POST'
    let header = 'application/json'
    let url = api.addCard
    let data = {
      authCode: code,
      name: this.data.studentName,
      idCard: this.data.studentIdCard,
      mobile: this.data.userInfo.mobile,
      type: this.data.type,
      userRole: this.data.userRole
    }
    app.request(url, data, method, header, false).then(res => {
      // 开卡成功
      if (res.code == 0) {
        app.setGlobalLocalStorage('cardNo', res.cardNo);
        app.setGlobalLocalStorage('reloadIndex', true);
        app.setGlobalLocalStorage('reloadMe', true);
        app.setGlobalLocalStorage('reloadApp', true);
        my.redirectTo({
              url: '../../reg/load/index?info=' + true, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        });


        // let url = api.getInfo + '?cardNo=' + app.getGlobalLocalStorage("cardNo");
        // let method = 'GET';
        // let header = 'application/json';
        // let data = {

        // };
        // app.request(url, data, method, header, false).then(res => {
        //   console.log(res);
        //   if (res.code == 0) {
        //     if (res.cardInfo) {

        //        my.navigateToMiniProgram({
        //         appId: '2019041063820418',
        //         path: 'pages/jxwithholding/index',
        //         extraData: {
        //           cardId: res.cardInfo.id,
        //           returnPage: 'pages/reg/load/index'
        //         }
        //       });

        //     } else {
        //        my.redirectTo({
        //         url: '../../reg/load/index?info=' + true, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        //         });
        //     }
            
        //   } else {
        //     my.redirectTo({
        //       url: '../../reg/load/index?info=' + true, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        //     });
        //   }
        // })

        
        my.hideLoading();
      }
      if (res.code == 500) {
        if (res.subcode && res.subcode == 501) {
          // 开卡失败 跳转到开卡失败页面
          my.redirectTo({
            url: '../../results/error-page/index?type=child&isSubCode=true&message=' + res.msg
          });
        } else {
          // 开卡失败 跳转到开卡失败页面
          my.redirectTo({
            url: '../../results/error-page/index?type=child&message=' + res.msg,
          });
        }
        my.hideLoading();
      }
    })
  },

  formSubmits() {
    let val = this.data.studentIdCard;
    let req = /^[1-9]\d{5}[1-2]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|X|x)$/;
    if (this.data.studentIdCard && this.data.studentName) {
      if (req.test(val)) {
        my.showLoading({
          content: '正在提交...',
        });
        my.getAuthCode({
          scopes: ['auth_user', 'auth_ecard'],
          success: (res) => {
            this.confirmToAuth(res.authCode)
          },
          fail: (res) => {
            my.hideLoading();
          }
        });
      } else {
        my.showToast({
          type: 'fail',
          content: '身份证号码有误，请核对！',
          duration: 2000,
        });
      }
    } else {
      my.showToast({
        type: 'fail',
        content: '学生信息不能为空！',
        duration: 2000,
      });
    }
  },

  onItemBlur(e) {
    this.setData({
      studentName: e.detail.value
    })
  },


  onItemBlur1(e) {
    console.log(e.target.dataset);
    let val = e.detail.value
    let req = /^[1-9]\d{5}[1-2]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|X|x)$/;
    // let req = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
    if (req.test(val)) {
      this.setData({
        studentIdCard: val,
        disabled: false,
        nextStep: false
      })
    } else {
      if (val) {
        this.setData({
          disabled: true,
          studentIdCard: val,
        })
        my.showToast({
          type: 'fail',
          content: '身份证号码有误，请核对！',
          duration: 2000,
        });
      } else {
        this.setData({
          disabled: true,
          studentIdCard: val,
        })
      }
    }
  },

  // 关系选择
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value,
    });
  },

  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
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
  goBack() {
    my.navigateBack();
  },
  setIdCard(e) {
    this.setData({
      studentIdCard: e.detail.value
    })
  },
  setName(e) {
    this.setData({
      studentName: e.detail.value
    })
  }
});
