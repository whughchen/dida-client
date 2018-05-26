var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    sessionData:{},
    phone:'',
    myBalance: 0,
    withdrawSum: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(app.globalData);
  },
  onReady: function () {

  },
  onShow: function () {

    let userInfo = wx.getStorageSync('userInfo');
    let sessionData = wx.getStorageSync('sessionData');
    let phone = wx.getStorageSync('phone');

    // 页面显示
    if (userInfo  && sessionData) {
      app.globalData.userInfo = userInfo;
      app.globalData.sessionData=sessionData;

      this.setData({
        userInfo: app.globalData.userInfo,
        sessionData: app.globalData.sessionData,
        phone: phone
      });
      if (phone){
        this.setData({
          phone: phone
        });
      }
      if (userInfo.user_type ==2){
        this.getMyBalance();
        this.withdrawSum();
      }

    }
    if (!sessionData){
      this.goLogin();
    }else{
      this.setData({
        phone: userInfo.mobile
      })
    }

    



  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  onGotUserInfo: function (e) {

    console.log('getUserInfo:' + JSON.stringify(e.detail.userInfo))
    var fullUserInfo = this.updateUserInfo(e.detail.userInfo)
    app.globalData.userInfo = fullUserInfo;
    wx.setStorageSync('userInfo', fullUserInfo)
    this.setData({
      userInfo: fullUserInfo
    })
    this.updateUser();
    this.onShow();

  },

  updateUserInfo: function (userInfo){
    var userInfoFromLogin =this.data.userInfo;
    if (!userInfoFromLogin.gender){
      userInfoFromLogin.gender = userInfo.gender;
    }
    if (!userInfoFromLogin.nickname) {
      userInfoFromLogin.nickname = userInfo.nickName;
    }
    if (!userInfoFromLogin.country) {
      userInfoFromLogin.country = userInfo.country;
    }
    if (!userInfoFromLogin.province) {
      userInfoFromLogin.province = userInfo.province;
    }
    if (!userInfoFromLogin.city) {
      userInfoFromLogin.city = userInfo.city;
    }
    if (!userInfoFromLogin.language) {
      userInfoFromLogin.language = userInfo.language;
    }
    if (!userInfoFromLogin.avatarUrl) {
      userInfoFromLogin.avatarUrl = userInfo.avatarUrl;
      userInfoFromLogin.avatar = userInfo.avatarUrl;
    }
    var location = wx.getStorageSync('location');
    if (location){
      userInfoFromLogin.lon = location.lon;
      userInfoFromLogin.lat = location.lat;
    }
    
    return userInfoFromLogin;
  },

  updateUser:function(){
    util.request(api.UpdateUser, { userInfo: this.data.userInfo }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log('更新用户完整的信息成功');
      }else{
        console.log('更新用户完整的信息失败：'+ JSON.stringify(res));
      }
    })
  },

  getPhoneNumber: function (e) {
    let that = this;
    // console.log(e.detail)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)

    util.request(api.DescroPhone, { iv: e.detail.iv, encryptedData: e.detail.encryptedData, sessionData: wx.getStorageSync('sessionData') }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          phone: res.data
        });
        console.log('phone = ' + that.data.phone);
        wx.setStorageSync('phone', that.data.phone);
      }
    });
    this.onShow();

  },




  
  getMyBalance: function(e) {
    let that = this;
    util.request(api.GetMyBalance,{userId: that.data.userInfo.id},'POST').then(function (res) {
      if (res.errno === 0 && res.data.myBalance.length >0) {
        that.setData({
          myBalance: res.data.myBalance[0].balance
        });
        console.log('balance = ' + that.data.myBalance);
      }
    });

  },

  withdrawSum: function (e) {
    let that = this;
    util.request(api.WithdrawSum, { userId: that.data.userInfo.id }, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          withdrawSum: res.data.withdrawSum
        });
        console.log('withdrawSum = ' + that.data.withdrawSum);
      }
    });

  },

  goLogin(){
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo,
        sessionData: res.data.sessionData,
      });
      if (res.data.userInfo.mobile) {
        this.setData({
          phone: res.data.userInfo.mobile
        });
        wx.setStorageSync('phone', res.data.userInfo.mobile);
      }
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.sessionData = res.data.sessionData;
      app.globalData.token = res.data.token;


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

  },
  
  switchRole: function() {
    let that = this;
    util.request(api.SwitchRole).then(function (res) {
      if (res.errno === 0) {      
        console.log('身份切换成功, 当前身份为：'+ res.data.userInfo.user_type );
        that.setData({
          userInfo: res.data.userInfo
        });
        wx.setStorageSync('userInfo', res.data.userInfo);
      }
    });

    wx.showToast({
      title: '切换身份为' + (that.data.userInfo.user_type == 2 ? '司机': '工长'),
      icon:'success',
      duration:1000
    })

  },
})