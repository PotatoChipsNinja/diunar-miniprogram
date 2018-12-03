Page({
  data: {
    usrid: 0,
    passwd: "",
    nickname: ""
  },

  finish(e) {
    switch (e.currentTarget.id) {
      case "usrid":
        this.data.usrid = e.detail.value
        break
      case "passwd":
        this.data.passwd = e.detail.value
        break
      case "nickname":
        this.data.nickname = e.detail.value
        break
    }
  },

  submit() {
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
    } else if (this.data.nickname == "") {
      wx.showToast({
        title: "昵称不能为空",
        icon: "none"
      })
    } else {
      wx.request({
        url: "https://diunar.jl-lagrange.com.cn:3001/reg",
        data: {
          usrid: this.data.usrid,
          passwd: this.data.passwd,
          nickname: this.data.nickname
        },
        success: function (res) {
          //console.log(res.data)
          wx.showToast({
            title: "注册成功",
            icon: "success"
          })
          wx.redirectTo({
            url: "../login/login"
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  back: function () {
    wx.redirectTo({
      url: "../login/login"
    })
  }
})