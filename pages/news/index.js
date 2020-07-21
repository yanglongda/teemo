const app = getApp();
const api = require('/bin/api/index.js');
const common = require('/bin/common/common.js')
Page({
  data: {
    bannerList: [],
    list: [],
    currentIndex: 0,
    type: '',
    page: 1,
    totalCount: null,
  },
  onLoad(options) {
    this.setData({
      type: options.type
    })
    this.getArticleList(options.type, this.data.page)
  },
  getArticleList(type, page) {
    let list = this.data.list;
    let apiUrl = api.getArticleList;
    let data = {
      type: type,
      page: page
    }
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        if (list.length < res.page.totalCount) {
          if (res.page.list.length > 0) {
            let data = res.page.list;
            for (let i = 0; i < data.length; i++) {
              let month = new Date(data[i].createTime).getMonth()+1;
              let date = new Date(data[i].createTime).getDate();
              data[i].time = (month <10?'0'+month:month) +'-'+(date<10?'0'+date:date)
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
  async scrollMytrip() {
    try {
      let page = this.data.page;
      let list = this.data.list;
      // 判断是否还有数据需要加载
      if (list.length < this.data.totalCount) {
        this.setData({ show: true });
        const newPage = page + 1;
        this.getArticleList(this.data.type, newPage);
      }
    } catch (e) {
      this.setData({ show: false });
      console.log('scrollMytrip执行异常:', e);
    }
  },

  // 文章详情
  getArticleDetails(event) {
    common.getArticleDetail(event)
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB'
    });
  },
});
