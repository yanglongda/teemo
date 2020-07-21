const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    date: '',
    cardRecord: [],
    cardRecordIsNone: false,
    startDate: '',
    endDate:'',
    totalCount: null,
    list: [],
    page:1,
    show:false,
    dateIsNone:false
  },
  onLoad() {

  },
  getCardList(date,page = 1) {
    let list = this.data.list;
    let url = api.getCardRecordList+'?page = '+page;
    let method = "GET";
    let header = "application/json";
    let data = {
      date: date
    }
    app.request(url, data, method, header, false).then(res => { 
      if (res.code == 0) {
        if (list.length < res.page.totalCount) {
          if (res.page.list.length > 0) {
            let data = res.page.list;
            for (let i = 0; i < data.length; i++) {
              let newObj = { ...data[i] };
              list.push(newObj);
            }
            this.setData({
              list,
              page,
              show:false,
              cardRecordIsNone: false,
              totalCount: res.page.totalCount
            });
          }else{
            this.setData({
              cardRecordIsNone: true,
            })
          }
        }else if(res.page.totalCount != 0){
          this.setData({
            list:res.page.list,
            cardRecordIsNone: false,
            totalCount: res.page.totalCount
          })
        }else{
          this.setData({
              cardRecordIsNone: true,
            })
        }
      }
    })
  },
  /**
   * scroll-view滑到底部触发事件
   * @method scrollMytrip
   */
  async scrollMytrip() {
    try {
      let page = this.data.page;
      let list = this.data.list;
      // 判断是否还有数据需要加载
      if (list.length < this.data.totalCount) {
        this.setData({ show: true });
        const newPage = page + 1;
        this.getCardList(this.data.date,newPage);
      }
    } catch (e) {
      this.setData({ show: false });
      console.log('scrollMytrip执行异常:', e);
    }
  },
  getDate() {
    my.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: '',
      startDate: this.data.startDate, //开始时间为当前时间往前推5年
      endDate: this.data.endDate, //结束时间为当前时间
      success: (res) => {
        console.log(res);
        this.setData({
          date: res.date
        })
        this.getCardList(this.data.date,1)
      },
    })
  },
  closeDateSelect(){
    this.setData({
      dateIsNone:true,
      date:''
    })
    this.getCardList('',1)
  },
  onShow() {
    my.getServerTime({
      success: (res) => {
        let day = new Date(res.time).getDate();
        let year = new Date(res.time).getFullYear();
        let month = new Date(res.time).getMonth() + 1;
        if (month < 10) {
          month = "0" + month
        }
        if (day < 10) {
          day = "0" + day
        }
        this.setData({
          date: year + '-' + month + '-' + day,
          startDate: year - 5 + '-' + month + '-' + day,
          endDate: year + '-' + month + '-' + day
        })
        this.getCardList(this.data.date,1);
      },
    });
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  }
});
