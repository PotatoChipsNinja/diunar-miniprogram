import { $wuxCalendar } from '../../dist/index';
Page({
  data: {
    value: "",
    date: [],
    obj: "",
    detail: "",
    realname: "",
    contact: ""
  },

  finish(e) {
    //console.log(e)
    switch (e.currentTarget.id) {
      case "obj":
        this.data.obj = e.detail.value
        break
      case "detail":
        this.data.detail = e.detail.value
        break
      case "realname":
        this.data.realname = e.detail.value
        break
      case "contact":
        this.data.contact = e.detail.value
        break
    }
  },

  submit() {
    const app = getApp()
    var that = this
    if (this.data.obj == "") {
      wx.showToast({
        title: "物品名称不能为空",
        icon: "none"
      })
    } else if (this.data.detail == "") {
      wx.showToast({
        title: "物品详情不能为空",
        icon: "none"
      })
    } else if (this.data.date.length == 0) {
      wx.showToast({
        title: "丢失日期不能为空",
        icon: "none"
      })
    } else {
      wx.request({
        url: "https://diunar.jl-lagrange.com.cn:3001/addData",
        data: {
          name: app.globalData.nickname,
          usrid: app.globalData.usrid,
          obj: this.data.obj,
          detail: this.data.detail,
          date: this.data.date[0],
          realname: this.data.realname,
          contact: this.data.contact,
          state: 0,
          finderUsrid: 0,
          finderNickname: "",
          finderContact: ""
        },
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: "发布成功",
            icon: "success"
          })
          
          that.setData({
            value: " ",
            date: [],
            contact: " "
          })
          that.setData({
            value: "",
            contact: ""
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  openCalendar() {
    var tempContact = this.data.contact
    this.setData({
      contact: " "
    })
    $wuxCalendar().open({
      value: this.data.date,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
          date: displayValues
        })
      },
      onClose: () => {
        this.setData({
          contact: tempContact
        })
      }
    })
  }
})