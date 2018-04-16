var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
/*    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log('login res.code='+res.code)
        } else {
          console.log('获取用户登录态失败:' + res.errMsg)
        }
      }
    });*/
    //获取用户的登录信息
    user.checkLogin().then(res => {
      console.log('app login success,res='+JSON.stringify(res.data));
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.token = wx.getStorageSync('token');
    }).catch((err) => {
      console.log('error in login '+JSON.stringify(err));
    });
  },
  
  globalData: {
    userInfo: {
      nickname: '游客',
      username: '点击去登录',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: ''
  }
})