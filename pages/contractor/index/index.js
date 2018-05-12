const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const imageutil =require('../../../services/imageutil.js');

//获取应用实例
const app = getApp();
//var id;
Page({
  data: {
    vehicleTypes:[],
    phone: '' ,
    vehicleTypeId:-1,
    addressText: '',
    addressId: 0,
    userInfo:{},
    currentTab: 0,
    cartGoods: [],
    cartTotal: 0,
    page: 1,
    size: 10
  },




  onShareAppMessage: function () {
    return {
      title: 'DidaLogistic',
      desc: '滴答货运',
      path: '/pages/contractor/index/index'
    };
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          vehicleTypes: res.data.vehicleType
        });
      }
    });
  },
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let that=this;
    var location = wx.getStorageSync('location');
    if (!location){
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var loc = { lon: res.longitude, lat: res.latitude };
          wx.setStorageSync('location',loc);
        }
      })
    }

    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo
    })


    //工长页面请求车型列表
    if (that.data.userInfo.user_type !=2 ){
      that.getIndexData();
      //that.getAddressTxt();
    } else { //司机页面请求任务列表
      that.getHallCart();
    }
    // 跳转带来的参数
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //上一页
    if (currPage.data.addressText != "") {
      that.setData({//将携带的参数赋值
        addressId: currPage.data.addressId,
        addressText: currPage.data.addressText,
      });
    }else{
      that.setData({//将携带的参数赋值
        addressId: app.globalData.addressId,
        addressText: app.globalData.addressText,
      });
    }


  },

  getAddressTxt: function(){
    let that = this;
    if (app.globalData.contractorAddressId > 0) {
      util.request(api.AddressDetail + '?id=' + app.globalData.contractorAddressId).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            contractorAddressTxt: res.data.address,
            addressId: res.data.addressId
          });
        }
      });
    } /*else {
      that.setData({
        contractorAddressTxt: app.globalData.contractorAddressTxt
      })
    }*/
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  imageLoad: function (e) {
    var imageSize = imageutil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    });
  },

  choseVehicleType: function (e) {
    console.log(e.currentTarget.dataset.id +' be selected')
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      vehicleTypeId: id
    });
  },

  //司机端程序
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (that.data.currentTab==1){ // 第二标签页：周边任务
        that.getNearByCart();
      }
    }
  },
  getHallCart: function () {
    let that = this;
    util.request(api.HallCart, { page: that.data.page, size: that.data.size},'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.hallCart,
          cartTotal: res.data.hallCartCount
        });
      }
    });
  },

  getNearByCart: function () {
    let that = this;
    var location = wx.getStorageSync('location');
    util.request(api.NearByCart, { lon: location.lon, lat: location.lat},'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.nearByCart,
          cartTotal: res.data.cartTotal
        });
      }

    });
  },
  onReachBottom() {
    if (this.data.cartTotal/this.data.size > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
    } else {
      return false;
    }

    this.getHallCart();
  },
  gotoCartDetail: function(){
    wx.navigateTo({
      url: '/pages/cartDetail/cartDetail'
    })
  }


}
)
