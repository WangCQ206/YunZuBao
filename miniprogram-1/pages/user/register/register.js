var app=getApp()
Page({
  data: {
    username: "",
    password: "",
    passwordconfirm: "",
    ifRegist:false
  },
  usernameinput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordinput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  passwordconfirminput: function (e) {
    this.setData({
      passwordconfirm: e.detail.value
    })
  },
  signin: function () {
    var that = this;
    //请求的时候需要提交的参数
    var name = that.data.username
    var pwd = that.data.password
    // console.log("js中收到的用户名："+name+"，密码："+pwd)
    if (that.data.username == "") {
      wx.showModal({
        title: "信息提示",
        content: "用户名不能为空!",
        showCancel: false
      })
    } else if (that.data.password == "") {
      wx.showModal({
        title: "信息提示",
        content: "请输入密码!",
        showCancel: false
      })
    } else if (that.data.passwordconfirm == "") {
      wx.showModal({
        title: "信息提示",
        content: "请确认密码!",
        showCancel: false
      })
    } else if (that.data.passwordconfirm != that.data.password) {
      wx.showModal({
        title: "信息提示",
        content: "两次密码输入不一致!",
        showCancel: false
      })
    }
    if (that.data.passwordconfirm == that.data.password && that.data.passwordconfirm != "" && that.data.password != "" && that.data.username != ""){
      that.setData({
        ifRegist:true
      })
    }
if(this.data.ifRegist){
    wx.request({
      url: 'https://wx.zonmoo.com/regist',
      data: JSON.stringify(
        { userName: name, password: pwd }
      ),
      header: {
        'content-type': 'application/json' 
      },
      method: "POST",
      dataType: "json",
      success: function (res) {
        console.log(res);
        console.log("成功")
        console.log("响应的数据" + name)
        if (res.userName == name) {
        wx.showModal({
        title: "信息提示",
        content: "该用户名已被注册",
        showcancel:false
        })
        } else {
          getApp().globalData.header.Cookie = res.header["Set-Cookie"];
          getApp().globalData.permission = res.data.data.auth;
          console.log(app.globalData.permission);
          console.log(res);
          getApp().globalData.permission = !res.data.data.auth;
          console.log(app.globalData.permission);
          app.globalData.newpage=false
          wx.showModal({
            title: "信息提示",
            content: "注册成功",
            showCancel:false
          })
          wx.switchTab({
          url: "../../users/users"
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '服务器网络错误,请稍后重试',

          icon: 'loading',
          duration: 1500,
        })
      },
      complete: function (res) {

      }
    })
  }
  },
  
})