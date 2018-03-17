function imageUtil(e) {
  var imageSize = {};
  // 图片原始宽
  var originalWidth = e.detail.width;
  // 图片原始高
  var originalHeight = e.detail.height;
  // 获取屏幕宽高
  var originalScale = originalHeight/originalWidth;

  console.info('originalWidth: ' + originalWidth)
  console.info('originalHeight: ' + originalHeight)
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight/windowWidth;//屏幕高宽比
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if(originalScale < windowscale){//图片高宽比小于屏幕高宽比
        //图片缩放后的宽为屏幕宽
        imageSize.imageWidth = windowWidth/2*0.9;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth / 2 * 0.9;
      }else{//图片高宽比大于屏幕高宽比
        //图片缩放后的高为屏幕高
        imageSize.imageHeight = windowHeight / 2 * 0.9;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight / 2 * 0.9;
      }

    }
  })
  console.info('缩放后的宽: ' + imageSize.imageWidth)
  console.info('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}

module.exports = {
  imageUtil: imageUtil
}