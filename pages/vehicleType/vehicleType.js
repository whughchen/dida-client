var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var imageutil = require('../../services/imageutil');


// var app = getApp();

// Page({
//   data: {
//     id: 0,
//     brand: {},
//     goodsList: [],
//     page: 1,
//     size: 1000,
//     imagewidth: 0,//缩放后的宽
//     imageheight: 0,//缩放后的高
//     vehicleType:{}
//   },
//   onLoad: function (options) {
//     // 页面初始化 options为页面跳转所带来的参数
//     var that = this;
//     that.setData({
//       id: parseInt(options.id)
//     });
//     this.getVehicleTypeList();
//   },
//   getVehicleTypeList: function () {
//     let that = this;
//     util.request(api.VehicleTypeList, { id: that.data.id }).then(function (res) {
//       if (res.errno === 0) {
//         that.setData({
//           vehicleType: res.data.name
//         });

//         //that.imageLoad();
//       }
//     });
//   },

//   onReady: function () {
//     // 页面渲染完成

//   },
//   onShow: function () {
//     // 页面显示

//   },
//   onHide: function () {
//     // 页面隐藏

//   },
//   onUnload: function () {
//     // 页面关闭

//   },
//   imageLoad: function (e) {
//     var imageSize = imageutil.imageUtil(e)
//     this.setData({
//       imagewidth: imageSize.imageWidth,
//       imageheight: imageSize.imageHeight
//     })
//   }
// })


var app = getApp()
Page({

  data: {
    //默认未获取地址
    hasLocation: false
  },

  //获取经纬度
  getLocation: function (e) {
    console.log(e)
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
    })
  },
  //根据经纬度在地图上显示
  openLocation: function (e) {
    var value = e.detail.value
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude)
    })
  }
})
