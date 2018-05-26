const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const imageutil =require('../../../services/imageutil.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    upload_picture_list: [],
    vehichleTypeId: '',
    responceTime: '48小时之内',
    remark: '',
    cartInfo: {},
    photoUrlId: 0,
    addressId:0,
    addressText:'',
    nearByDrivers: [],
    formId: '0',
    numberOfvehicle:0
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    })
    this.uploadimage();  
  },


  //选择图片方法
  uploadpic: function (e) {
    var that = this//获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 5, // 默认9，这里显示一次选择相册的图片数量
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
      }
    });
  },
//点击上传事件
  uploadimage: function () {
    var page = this;
    var upload_picture_list = page.data.upload_picture_list;
    //循环把图片上传到服务器 并显示进度
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        this.upload_file_server(page, upload_picture_list, j);
      }
    }
  },
  //上传方法
  upload_file_server: function(that, upload_picture_list, j)
  {
    if (upload_picture_list[j].size >= 2*1024*1024){     
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '图片不能超过2M',
        mask: true,
        duration: 1000
      });
      return;
    }

    var time = new Date()
    var datetime = util.formatTime(time)//获取时间 防止命名重复
    var date = datetime.substring(0, 10)//获取日期 分日期 文件夹存储
    var successList = [];
    console.log("开始上传" + j + "图片到服务器：")
    //上传返回值
    var upload_task = wx.uploadFile({
      url: api.ApiRootUrl + 'upload/muckPic',
      filePath: upload_picture_list[j]['path'], //上传的文件本地地址
      name: 'file',
      header: { 'content-type': 'multipart/form-data' },
      formData: {
        'num': j,
        'datetime': datetime,
        'date': date,
        'userId': wx.getStorageSync('sessionData').userId,
      },
      //附近数据，这里为路径
      success: function (res) {
        //console.log(res.data)
        var data = JSON.parse(res.data)
        //字符串转化为JSON
        if (data.errno == 0) {
          console.log('upload OK, path=' + JSON.stringify(res.data));
          var filename = data.data.fileUrl;//存储地址 显示
          upload_picture_list[j]['path_server'] = filename;
          successList[j]= filename;
        } else {
          var filename = "https://127.0.0.1:8360/xx.png"//错误图片 显示
          //upload_picture_list[j]['path_server'] = filename;
          console.log('upload failed, reason=' + res.data);
        }
        that.setData({
          upload_picture_list: upload_picture_list
        });
        that.savePhotoUrl(successList);
        

      },
      

    });



    //上传 进度方法
    upload_task.onProgressUpdate((res) => {

      upload_picture_list[j]['upload_percent'] = res.progress
      //console.log('第' + j + '个图片上传进度：' + upload_picture_list[j]['upload_percent'])
      //console.log(upload_picture_list)
      that.setData({upload_picture_list: upload_picture_list});
    });
  },

  savePhotoUrl: function (upload_picture_list) {
    let that = this;
    util.request(api.SavePhotoUrl, { upload_picture_list: upload_picture_list}, 'POST').then(function (res) {
      console.log(res);
      if (res.errno == 0) {
        console.log('savePhotoUrl success');
        that.setData({
          photoUrlId: res.data.photoUrlId
        });
        that.createOrder();

      } else {
        console.log('savePhotoUrl failed');
      }
    });
  },

  submitCart: function () {
    

  },

  createOrder: function(){
    let that = this;
    if (!that.data.photoUrlId){
      wx.showToast({
        image: '/static/images/icon_error.png',
        title: '至少上传3张照片',
        mask: true
      });
      return;
    }

    util.request(api.CartAdd, { goodsId: that.data.vehichleTypeId, number: that.data.numberOfvehicle, productId: that.data.vehichleTypeId, responceTime: that.data.responceTime, remark: that.data.remark, photoUrlId: that.data.photoUrlId, location: wx.getStorageSync('location'), formId: that.data.formId, addressId: that.data.addressId, addressText: that.data.addressText }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {

          that.setData({
            cartInfo: res.data.cartList[0],
            nearByDrivers: res.data.nearByUsers
          });

          wx.switchTab({
            url: '../../cart/cart'
          });
          wx.showToast({
            title: '添加叫车订单成功',
            icon: 'success',
            duration: 1500
          });

        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }

      });
   
  },





  radioSelect: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      responceTime: e.detail.value
    });
  },
  charChange: function (e) {
    if (e.detail && e.detail.value.length > 0) {
      if (e.detail.value.length < 1 || e.detail.value.length > 500) {
        wx.showToast({
          title: '至少输入一个字符，长度不能超过250个汉字',
          icon: 'fail',
          duration: 1000
        })
      } else {
        this.setData({
          remark: e.detail.value
        });
      }
    } else {
      this.setData({
        remark: ''
      });
      wx.showToast('请输入备注', 'loading', 1000);
    }
  }, 





  onShareAppMessage: function () {
    return {
      title: 'DidaLogistic',
      desc: '滴答货运',
      path: '/pages/contractor/index/index'
    }
  },


  onLoad: function (options) {
    this.setData({
      vehichleTypeId: options.vehicleTypeId,
      addressId: options.addressId,
      addressText: options.addressText,
      numberOfvehicle: options.numberOfvehicle

    });
    console.log('跳转后vehicleid=' + this.data.vehichleTypeId + ',adressId=' + options.addressId);
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

  


}

)
