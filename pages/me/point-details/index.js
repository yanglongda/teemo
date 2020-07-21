const app = getApp();
const api = require('/bin/api/index.js');

Page({
  data: {
    totalScore: 0,
    page: 1,
    mockData: [],
    show: false,
    totalCount: null,
    list: [],
  },
  onLoad(options) {
    this.setData({
      totalScore: options.point
    })
    if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
    this.getCardPointLog()
  },
  //获取学习值明细
  getCardPointLog(page = 1) {
    let list = this.data.list;
    let url = api.getCardPointLog + '?page=' + page;
    let method = 'GET';
    let header = 'application/json';
    let data = {};
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
              show: false,
              totalCount: res.page.totalCount
            });
          }
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
        this.getCardPointLog(newPage);
      }
    } catch (e) {
      this.setData({ show: false });
      console.log('scrollMytrip执行异常:', e);
    }
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB',
    });
  },
  // 跳转到小目标页面
  redirectToGoal(){
    my.navigateTo({
      url:'/pages/goal/goal/index'
    });
  },

  //onScroll
  // onScrollMyView(event){
  //   console.log(event)
  // }
});
