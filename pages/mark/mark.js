var ctx = wx.createCanvasContext('mark')

Page({

  data: {
    // 心情系数选择
    array: [1, 2, 3, 4, 5],
    index: 0,
    // 是否显示cover-input
    show: false,
    // 存放图片路径
    files: [],
    // input 框的focus状态
    inputFocus: false,
    // 初始值充当placeholder作用
    inputInfo: '记录专属你的小时光……',
  },

  // 选择心情
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })

    // 绘制爱心
    ctx.setFillStyle('#ccc')
    ctx.setFontSize(30)
    for (var i = 0; i <= this.data.index; i++) {
      ctx.fillText('♥', 300 - i * 20, 50)
    }
    ctx.draw()
  },

  // 上传图片
  chooseImg: function(e) {

    var that = this;
    wx.chooseImage({
      success: function(res) {
        // 返回选定照片的本地文件路径列表
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
    
  },

  // 显示输入
  writeMsg: function() {
    this.setData({
      show: true
    })
  },

  writeInput: function() {
    this.setData({
      //在真机上将焦点给input
      inputFocus: true,
      inputInfo: ''
    })
  },

  // 传值
  passValue: function(e) {
    this.setData({
      inputInfo: e.detail.value || '记录专属你的小时光……'
    })
  },

  // 隐藏输入
  hideInput: function() {
    this.setData({
      show: false
    })
  },

  // 生成图片
  createImg: function() {

    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 340,
      height: 440,
      destWidth: 340,
      destHeight: 440,
      canvasId: 'mark',
      success(res) {

        // 生成文件的临时路径
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum(res.tempFilePath, {
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })

      }
    })

  },
  canvasIdErrorCallback: function(e) {
    console.error('Error: ' + e.detail.errMsg)
  },


  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {

    var date = new Date()
    var day = date.getDate()
    var month = date.toDateString().split(" ")[1]
    var year = date.getFullYear()

    // 绘制边框
    ctx.setStrokeStyle('#ccc');
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(340, 0)
    ctx.lineTo(340, 440)
    ctx.lineTo(0, 440)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.stroke()
    ctx.setFillStyle('#353535')
    ctx.setFontSize(30)
    ctx.fillText(day, 30, 50)
    ctx.setFontSize(16)
    ctx.fillText(month + '.' + year, 70, 50)
    ctx.draw()

  }
})