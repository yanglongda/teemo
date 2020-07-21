
const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    isAuth: true,
    defaultUserInfo: [],
    otherUserInfo: [],
    isOther: true,
    isSelf: true,
    disabled: false,
    isWebView: false,
    tips: true,
    userType:'',
    EuserType:''
  },

  // 获取所有的卡
  getCardList() {
    let url = api.queryIsOpenCard;
    let data = {};
    let method = 'GET';
    let header = 'application/json';
    app.request(url, data, method, header, false).then(res => {
      if (res.code == 0) {
        let defaults = [];
        let others = [];
        if (res.data.length > 0) {
          for (var i = 0; i < res.data.length; i++) {
            if(res.data[i].cardNo == app.getGlobalLocalStorage('cardNo')){
              res.data[i].loginDefault = true
            }else{
               res.data[i].loginDefault = false
            }
            if (res.data[i].type == '本人') { //如果是本人领卡之后隐藏本人领卡按钮
              this.setData({
                isSelf: false
              })
            }
            if (res.data[i].defaultCard == '1') {
              defaults.push(res.data[i])  //如果是默认卡
            } else {
              others.push(res.data[i])  //非默认卡
            }
          }
          if (defaults.length > 0) {
            this.setData({
              defaultUserInfo: defaults
            })
          }
          if (others.length > 0) {
            this.setData({
              otherUserInfo: others,
              isOther: true
            })
          } else {
            // 非默认卡不存的话则不显示
            this.setData({
              isOther: false
            })
          }

          console.log(res.data)
        }
        this.setData({
          disabled: false
        })
      }
    })
  },

  // 设为默认卡
  setDefaultCard(event) {
    if (!this.data.disabled) {  //在其他操作进行中不允许点击
      my.confirm({
        title: '提示',
        content: '您确认用' + event.target.dataset.form.name + '的卡设置为默认卡吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          if (result.confirm) {
            let url = api.updateDefaultCard + '?cardId=' + event.target.dataset.form.id;
            let data = {};
            let method = 'POST';
            let header = 'application/json';
            app.request(url, data, method, header, false).then(res => {
              console.log(res);
              this.getCardList()
              app.setGlobalLocalStorage('cardNo', event.target.dataset.form.cardNo);
              app.setGlobalLocalStorage('cardId', event.target.dataset.form.id);
              app.setGlobalLocalStorage('reloadIndex', true);
              app.setGlobalLocalStorage('reloadMe', true);
              app.setGlobalLocalStorage('reloadApp', true);
            })
          } else {

          }

        },
        fail: (res => {
          console.log(res);
        })
      });
    }
  },
  toIndexByCardNo(query) {
    if (!this.data.disabled) { //在其他操作进行中不允许点击
      let oldNo = app.getGlobalLocalStorage("cardNo");
      let newNo = query.target.dataset.form.cardNo;
      if (oldNo != newNo) {
        my.confirm({
          title: '提示',
          content: '您确认用' + query.target.dataset.form.name + '的卡登录平台吗？',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          success: (result) => {
            if (result.confirm) {
              app.setGlobalLocalStorage('cardNo', query.target.dataset.form.cardNo);
              app.setGlobalLocalStorage('cardId', query.target.dataset.form.id);
              app.setGlobalLocalStorage('reloadIndex', true);
              app.setGlobalLocalStorage('reloadMe', true);
              app.setGlobalLocalStorage('reloadApp', true);
              my.switchTab({
                url: '/pages/index/index', // 跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。注意：路径后不能带参数 
              });
            }
          }
        })
      }
    }

  },

  // 添加到卡包
  addCardToAlipay(cardNo) {
    this.setData({
      disabled: true
    })
    let oldNo = app.getGlobalLocalStorage("cardNo");
    let newNo = cardNo.target.dataset.cardno;
    my.showLoading({
      content: '提交中...',
    });
    my.getAuthCode({
      scopes: ['auth_user', 'auth_ecard'],
      success: (res) => {
        console.log(res)
        let url = api.addCardToAlipay + '?authCode=' + res.authCode + '&cardNo=' + cardNo.target.dataset.cardno;
        let data = {};
        let method = 'POST';
        let header = 'application/json';
        app.request(url, data, method, header, false).then(res => {
          if (res.code == 0) {
            my.hideLoading();
            if (oldNo == newNo) {
              // 将后端返回的card信息设置到storage里面
              app.setGlobalLocalStorage('cardNo', res.cardInfo.cardNo);
              app.setGlobalLocalStorage("cardId", res.cardInfo.id);
              app.setGlobalLocalStorage('reloadIndex', true);
            }
            // this.getCardList()
            my.showToast({
              type: 'success',
              content: '添加成功！',
              duration: 1000,
              success: (res => {
                this.getCardList();
              })
            });
          }
          if (res.code == 500) {
            my.showToast({
              type: 'fail',
              content: '添加失败！',
              duration: 2000
            });
            this.setData({
              disabled: false
            })
          }
        })
      },
      fail: (res) => {
        my.hideLoading();
      }
    });
  },
  // 关闭tips
  closeTips() {
    let tips = app.getGlobalLocalStorage('cardtips') - 1;
    app.setGlobalLocalStorage("cardtips", tips)
    this.setData({
      tips: false
    })
  },
  // 再另一张卡
  redirctToGetCard() {
    my.navigateTo({
      url: '/pages/collar-card/identity-select/index'
    });
  },
  onShow() {
    this.getCardList();
  },
  onLoad() {
    if (app.getGlobalLocalStorage('cardtips') > 1 ) {
      this.setData({
        tips: true
      })
    } else {
      this.setData({
        tips: false
      })
    }
    // this.getCardList();
    // 禁止页面下拉
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    };
    // 卡包隐藏红点
    if (my.hideTabBarRedDot) {
      my.hideTabBarRedDot({
        index: 1
      })
      let dot = app.getGlobalLocalStorage('carddots') - 1;
      app.setGlobalLocalStorage("carddots", dot)
    }
  },
  goBack() {
    my.navigateBack();
  }
});
