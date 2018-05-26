var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    cartId: 0,
    cartInfo: {},
    cartGoods: [],
    handleOption: {},
    distance:0,
    userInfo:{},
    estimateTaskFlag: true,
    numberOfvehicle: 0,
    input_focus:false
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
  bindChange: function (e) {   //  存入input
    if (e.detail && e.detail.value.length > 0) {
      if (e.detail.value.length < 1 || e.detail.value.length > 500) {
        wx.showToast({
          title: '至少输入一个字符，长度不能超过250个汉字',
          icon: 'fail',
          duration: 1000
        })
      } else {
        this.setData({
          numberOfvehicle: e.detail.value
        })
      }
    } else {
      this.setData({
        remark: ''
      });
      app.func.showToast('请输入备注', 'loading', 1000);
    }
  },
  listenerPhoneInput: function (e) {  // 用户名input  获得焦点。 可填写内容
    this.setData({
      input_focus: true
    });
  },
  estimateTask: function(){
    this.setData({
      estimateTaskFlag: !this.data.estimateTaskFlag
    })
  },
  //取消按钮  
  rejectTask: function () {
    this.setData({
      estimateTaskFlag: true
    });
  },
  //确认  
  grabTask: function () {
    let that = this;
    util.request(api.CartUpdate, { id: that.data.cartId, goodsId: that.data.cartInfo.goods_id, productId: that.data.cartInfo.product_id, number: that.data.numberOfvehicle, status: 1, taskUserId: that.data.userInfo.id}, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log('更新cart status成功');
        that.setData({
          estimateTaskFlag: true
        })
        wx.switchTab({
          url: '/pages/cart/cart',
          
        })
      }
    });

  },  

  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;
    var params = ''
    params = params + 'cartId=' + that.data.cartId;


    wx.navigateTo({
      url: '../shopping/checkout/checkout?' + params
    });
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