const app = getApp();
const api = require('/bin/api/index.js')
module.exports = {
  // 小程序点击
  doAppClick(operateType, openAppId, appUrl, appTitle, appFunc, appParam) {
    console.log(operateType, openAppId, appUrl, appTitle, appFunc, appParam);
    // if (app.getGlobalLocalStorage("isUma")) {
    //   app.globalData.uma.trackEvent('doAppClick', { 'appId': openAppId, "appTitle": appTitle })
    // }
    // 小程序
    if (operateType == 'openNative') {
      // 打方式:navigateToAlipayPage
      if (appFunc && appUrl && appFunc == "navigateToAlipayPage") {
        appUrl = resolveVariables(appUrl);
        my.ap.navigateToAlipayPage({
          path: appUrl,
          success: (res) => {
            console.log(JSON.stringify(res))
          },
          fail: (error) => {
            console.log(JSON.stringify(error))
          }
        })
      } else {
        // 默认打开方式:navigateToMiniProgram
        let params = {
          "cardId": app.getGlobalLocalStorage('cardId')
        };
        if (appParam) {
          try {
            appParam = resolveVariables(appParam);
            let appParamJson = JSON.parse(appParam);
            for (var attr in appParamJson) {
              params[attr] = appParamJson[attr];
            }
          } catch (err) {
            console.log(err)
          }
        }

        // 2021001117626528 课表 测试使用
        // 2021001118673392 校园防疫
        
        if (openAppId == 2021001118673392) {
          let userInfo = app.getGlobalLocalStorage('globalUserInfo');
          if (userInfo.hasOwnProperty('idCardMd5')) {
            params['idCardMd5'] = userInfo.idCardMd5 || ''
          } else {
            params['idCardMd5'] = ''
          }
          let cardInfo = app.getGlobalLocalStorage('cardInfo')
          params['name'] = cardInfo.name || ''
        }

        console.log('doAppClick_navigateToMiniProgram', appUrl, JSON.stringify(params));
        my.navigateToMiniProgram({
          appId: openAppId,
          path: appUrl,
          extraData: params,
          success: (res) => {
            console.log(JSON.stringify(res))
          },
          fail: (res) => {
            console.log(JSON.stringify(res))
          }
        });
      }
    } else if (operateType == 'openWeb') {
      appUrl = resolveVariables(appUrl);
      if (appUrl.indexOf("https://render.alipay.com") == 0) {
        my.ap.navigateToAlipayPage({
          path: appUrl,
          success: (res) => {
            console.log(JSON.stringify(res))
          },
          fail: (error) => {
            console.log(JSON.stringify(error))
          }
        });
      } else {
        my.navigateTo({
          url: '/pages/web-view/index?src=' + appUrl
        });
      }
    } else if (operateType == "staticinfo" && appUrl) {
      appUrl = resolveVariables(appUrl);
      my.navigateTo({
        url: appUrl
      });
    }
  },

  // 二维码页面和个人信息页面的回调
  getCardInfo(callback) {
    let apiUrl = api.getCardInfo + '?cardNo=' + app.getGlobalLocalStorage("cardNo");
    let data = {}
    let method = 'GET'
    let header = 'application/json'
    app.request(apiUrl, data, method, header, false)
      .then(res => {
        app.setGlobalLocalStorage("cardInfo", res.cardInfo);
        app.setGlobalLocalStorage("cardId", res.cardInfo.id);
        app.setGlobalLocalStorage("cardNo", res.cardInfo.cardNo);
        if (callback) {
          callback();
        }
      })
  },


 //点击文章链接到生活号详情页
  getArticleDetail(event) {
    // if (app.getGlobalLocalStorage("isUma")) {
    //   app.globalData.uma.trackEvent('getArticleDetail', { 'title': event.target.dataset.form.title })
    // }
    //如果appUrl不为空
    if (event.target.dataset.form.url) {
      my.ap.navigateToAlipayPage({
        path: event.target.dataset.form.url,
        success: (res) => {
          console.log(JSON.stringify(res))
        },
        fail: (error) => {
          console.log(JSON.stringify(error))
        }
      })
    }
  }
}

// 用户自定义变量解析
function resolveVariables(variables) {
  if (variables) {
    return variables.replace(/#{cardId}/g, app.getGlobalLocalStorage('cardId')).replace(/#{cardNo}/g, app.getGlobalLocalStorage('cardNo'));
  }
  return variables;
}

