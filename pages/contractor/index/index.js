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
    contractorAddressTxt: '',
    userInfo:{},
    currentTab: 0
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
    this.getIndexData();
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    let that=this;
    if (app.globalData.contractorAddressId >0){
      util.request(api.AddressDetail + '?id=' + app.globalData.contractorAddressId).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            contractorAddressTxt: res.data.address
          });
        }
      });  
    }else{
      that.setData({
        contractorAddressTxt: app.globalData.contractorAddressTxt
      })
    }

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
    }
  }


}
)
