var ctx = wx.createCanvasContext('mark')
var systemInfo = wx.getSystemInfoSync()

Page({

  data: {
    // 心情系数选择
    array: [1, 2, 3, 4, 5],
    index: 0,
    // 是否显示cover-input
    show: false,
    // 存放图片路径
    file: '',
    msg: '',
    // 小程序不能识别百分数
    cWidth: systemInfo.windowWidth * 0.85,
    cHeight: systemInfo.windowHeight - 50 * 4 - 20
  },

  // 选择心情
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })

    // 绘制爱心
    ctx.setFillStyle('#ccc')
    ctx.setFontSize(30)
    for (var i = 0; i <= this.data.index; i++) {
      ctx.fillText('♥', this.data.cWidth - (i + 1) * 30 - 16, 50)
    }
    ctx.draw(true)
  },

  // 上传图片
  chooseImg: function (e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) {
            // 绘制图片
            if (res.height > that.data.cHeight - 100) {
              ctx.drawImage(res.path, 16, 60, that.data.cWidth - 32, that.data.cHeight - 120)
              ctx.draw(true)
            } else if (res.width > that.data.cWidth - 32) {
              ctx.drawImage(res.path, 16, 60, that.data.cWidth - 32, that.data.cHeight - 120)
              ctx.draw(true)
            } else {
              ctx.drawImage(res.path, Math.floor((that.data.cWidth - 16 - res.width) / 2), Math.floor((that.data.cHeight - 120 - res.height) / 2), res.width, res.height)
              ctx.draw(true)
            }

          }
        })
      }
    })
  },

  // 触发文本输入
  writeMsg: function () {
    this.setData({
      show: true
    })
  },

  // 隐藏输入
  hideInput: function () {
    this.setData({
      show: false
    })
  },

  // 文本输入完成后进行绘制
  drawMsg: function (e) {
    this.setData({
      msg: e.detail.value
    })

    // 绘制文本
    ctx.setFillStyle('#353535')
    ctx.setFontSize(15)
    ctx.fillText(this.data.msg, 50, this.data.cHeight - 24)
    ctx.draw(true)
  },

  // 生成便签
  createImg: function () {
    var that = this
    ctx.draw(true, wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.cWidth,
      height: that.data.cHeight,
      destWidth: that.data.cWidth,
      destHeight: that.data.cHeight,
      canvasId: 'mark',
      success(res) {

        // 生成文件的临时路径
        wx.previewImage({
          urls: [res.tempFilePath] // 需要预览的图片http链接列表  
        })

        // 实际默认已授权
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log('授权成功')
          }
        })

        wx.getImageInfo({
          src: res.tempFilePath,
          success: function (res) {
            console.log(res.path)
            wx.saveImageToPhotosAlbum({
              filePath: res.path,
              success(res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail(res) {
                console.log(res)
              }
            })
            console.log(res.path)
          }
        })

      }
    }))
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    var date = new Date()
    var day = date.getDate()
    var month = date.toDateString().split(" ")[1]
    var year = date.getFullYear()

    // 绘制背景
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, this.data.cWidth, this.data.cHeight);

    // 绘制边框
    ctx.setStrokeStyle('#ccc');
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(this.data.cWidth, 0)
    ctx.lineTo(this.data.cWidth, this.data.cHeight)
    ctx.lineTo(0, this.data.cHeight)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.stroke()
    ctx.setFillStyle('#353535')
    ctx.setFontSize(30)
    ctx.fillText(day, 16, 50)
    ctx.setFontSize(16)
    ctx.fillText(month + '.' + year, 56, 50)
    ctx.draw()
  }
})