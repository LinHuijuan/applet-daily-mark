//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    start: '开始制作'
  },
  // 点击开始制作
  start: function() {
    wx.redirectTo({
      url: '../mark/mark'
    })
  }
})
