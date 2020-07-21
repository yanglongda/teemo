Page({
  data: {
    errorInfo: '请稍后重试~',
    isSelf: false,
    isBinding:false
  },
  submitAgain() {
    my.switchTab({
      url: '/pages/index/index',
    });
  },
  onLoad(options) {
    this.setData({
      errorInfo: options.errorInfo == "" ? '请稍后重试~' : options.errorInfo,
      isSelf: options.isSelf,
      isBinding:options.isBinding?true:false
    });
    // 禁止页面下拉
   if (my.setCanPullDown) {
      my.setCanPullDown({
        canPullDown: false
      })
    }
  },
});
