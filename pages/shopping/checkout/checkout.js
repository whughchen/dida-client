var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    cartId:0,
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      cartId: options.cartId
    })
    

    try {
      var addressId = options.addressId;
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }else {
        util.request(api.AddressList, { isDefault: 1 }).then(function (res) {
          if (res.errno === 0) {
            console.log(res.data);
            if(res.data.addressList){
              that.setData({
                addressId: res.data.addressList[0].id
              });
            }
          }
        });
      }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      console.log(e);
    }


  },
  
  getCheckoutInfo: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId, cartId: that.data.cartId}).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress(event) {

    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder () {
    if (!this.data.checkedAddress.id ) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { checkedAddress: this.data.checkedAddress, couponId: this.data.couponId, checkedGoodsList: this.data.checkedGoodsList[0] }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
                     
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/ucenter/order/order'
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})