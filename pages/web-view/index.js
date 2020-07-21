Page({
  data: {
    webViewSrc:''
  },
  onLoad(options) {
    this.setData({
      webViewSrc:options.src
    })
    // 禁止页面下拉
   if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  }
});
