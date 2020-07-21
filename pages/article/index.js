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
    this.data.list = [];
    this.data.bannerList = [];
    if (options.type) {
      this.setData({
        type: options.type
      })
      this.getArticleBannerList(options.type);
      this.getArticleList(options.type, this.data.page);
    }

  },
  // 获取文章banner
 getArticleBannerList(type) {
    console.log(type, this.data.list);
    let apiUrl = api.getArticleBannerList;
    let data = {
      type: type
    }
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false).then(res => {
      if (res.code == 0) {
        my.setNavigationBar({
          title: type
        });
        this.setData({
          bannerList: res.list
        })
      }
    })
  },
  // 获取文章列表
  
  getArticleList(type, page) {
    console.log(page);
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
  //自定义banner的dots 设置当前active的dot
  bannerChange: function(e) {
    let current = e.detail.current;
    this.setData({
      currentIndex: current
    })
  },
  onShow() {
    my.setNavigationBar({
      backgroundColor: '#3B68DB'
    });
  },
});
