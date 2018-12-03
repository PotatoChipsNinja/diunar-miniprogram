import { $wuxDialog } from '../../dist/index'
Page({
  data: {
    usrid: 0,
    nickname: "",
    res: "",
    myLost: 0,
    stateLost: 0,
    myFind: 0,
    stateFind: 0,
    current: "tab1"
  },

  getData: function () {
    var that = this
    wx.request({
      url: "https://diunar.tk:3001/outData",
      success: function (res) {
        //console.log(res.data)
        var myLost = 0, myFind = 0, stateLost = 0, stateFind = 0
        for (var index = 0, len = res.data.data.length; index < len; index++) {
          if (res.data.data[index].usrid == that.data.usrid) {
            myLost++
            if (res.data.data[index].state == 1) {
              stateLost++
            }
          }
          if (res.data.data[index].finderUsrid == that.data.usrid) {
            myFind++
            if (res.data.data[index].state == 1) {
              stateFind++
            }
          }
        }
        that.setData({
          res: res,
          myLost: myLost,
          stateLost: stateLost,
          myFind: myFind,
          stateFind: stateFind
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  logout: function () {
    const fs = wx.getFileSystemManager()
    const app = getApp()
    fs.writeFileSync(`${wx.env.USER_DATA_PATH}/usrinfo`, '0\n', 'utf8')
    app.globalData.usrid = 0
    app.globalData.nickname = ""
    wx.reLaunch({
      url: "../login/login"
    })
  },

  changePsw: function () {
    var that = this
    const alert = (content) => {
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: content,
      })
    }

    const newPsw = () => {
      $wuxDialog().prompt({
        resetOnClose: true,
        title: '修改密码',
        fieldtype: 'text',
        password: !0,
        defaultText: '',
        placeholder: '请输入新密码',
        onConfirm(e, response) {
          wx.request({
            url: "https://diunar.tk:3001/modPsw",
            data: {
              usrid: that.data.usrid,
              passwd: response
            },
            success: function (res) {
              alert("密码修改成功")
            },
            fail: function (res) {
              console.log(res)
            }
          })
        },
      })
    }

    $wuxDialog().prompt({
      resetOnClose: true,
      title: '修改密码',
      fieldtype: 'text',
      password: !0,
      defaultText: '',
      placeholder: '请输入原密码',
      onConfirm(e, response) {
        wx.request({
          url: "https://diunar.tk:3001/login",
          data: {
            usrid: that.data.usrid,
            passwd: response
          },
          success: function (res) {
            //console.log(res.data)
            if (res.data == "Incorrect Password") {
              alert("原密码输入错误")
            } else {
              newPsw()
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
    })
  },

  showFinder: function (event) {
    var id = event.target.dataset.id
    for (var index = 0, len = this.data.res.data.data.length; index < len; index++) {
      if (this.data.res.data.data[index].id == id) {
        break;
      }
    }
    const notMine = () => {
      this.delFinder(index)
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: "很遗憾这次没能找回失物，您的失物招领状态已回到“暂无发现者”，并且在“发现”中重新可见",
      })
      this.getData()
    }

    const isMine = () => {
      this.hasFound(index)
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: "恭喜您成功找回失物，希望您能够积极推广“丢哪儿”，让更多失主获得帮助",
      })
      this.getData()
    }
    
    $wuxDialog().open({
      resetOnClose: true,
      title: "得主信息",
      content: "得主昵称：" + this.data.res.data.data[index].finderNickname + "\n得主联系方式及留言：" + this.data.res.data.data[index].finderContact + "\n请及时与得主取得联系并确认是否为失物",
      buttons: [{
        text: '这是我的',
        type: 'primary',
        onTap(e) {
          isMine()
        }
      },
      {
        text: '不是我的',
        type: 'primary',
        onTap(e) {
          notMine()
        }
      },
      {
        text: '返回'
      }
      ],
    })
  },

  delFinder: function (index) {
    var update = this.data.res.data.data[index]
    update.finderUsrid = 0
    update.finderNickname = ""
    update.finderContact = ""
    update.state = 0
    wx.request({
      url: "https://diunar.tk:3001/modData",
      data: update,
      fail: function (res) {
        console.log(res)
      }
    })
  },

  hasFound: function (index) {
    var update = this.data.res.data.data[index]
    update.state = 2
    wx.request({
      url: "https://diunar.tk:3001/modData",
      data: update,
      fail: function (res) {
        console.log(res)
      }
    })
  },

  showContact: function (event) {
    var id = event.target.dataset.id
    for (var index = 0, len = this.data.res.data.data.length; index < len; index++) {
      if (this.data.res.data.data[index].id == id) {
        break;
      }
    }

    $wuxDialog().alert({
      resetOnClose: true,
      title: "失主信息",
      content: "失主真实姓名：" + this.data.res.data.data[index].realname + "\n失主联系方式及留言：" + this.data.res.data.data[index].contact + "\n请与失主取得联系并等待失主确认"
    })
  },

  onChange(e) {
    //console.log('onChange', e)
    this.setData({
      current: e.detail.key,
    })
  },

  ifDel: function (event) {
    const sureDel = () => {
      this.del(event.target.dataset.id)
      $wuxDialog('#wux-dialog--alert').alert({
        resetOnClose: true,
        title: '提示',
        content: "删除成功！",
      })
      this.getData()
    }

    $wuxDialog().open({
      resetOnClose: true,
      title: '删除确认',
      content: '确定要删除该条寻物启事吗？',
      buttons: [{
        text: '取消',
      },
      {
        text: '确定',
        type: 'primary',
        onTap(e) {
          sureDel()
        },
      },
      ],
    })
  },

  del: function (id) {
    wx.request({
      url: "https://diunar.tk:3001/delData",
      data: {
        id: id
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  onLoad: function (options) {
    const app = getApp()
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