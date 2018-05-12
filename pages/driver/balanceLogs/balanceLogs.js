// pages/driver/balanceLogs/balanceLogs.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceLogs: [],
    myBalance: 0,
    withdrawSum: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyBalance();
    this.withdrawSum();
    this.balanceLog();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getMyBalance: function(e) {
    let that = this;
    util.request(api.GetMyBalance).then(function (res) {
      if (res.errno === 0 && res.data.myBalance.lenght >0) {
        that.setData({
          myBalance: res.data.myBalance[0].balance
        });
        console.log('balance = ' + that.data.myBalance);
      }
    });

  },

  withdrawSum: function (e) {
    let that = this;
    util.request(api.WithdrawSum).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          withdrawSum: res.data.withdrawSum
        });
        console.log('withdrawSum = ' + that.data.withdrawSum);
      }
    });

  },
  balanceLog: function (e) {
    let that = this;
    util.request(api.BalanceLog, 'POST').then(function (res) {
      if (res.errno === 0) {
        that.setData({
          balanceLogs: res.data.balanceLogs
        });
        console.log('balanceLogs = ' + that.data.balanceLogs);
      }
    });
  }

});