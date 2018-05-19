var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    cartId: 0,
    cartInfo: {},
    cartGoods: [],
    handleOption: {},
    distance:0,
    userInfo:{}
  },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cartId: options.id,
      distance: (options.distance ? options.distance: 0)
    });
    this.getCartDetail();
  },
  getCartDetail() {
    let that = this;
    util.request(api.CartDetail, {
      cartId: that.data.cartId
    },'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(JSON.stringify(res.dada));
        that.setData({
          cartInfo: res.data.cartInfo,
          //cartGoods: res.data.cartGoods,
          //handleOption: res.data.handleOption
        });
        //that.payTimer();
      }
    });
  },
  payTimer() {
    let that = this;
    let cartInfo = that.data.cartInfo;

    setInterval(() => {
      console.log(cartInfo);
      cartInfo.add_time -= 1;
      that.setData({
        cartInfo: cartInfo,
      });
    }, 1000);
  },
  payCart() {
    let that = this;
    util.request(api.PayPrepayId, {
      cartId: that.data.cartId || 15
    }).then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
          }
        });
      }
    });

  },
  updateCartprice:function(){
    util.request(api.UpdateCartprice, {cartId: this.data.cartId},'POST').then(function (res) {
    });
  },
  grabTask: function () {
    util.request(api.GrabTask, { cartId: this.data.cartId }, 'POST').then(function (res) {
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})