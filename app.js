App({
  globalData: {
    usrid: 0,
    nickname: ""
  },
  onLaunch: function () {
    const fs = wx.getFileSystemManager()
    var that = this
    wx.getFileInfo({
      filePath: `${wx.env.USER_DATA_PATH}/usrinfo`,
      success: function (res) {
        console.log("'usrinfo' existed")
        var content = fs.readFileSync(`${wx.env.USER_DATA_PATH}/usrinfo`, 'utf8')
        var index = content.indexOf('\n')
        that.globalData.usrid = parseInt(content.slice(0, index))
        that.globalData.nickname = content.slice(index + 1)
        if (that.globalData.usrid != 0) {
          wx.switchTab({
            url: '/pages/discover/discover'
          })
        }
      },
      fail: function () {
        console.log("'usrinfo' created")
        fs.writeFileSync(`${wx.env.USER_DATA_PATH}/usrinfo`, '0\n', 'utf8')
        that.globalData.usrid = 0
        that.globalData.nickname = ""
      }
    })
  }
})