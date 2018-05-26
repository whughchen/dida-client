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
    vehicleTypeId:9999,
    addressText: '',
    addressId: 0,
    userInfo:{},
    currentTab: 0,
    cartGoods: [],
    cartTotal: 0,
    page: 1,
    size: 10,
    numberOfvehicle:0
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
    var userInfo = wx.getStorageSync('userInfo');
    if (that.data.userInfo.id){
      that.setData({
        userInfo: userInfo
      })
    }else{
      this.goLogin();
    }
    var location = wx.getStorageSync('location');

    if (!location){
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var loc = { lon: res.longitude, lat: res.latitude };
          wx.setStorageSync('location',loc);
          if (that.data.userInfo.id){
            util.request(api.UpdateLocation, { location: loc }, 'POST').then(function (res) {
              console.log('更新位置成功'+res)
            });
          }

          
        }
      })
    }




    //工长页面请求车型列表
    if (that.data.userInfo.user_type !=2 ){
      that.getIndexData();
      //that.getAddressTxt();
    } else { //司机页面请求任务列表
      that.getHallCart();
      that.getNearByCart();
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
  checkData: function(){
    if(this.data.vehichleType == 9999 ){
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '用车类型是？',
        mask: true,
        icon: 'fail'
      });
      return;
    }
    if (this.data.numberOfvehicle == 0) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '工程量预估？',
        mask: true
        //icon: 'fail'
      });
      return;
    }
    if (this.data.addressId == 0) {
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '地址是？',
        mask: true,
        icon: 'fail'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/contractor/callLorry/callLorry?vehicleTypeId=' + this.data.vehicleTypeId + '&addressId=' + this.data.addressId + '&addressText=' + this.data.addressText + '&numberOfvehicle=' + this.data.numberOfvehicle,
    })
    


  },
  charChange: function (e) {
    if (e.detail && e.detail.value.length > 0) {
      if (e.detail.value.length < 1 || e.detail.value.length > 2) {
        wx.showToast({
          title: '请输入工程量预估多少车',
          icon: 'fail',
          duration: 1000
        })
      } else {
        if (isNaN(e.detail.value)){
          wx.showToast({
            title: '请输入数字',
            icon: 'fail',
            duration: 1000
          })
        }else{
          this.setData({
            numberOfvehicle: e.detail.value
          });
        }

      }
    } else {
      app.func.showToast('请输入预估车次', 'loading', 1000);
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


  goLogin() {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo,
        sessionData: res.data.sessionData,
      });
      wx.setStorageSync('userInfo', res.data.userInfo);
      wx.setStorageSync('sessionData', res.data.sessionData);
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
      console.log("user login error:" + JSON.stringify(err));
    });
  },


}
)
