var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    sessionData:{},
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(app.globalData);
  },
  onReady: function () {

  },
  onShow: function () {

    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let sessionData = wx.getStorageSync('sessionData');

    // 页面显示
    if (userInfo && token && sessionData) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
      app.globalData.sessionData=sessionData;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      sessionData: app.globalData.sessionData
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  goLogin(){
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo,
        sessionData: res.data.sessionData
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      app.globalData.sessionData = res.sessionData;
    }).catch((err) => {
      console.log("user login error:"+ JSON.stringify(err));
    });
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('sessionData');
          wx.switchTab({
            url: '/pages/contractor/index/index'
          });
        }
      }
    })

  }
})