var util = require('./utils/util.js');
var api = require('./config/api.js');
var user = require('./services/user.js');

App({
  onLaunch: function () {
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
    token: '',
    sessionData:{
      session_key:'',
      user_id: '',
      openid: ''
    },
    addressId:0,
    addressText: ''
  }
});