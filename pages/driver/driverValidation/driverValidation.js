// pages/driver/driverValidation/driverValidation.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const imageutil = require('../../../services/imageutil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_id_list: [],
    upload_driver_liscense_list: [],
    iDphotoUrlId: 0,
    driverLiscensePhotoUrlId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //选择身份证
  uploadIDpic: function (e) {
    var that = this//获取上下文
    var upload_picture_list = that.data.upload_id_list
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
          upload_id_list: upload_picture_list,
        });
      }
    });
  },
  //选择驾驶证
  uploadDriverLiscensepic: function (e) {
    var that = this//获取上下文
    var upload_picture_list = that.data.upload_driver_liscense_list
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
          upload_driver_liscense_list: upload_picture_list,
        });
      }
    });
  },
  //点击上传事件
  uploadimage: function () {
    var page = this;
    var upload_picture_list = page.data.upload_id_list;
    //循环把图片上传到服务器 并显示进度
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        this.upload_file_server(page, upload_picture_list, j,0 );
      }
    }

    var upload_picture_list2 = page.data.upload_driver_liscense_list;
    //循环把图片上传到服务器 并显示进度
    for (var j in upload_picture_list2) {
      if (upload_picture_list2[j]['upload_percent'] == 0) {
        this.upload_file_server(page, upload_picture_list2, j, 1);
      }
    }
  },
  //上传方法
  upload_file_server: function (that, upload_picture_list, j,taskId) {
    if (upload_picture_list[j].size >= 2 * 1024 * 1024) {
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
          successList[j] = filename;
        } else {
          var filename = "https://127.0.0.1:8360/xx.png"//错误图片 显示
          //upload_picture_list[j]['path_server'] = filename;
          console.log('upload failed, reason=' + res.data);
        }

        that.savePhotoUrl(successList,taskId);

      },
    });

    //上传 进度方法
    upload_task.onProgressUpdate((res) => {
        upload_picture_list[j]['upload_percent'] = res.progress
        //console.log('第' + j + '个图片上传进度：' + upload_picture_list[j]['upload_percent'])
        //console.log(upload_picture_list)
      });

  },

  savePhotoUrl: function (upload_picture_list,taskId) {
    let that = this;
    util.request(api.SavePhotoUrl, { upload_picture_list: upload_picture_list }, 'POST').then(function (res) {
      console.log(res);
      if (res.errno == 0) {
        console.log('savePhotoUrl success');

        if (taskId == 0) {
          that.setData({
            iDphotoUrlId: res.data.photoUrlId
          })
        } else {
          that.setData({
            driverLiscensePhotoUrlId: res.data.photoUrlId
          })
        }

        //that.setData({
        //  photoUrlId: res.data.photoUrlId
        //});
       // that.createOrder();

      } else {
        console.log('savePhotoUrl failed');
      }
    });
  },

})