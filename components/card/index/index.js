const app = getApp();
const api = require('/bin/api/index.js');
Component({
  mixins: [],
  data: {
  },
  props: {
    qrcode: false,
    scan: false,
    defaultUserInfo: {},
    pages:''
  },
  didMount() {
    // this.getCardList()
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    // 获取所有的卡
    // getCardList() {

    //   let url = api.queryIsOpenCard;
    //   let data = {};
    //   let method = 'GET';
    //   let header = 'application/json';
    //   app.request(url, data, method, header, false).then(res => {
    //     console.log(res);
    //     if (res.code == 0) {
    //       let defaults = [];
    //       if (res.data.length > 0) {
    //         for (var i = 0; i < res.data.length; i++) {
    //           if (res.data[i].defaultCard == '1') {
    //             this.setData({
    //               defaultUserInfo: res.data[i]
    //             })
    //           }
    //         }
    //       }
    //     }
    //   })
    // },
    //跳转到二维码页面
    redirctToQrCode() {
      my.navigateTo({
        url: '/pages/qrcode/index',
      });
    },


    onScan() {
      my.scan({
        type: 'qr',
        success: (res) => {
          if (new RegExp("^lg#1#d#.*$").test(res.code)) {
            my.navigateTo({
              url: '/pages/scan/index?code=' + res.code +'&pages='+this.props.pages
            });
          }else{
            my.navigateTo({
              url: '/pages/scan/index?code=failure'+'&pages='+this.props.pages
            });
          }
        },
      });
    },
  },
});
