// import uma from 'umtrack-alipay';
App({
  // 全局调用地址
  // serviceUrl: "http://192.168.0.102:8091/",

  // serviceUrl: "https://gongqing.nclantuo.com/",

  serviceUrl: "https://lle.jxedu.gov.cn/",

  // serviceUrl: "http://ywbjj.mynatapp.cc/",

  // serviceUrl: "http://192.168.2.187:8091/",

  // 自定义跳转地址
  agreeJumpUrl: "",

  // 自定义请求头
  requestHeardType: "",

  // 判断用户是否授权登录
  condition: { 
    userLogin: false,
    userNotLogin: true,
  },

  // 从本地缓存中获取全局的用户对象
  getGlobalUserInfo() {
    var userInfo = my.getStorageSync({ key: 'globalUserInfo' }).data;
    return userInfo;
  },

  // 从本地缓存中获取全局的token
  getGlobalToken() {
    var token = my.getStorageSync({ key: 'globalToken' }).data;
    return token;
  },

  // 设置用户的全新信息到本地缓存
  setGlobalUserInfo(userInfo) {
    my.setStorageSync({
      key: 'globalUserInfo',
      data: userInfo,
    });
  },

  // 设置token到本地缓存
  setGlobalToken(token) {
    my.setStorageSync({
      key: 'globalToken',
      data: token,
    });
  },

  // 设置本地参数
  setGlobalLocalStorage(key, data) {
    my.setStorageSync({
      key: key, // 缓存数据的key
      data: data, // 要缓存的数据
    });
  },

  // 获取保存在本地的参数
  getGlobalLocalStorage(key) {
    let localStorageData = my.getStorageSync({ key: key }).data
    return localStorageData
  },

  // 全局封装request请求
  request(url, data, method, header, showLoading) {
    // 提高用户体验
    var me = this;
    if (showLoading) { 
      my.showNavigationBarLoading();
      my.showLoading({
        content: "加载中..."
      });
    }
    var token = this.getGlobalToken()
    // 'x-zsxx-token': token ||  my.getStorageSync({ key: 'globalToken' }).data,
    let isCardHeader = {
      'Content-Type': header,
      'x-zsxx-token': token ||  my.getStorageSync({ key: 'globalToken' }).data,
      'x-zsxx-type': me.requestHeardType,
    }
   
    if (me.getGlobalLocalStorage('cardNo')) {
      isCardHeader['x-zsxx-cardNo'] = me.getGlobalLocalStorage('cardNo')
    }
    return new Promise(function(resolve, reject) {
      if (my.request) {
        my.request({
          url: url,
          data: data,
          method: method,
          dataType: 'json',
          headers: isCardHeader,
          success: function(res) {
            my.hideNavigationBarLoading();
            my.hideLoading();
            if (res.status == 200) {
              // 如果token失效
              if (res.data.code == 401 || res.data.code == 402) {
                my.alert({
                  title: '登录超时',
                  content: '登录超时，请重新登录！',
                  buttonText: '确定',
                  success: (result) => {
                    my.switchTab({
                      url: '/pages/index/index'
                    })
                    me.condition.userLogin = false;
                    me.condition.userNotLogin = true;
                    var userInfo = null;
                    me.setGlobalUserInfo(userInfo);
                  }
                });
              } else if (res.data.code == 403) {
                // 如果用户没有终身学习账号，提示用户注册！
                my.alert({
                  title: '提示',
                  content: '您目前暂无终身学习账号，请先注册！',
                  buttonText: '确定',
                  success: (result) => {
                    my.redirectTo({
                      url: '/pages/identity-select/index'
                    })
                  }
                });
              } else {
                resolve(res.data);
              }
            } else {
              reject(res.errorMessage);
            }
          },
          fail: function(err) {
            console.log(err);
            my.redirectTo({
              url: '/pages/results/error/index?errorInfo=&isSelf='
            });
          }
        })
      }
    }).catch((e) => {
      console.log(e)
    });
  },
 
  onLaunch(options) {
    this.setGlobalLocalStorage("cardInfo", '');
    this.setGlobalLocalStorage("cardNo", '');
    this.setGlobalLocalStorage("cardId", '');
    if (options.query) {
      this.setGlobalLocalStorage('templateId', options.query.templateId);
      this.setGlobalLocalStorage('cardNo', options.query.cardNo);
    } else {
      this.setGlobalLocalStorage('templateId', '');
      this.setGlobalLocalStorage('cardNo', '');
    }
    // 卡包页红点
    if (this.getGlobalLocalStorage('carddots') != null && this.getGlobalLocalStorage('carddots') != undefined) {
      this.setGlobalLocalStorage("carddots", this.getGlobalLocalStorage('carddots'))
    } else {
      this.setGlobalLocalStorage("carddots", 4);
    }
    //卡包页提示信息
    if (this.getGlobalLocalStorage('cardtips') != null && this.getGlobalLocalStorage('cardtips') != undefined) {
      this.setGlobalLocalStorage("cardtips", this.getGlobalLocalStorage('cardtips'))
    } else {
      this.setGlobalLocalStorage("cardtips", 3);
    }
    // 通过二维码扫码进入小程序
    if (options.query && options.query.qrCode) {
      this.setGlobalLocalStorage('qrCode', options.query.qrCode)
      my.redirectTo({
        url: '/pages/reg/load1/index'
      })
    }
    // uma.init('5cee33c90cafb2a74f000a34', my);
    //获取支付宝当前版本号
    my.getSystemInfo({
      success: (res) => {
        var currentV = this.compareVersion(res.version);
        var compareV = this.compareVersion("10.1.34");
        if (currentV >= compareV) {   //判断当前支付宝版本是否大于10.1.52
          this.setGlobalLocalStorage("isUma", true)
          // uma.init('5cee33c90cafb2a74f000a34', my);
        } else {
          if (my.ap.updateAlipayClient) {
            my.ap.updateAlipayClient();
          }
          this.setGlobalLocalStorage("isUma", false)
        }
      },
    });
  },

  // 小程序版本更新检测
  mpUpdate() {
    if (!my.canIUse('getUpdateManager')) return;
    const updateManager = my.getUpdateManager();
    updateManager.onCheckForUpdate(res => {
      if (!res.hasUpdate) return;
      updateManager.onUpdateReady(() => {
          my.confirm({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (!res.confirm) return;
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        })
      });
    });
  },

  onShow(options) {
    //小程序更新检测
    this.mpUpdate(); 
    // if (this.getGlobalLocalStorage("isUma")) {
    //   uma.resume();
    // }
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  onHide() {
    // if (this.getGlobalLocalStorage("isUma")) {
    //   uma.pause();
    // }                    // 请务必引入
  },

  //支付宝版本号大小比较
  compareVersion(n) {
    var n = n.toString(),
      n_arr = n.split(/\D/); // 使用正则表达式，截取字符串为数组，字符串中包含非数值型，如字母，则数组元素中会出现空值
    if (n_arr[n_arr.length - 1] == '') {
      n_arr.pop();
    }
    var n_replace = ['', '0', '00', '000', '0000'],
      r_n_replace = n_replace.reverse();
    for (var i = 0; i < n_arr.length; i++) {
      var l = n_arr[i].length;
      n_arr[i] = r_n_replace[l] + n_arr[i];
    } 
    var res = n_arr.join('');
    return res;
  },

  // globalData: {
  //   uma: uma                                // 请将uma模块绑定在gloabalData下，以便后续使用
  // }

});
