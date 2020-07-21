// 获取app.js中的自定义内容
const app = getApp(); 
const root = 'card-api/api/';
const API_BASE_URL = app.serviceUrl + root;


module.exports = {
  // 客户端获取支付宝用户信息 get请求
  getClientUserInfo: API_BASE_URL + 'loginByAlipay',
  //注册信息
  registerByAlipay: API_BASE_URL+ 'registerByAlipay',
  // 查询学籍账号 get请求
  queryStudentStatusAccount: API_BASE_URL + 'getStudentStatusAccount',

  // 查询是否开卡 get请求
  queryIsOpenCard: API_BASE_URL + 'card/getList',

  // 查询开卡Url get请求
  queryOpenCard: API_BASE_URL + 'card/getActivateUrl',

  // 开卡接口 post请求
  addCard: API_BASE_URL + 'card/addCard',
  
  // 授权接口
  authCodeApi: API_BASE_URL + 'authCode',

  // 查询是否授权 get请求
  queryAuthCode: API_BASE_URL + 'getAuthCode',
  
  // 注册接口 post请求
  registerApi: API_BASE_URL + 'register',

  // 获取角色权限接口
  queryRoleJurisdiction: API_BASE_URL + 'getRoleJurisdiction',

  getUserIdentity:API_BASE_URL + 'getUserIdentity',

  // 获取个人信息接口
  queryUserInfo: API_BASE_URL + 'getUserInfo',

  // 更新个人信息接口
  patchUserInfo: API_BASE_URL + 'updateUserInfo',

  // 获取首页常用应用接口
  queryCommonUsedApplication : API_BASE_URL + 'getCommonUsedApplication',

  //获取省级服务应用接口
  queryProviceApplication : API_BASE_URL +'getProviceApplication',

  // 获取市级服务应用窗口
  querytCityApplication : API_BASE_URL + 'getCityApplication',

  // 获取校级服务应用窗口
  querySchoolApplication : API_BASE_URL + 'getSchoolApplication',

  // 获取广告位应用

  queryBannerApplication:API_BASE_URL +'getBannerApplication',
  
  // 更新用户身份

  updateIdentity : API_BASE_URL + 'updateIdentity',

  // 判断用户是否登陆
  getOpenCardStatus: API_BASE_URL + 'card/status',

  // 加载用户默认卡信息
  getDefaultCard:API_BASE_URL + 'card/getDefaultCard',

  // 个人详细信息
  getStudyUserInfo:API_BASE_URL+'studyUser/getStudyUserInfo',

  // 学籍信息
  getSchoolRollInfo:API_BASE_URL+'studyUser/getSchoolRollInfo',

  // 设为默认卡
  updateDefaultCard:API_BASE_URL + 'card/updateDefaultCard',

  // 初始化用户开卡数据
  initCardData:API_BASE_URL+'card/setting',

  // 用卡记录
  getCardRecord:API_BASE_URL +'cardLog/getCardLogList',

  getCardRecordList:API_BASE_URL +'cardLog/getCardLog',

  // 添加到卡包
  addCardToAlipay:API_BASE_URL+'card/addCardToAlipay',

  //二维码扫码登录
  qrCodeLogin:API_BASE_URL+'card/binding',

  //系统设置
  getSystemSettings:API_BASE_URL+'system',

  // 二维码刷新
  getQrcode:API_BASE_URL+'qrcode/refresh',

  // 消息公告
  getNotice:API_BASE_URL+'system/notice',

  //获取用户信息
  getInfo:API_BASE_URL+'card/info',

  // 小目标模块
  // 获取小目标列表(所有)
  getGoalList:API_BASE_URL + 'goals/getAllGoalsList',

  //我的小目标列表（个人）
  getCardGoalsList:API_BASE_URL + 'goals/getCardGoalsList',

  //获取小目标详情信息
  getGoalsDetails:API_BASE_URL + 'goals/getGoalsInfo',

  //添加小目标
  addGoals:API_BASE_URL + 'goals/addGoals',

  //删除小目标
  deleteGoals:API_BASE_URL + 'goals/deleteGoals',

  //打卡
  goalsClockIn:API_BASE_URL + 'goals/addClock',

  //小目标打卡统计
  getClockStatInfo:API_BASE_URL + 'goals/getClockStatInfo',

  //获取打卡日期集合
  getClockList:API_BASE_URL + 'goals/getClockList',

  //勛章列表
  getMedalTypeList:API_BASE_URL + 'medal/getMedalTypeList',

  //勋章列表详情
  getMedalItemList:API_BASE_URL + 'medal/getMedalItemList',

  //获取积分
  getCardPoint:API_BASE_URL + 'point/getCardPoint',

  //获取积分明细
  getCardPointLog:API_BASE_URL + 'point/getCardPointLog',


  // 获取高校文章banner列表
  getArticleBannerList:API_BASE_URL + 'article/banner',
  
  //获取高校文章列表
  getArticleList:API_BASE_URL + 'article/list',

  ///api/user/getUserType 获取用户身份信息（1中小学生2大学生3其他（社会公众/老师）
  getUserType:API_BASE_URL + 'user/getUserType',

  ///api/getApplicationList 应用列表
  getApplicationList:API_BASE_URL + 'getApplicationList',

  //1小学生 2中学生 3大学生 4 教师 5公众
  getCardType:API_BASE_URL+'card/getCardType',

    //
  storeUserInfo:API_BASE_URL + 'qrcode/scan',

  authLogin:API_BASE_URL +'auth/login',


  getCardInfo:API_BASE_URL +'card/info',
//获取活动领取信息
   getActivityInfo:API_BASE_URL +'card/alert',
//插入更新活动领取信息
   updateActivityInfo:API_BASE_URL +'card/insertActivity',


}