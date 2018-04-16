const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const imageutil =require('../../../services/imageutil.js');

//获取应用实例
const app = getApp();
var id;
Page({
  data: {
    vehicleType:[],
    phone: 0  
  },

  getPhoneNumber: function (e) {
    // console.log(e.detail)
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)

    util.request(api.DescroPhone, { iv: e.detail.iv, encryptedData: e.detail.encryptedData, sessionData: wx.getStorageSync('sessionData') }, 'POST').then(function (res) {
      if (res) {
        this.setData({
          phone: res.data.phone
        });
        console.log('descro phoneNum=' + this.phone);
      }
    });
    
  },



  onShareAppMessage: function () {
    return {
      title: 'DidaLogistic',
      desc: '滴答货运',
      path: '/pages/contractor/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          vehicleType: res.data.vehicleType
        });
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
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
  },

  imageLoad: function (e) {
    var imageSize = imageutil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },

  choseVehicleType: function (e) {
    console.log(e.currentTarget.dataset.id +' be selected')
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      id: id
    })
  }


},
id=0
)
