var bmap = require('../../utils/wxapp-jsapi-master/src/bmap-wx.js');
var wxMarkerData = [];
var app = getApp();

Page({
    data: {
        markers: [],
        latitude: '',
        longitude: '',
        placeData: {}

    },
    makertap: function(e) {
        var that = this;
        var id = e.markerId;
        that.showSearchInfo(wxMarkerData, id);
        that.changeMarkerColor(wxMarkerData, id);
    },
    onLoad: function() {
        var that = this;
        var BMap = new bmap.BMapWX({
          ak: 'xZ9m6MbAToONKqYp5y7YYth77qRytQOo'
        });
        var fail = function(data) {
            console.log(data)
        };
        var success = function(data) {
            wxMarkerData = data.wxMarkerData;
            that.setData({
                markers: wxMarkerData
            });
            that.setData({
                latitude: wxMarkerData[0].latitude
            });
            that.setData({
                longitude: wxMarkerData[0].longitude
            });
        }
        BMap.search({
            //"query": '美食',
            fail: fail,
            success: success,
            iconPath: '../../img/marker_red.png',
            iconTapPath: '../../img/marker_red.png'
        });
    },
    showSearchInfo: function(data, i) {
        var that = this;
        that.setData({
            placeData: {
                title:  data[i].title + '\n',
                address: data[i].address + '\n',
                telephone: + data[i].telephone
            }
        });
      app.contractorAddressTxt= that.address + that.title;
    },
    changeMarkerColor: function(data, id) {
        var that = this;
        var markersTemp = [];
        for (var i = 0; i < data.length; i++) {
            if (i === id) {
                data[i].iconPath = "../../img/marker_yellow.png";
            } else {
                data[i].iconPath = "../../img/marker_red.png";
            }
            markersTemp[i] = data[i];
        }
        that.setData({
            markers: markersTemp
        });
    },
  selectLocation (event) {
    console.log('用户手动选择地址')
    console.log(event)
    wx.navigateBack({

    })
    wx.showToast({
      title: '地图已定位',
      icon: 'success',
      duration: 1000
    });
  }

})