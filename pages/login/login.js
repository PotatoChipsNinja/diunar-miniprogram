Page({
  data: {
    usrid: 0,
    passwd: ""
  },

  finish(e) {
    switch (e.currentTarget.id) {
      case "usrid":
        this.data.usrid = e.detail.value
        break
      case "passwd":
        this.data.passwd = e.detail.value
        break
    }
  },

  submit() {
    const app = getApp()
    const fs = wx.getFileSystemManager()
    var that = this
    if (this.data.usrid == 0) {
      wx.showToast({
        title: "请输入正确的学号",
        icon: "none"
      })
    } else if (this.data.passwd == "") {
      wx.showToast({
        title: "密码不能为空",
        icon: "none"
      })
    } else {
      wx.request({
        url: "https://diunar.tk:3001/login",
        data: {
          usrid: this.data.usrid,
          passwd: this.data.passwd
        },
        success: function (res) {
          console.log(res.data)
          if (res.data == "Incorrect Password") {
            wx.showToast({
              title: "用户名或密码错误",
              icon: "none"
            })
          } else {
            wx.showToast({
              title: "登录成功",
              icon: "success"
            })
            fs.writeFileSync(`${wx.env.USER_DATA_PATH}/usrinfo`, that.data.usrid + '\n' + res.data, 'utf8')
            app.globalData.usrid = that.data.usrid
            app.globalData.nickname = res.data
            wx.switchTab({
              url: '/pages/discover/discover'
            })
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  reg: function () {
    wx.redirectTo({
      url: "../reg/reg"
    })
  },

  onLoad: function (options) {
    const app = getApp()
    if (app.globalData.usrid != 0) {
      wx.switchTab({
        url: '/pages/discover/discover'
      })
    }
  }
})