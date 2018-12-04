import { $wuxDialog } from '../../dist/index';
Page({
  data: {
    usrid: 0,
    nickname: "",
    res: "",
    showNum: 0
  },

  getData: function () {
    var that = this
    wx.request({
      url: "https://diunar.jl-lagrange.com.cn:3001/outData",
      success: function (res) {
        //console.log(res.data)
        for (var index = 0, len = res.data.data.length, num = 0; index < len; index++) {
          if (res.data.data[index].state == 0) {
            num++
          }
        }
        that.setData({
          res: res,
          showNum: num
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  showDetail: function (event) {
    var id = event.target.dataset.id
    for (var index = 0, len = this.data.res.data.data.length; index < len; index++) {
      if (this.data.res.data.data[index].id == id) {
        break;
      }
    }
    //console.log(index)
    
    const alert = (content) => {
      this.addFinder(index, content)
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: "提交成功，感谢您的帮助！\n您可在“我的”中查看失主的信息及联系方式",
      })
      this.getData()
    }

    const input = () => {
      $wuxDialog().prompt({
        resetOnClose: true,
        title: '提供信息',
        content: '请输入您的联系方式及留言，同时我们会把失主的联系方式及留言交换给您：',
        fieldtype: 'text',
        defaultText: '',
        placeholder: '请在此输入',
        onConfirm(e, response) {
          alert(`${response}`)
        },
      })
    }

    $wuxDialog().open({
      resetOnClose: true,
      title: this.data.res.data.data[index].name + '的' + this.data.res.data.data[index].obj,
      content: this.data.res.data.data[index].detail,
      buttons: [{
        text: '联系失主',
        type: 'primary',
        onTap(e) {
          input()
        },
      },
      {
        text: '没有线索',
      },
      ],
    })
  },

  addFinder: function (index, content) {
    var update = this.data.res.data.data[index]
    update.finderUsrid = this.data.usrid
    update.finderNickname = this.data.nickname
    update.finderContact = content
    update.state = 1
    wx.request({
      url: "https://diunar.jl-lagrange.com.cn:3001/modData",
      data: update,
      fail: function (res) {
        console.log(res)
      }
    })
  },

  onLoad: function (options) {
    const app = getApp()
    var that = this
    this.setData({
      usrid: app.globalData.usrid,
      nickname: app.globalData.nickname
    })
  },

  onShow: function () {
    this.getData()
  },

  onPullDownRefresh: function () {
    this.getData()
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: "刷新成功",
        icon: "success"
      })
    }, 600)
  }
})