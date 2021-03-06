var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList,{userType: that.data.userInfo.user_type},'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
      }
    });
  },
  payOrder(){
    wx.navigateTo({
      url: '/pages/pay/pay',
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })

    this.getOrderList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})