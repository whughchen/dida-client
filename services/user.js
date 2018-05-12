/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin() {

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      if(res.code){
        wx.setStorageSync('sessionCode', res.code);
      }
      code = res.code;
      /*
      return util.getUserInfo();*/
    }).then((userInfo) => {
      //登录远程服务器
      util.request(api.GetSessionData, { code: code, location: wx.getStorageSync('location')}, 'POST').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('sessionData', res.data.sessionData);
          wx.setStorageSync('userInfo', res.data.userInfo);

          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      //reject(false);
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            console.log(res.code)
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











