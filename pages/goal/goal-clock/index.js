const app = getApp();
const api = require('/bin/api/index.js');
Page({
  data: {
    goalItem: {},
    goalId: '',
    btnBg: 'btn-bg',
    modalOpen: false,
    isInTime: true,
    honorModal: false,
    medalsList: [],
    insistDays: 0,
    isDisplay: false
  },
  onLoad(options) {
    if (options.goalId) {
      this.setData({
        goalId: options.goalId
      })
      this.getGoalsInfo();
    }
  },
  //获取当前目标信息
  getGoalsInfo() {
    let apiUrl = api.getGoalsDetails + '?goalId=' + this.data.goalId
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      //获取当前时间
      if (my.getServerTime) {
        my.getServerTime({
          success: (re) => {
            let hour = new Date(re.time).getHours();
            let min = new Date(re.time).getMinutes();
            let current = hour + ':' + min;
            // 将时分转换为秒来计算大小
            current = this.time_to_sec(current);
            let start = this.time_to_sec(res.data.clockStartTime);
            let end = this.time_to_sec(res.data.clockEndTime)
            //当前时间大于开始时间并小于结束时间才显示打卡按钮
            if (current < end && current > start) {
              this.setData({
                isInTime: true
              })
            } else {
              this.setData({
                isInTime: false
              })
            }
            if (res.code == 0) {
              this.setData({
                goalItem: res.data,
                insistDays: res.totalCount,
                isDisplay: true
              })
            }
          },
        });
      } else {
        if (res.code == 0) {
          this.setData({
            goalItem: res.data,
            insistDays: res.totalCount,
            isDisplay: true
          })
        }
      }
    })
  },
  //打卡
  goalsClockIn() {
    let me = this;
    //goalsClockIn
    let apiUrl = api.goalsClockIn;
    let data = {
      goalId: this.data.goalId
    }
    let method = 'POST'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, true).then(res => {
      if (res.code == 0) {
        this.setData({
          modalOpen: true
        });
        this.getGoalsInfo();
        //三秒后关闭弹出窗口
        if (this.data.modalOpen) {
          setTimeout(function() {
            me.setData({
              modalOpen: false
            })
            setTimeout(function() {
              //如果有获取勋章，则弹出勋章的窗口
              console.log(me.data.modalOpen, res.medals.length)
              if (!me.data.modalOpen && res.medals.length > 0) {
                me.setData({
                  honorModal: true,
                  medalsList: res.medals,
                })
              }
            }, 100)

          }, 2000)
        }
      }
    })
  },
  //跳转到勋章墙页面
  redirectToHonorList() {
    my.navigateTo({
      url: '../goal-honor/index'
    })
  },
  //关闭modal
  onModalClose() {
    this.setData({
      modalOpen: false
    })
  },
  //关闭modal1
  onModalClose21() {
    this.setData({
      honorModal: false
    })
  },
  //跳转到打卡记录页面
  redirectToClockRecord() {
    my.navigateTo({
      url: '../goal-clock-record/index?goalId=' + this.data.goalId
    });
  },
  /**
    * 时间转为秒
    * @param time 时间(00:00:00)
    * @returns {string} 时间戳（单位：秒）
    */
  time_to_sec(time) {
    var s = '';
    var hour = time.split(':')[0];
    var min = time.split(':')[1];
    s = Number(hour * 3600) + Number(min * 60)
    return s;
  }
});
