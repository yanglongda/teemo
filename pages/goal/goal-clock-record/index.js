
const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    goalId: '',
    totalCount: '',
    monthCount: '',
    maxTotalize: '',
    tagData: [],
    curYear:''
  },
  onLoad(options) {
    if (options.goalId) {
      this.setData({
        goalId: options.goalId
      })
      var year = ''
      var month = '';
      my.getServerTime({
        success: (re) => {
          year = new Date(re.time).getFullYear();
          month = new Date(re.time).getMonth() + 1;
          if (month < 10) {
            month = '0' + month
          }
          this.getClockStatInfo(year + '-' + month);
          this.getClockList(year + '-' + month)
        }
      })

    }
  },
  //getClockStatInfo   小目标统计
  getClockStatInfo(month) {
    let apiUrl = api.getClockStatInfo + '?goalId=' + this.data.goalId + '&month=' + month;
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, true).then(res => {
      if (res.code == 0) {
        this.setData({
          totalCount: res.data.totalCount ? res.data.totalCount : 0,
          monthCount: res.data.monthCount ? res.data.monthCount : 0,
          maxTotalize: res.data.maxTotalize ? res.data.maxTotalize : 0
        })
      }
    })

  },

  //获取打卡日期集合 getClockList
  getClockList(month) {
    let apiUrl = api.getClockList + '?goalId=' + this.data.goalId + '&month=' + month;
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      let arr = [];
      if (res.code == 0) {
        if (res.data.length > 0) {
          res.data.forEach(x => {
            arr.push({ "date": x, "tag": "已打卡" })
          })
          this.setData({
            tagData: arr
          })
        }
      }
    })
  },

  //onMonthChange
  onMonthChange(currentMonth, prevMonth) {
    
    // 先获取当前年份
    my.getServerTime({
      success: (re) => {
        let year = new Date(re.time).getFullYear();
        if(this.data.curYear == ''){
          this.setData({
            curYear: new Date(re.time).getFullYear()
          })
        }
        //切换后的当前月份
        var month = currentMonth + 1;
        //切换后的当前年份
        if (currentMonth - prevMonth == -11) {
         this.setData({
           curYear : this.data.curYear + 1
         })
        }
        if (currentMonth - prevMonth == 11) {
          this.setData({
           curYear :  this.data.curYear - 1
         })
        }
        if(month < 10){
          month = "0"+month
        }
        this.getClockStatInfo(this.data.curYear + '-' + month);
        this.getClockList(this.data.curYear + '-' + month)
      },
    });
  }
});
