const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user = require('../../../services/user.js');
const imageutil =require('../../../services/imageutil.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    upload_picture_list: []
  },


  //选择图片方法
  uploadpic: function (e) {
    var that = this//获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 8, // 默认9，这里显示一次选择相册的图片数量
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
        })
      }
    })
  },
//点击上传事件
  uploadimage: function () {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        upload_file_server(page, upload_picture_list, j)
      }
    }
  },
  //上传方法
  upload_file_server:function(that, upload_picture_list, j)
  {
    var time = new Date()
    var datetime = tt.formatTime(time)//获取时间 防止命名重复
    var date = datetime.substring(0, 8)//获取日期 分日期 文件夹存储
    console.log("开始上传" + j + "图片到服务器：")
    //上传返回值
    var upload_task = wx.uploadFile({
      url: 'http//Index/Imageadmin/imageupload',//需要用HTTPS，同时在微信公众平台后台添加服务器地址
      filePath: upload_picture_list[j]['path'], //上传的文件本地地址
      name: 'file',
      formData: {
        'num': j,
        'datetime': datetime,
        'date': date
      },
      //附近数据，这里为路径
      success: function (res) {
        console.log(res.data)
        var data = JSON.parse(res.data)
        //字符串转化为JSON
        if (data.Success == true) {
          console.log('OK')
          //var filename = "https://127.0.0.1:8095/" + data.file//存储地址 显示
          var filename = data.file//存储地址 显示
          upload_picture_list[j]['path_server'] = filename
        } else {
          var filename = "https://127.0.0.1:8095/xx.png"//错误图片 显示
          upload_picture_list[j]['path_server'] = filename
        }
        that.setData({
          upload_picture_list: upload_picture_list
        })
      }
    })
    //上传 进度方法
    upload_task.onProgressUpdate((res) => {
      upload_picture_list[j]['upload_percent'] = res.progress
      //console.log('第' + j + '个图片上传进度：' + upload_picture_list[j]['upload_percent'])
      //console.log(upload_picture_list)
      that.setData({upload_picture_list: upload_picture_list})
    })
  },



  onShareAppMessage: function () {
    return {
      title: 'DidaLogistic',
      desc: '滴答货运',
      path: '/pages/contractor/index/index'
    }
  },


  onLoad: function (options) {
    //this.getIndexData();
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


}

)
