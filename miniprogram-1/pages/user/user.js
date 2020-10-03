var app=getApp()
Page({
  data: {
    username: "",
    password: "",
    newpage:true,
    np:true,
    per:''
  },
  onLoad: function () {
    this.setData({
      np: app.globalData.newpage,
      per: app.globalData.permission
    })
  },
  // backlogin:function(){
  //   this.setData({
  //     np:true
  //   })
  //   getApp().globalData.header.Cookie=0;
  //   wx.showToast({
  //     title: '退出成功',
  //   })
  // },
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
  //点击登陆的时候触发的事件
  signin: function () {
    var that = this;
    //登陆的时候要传过来的参数
    var name = that.data.username
    var pwd = that.data.password
    console.log(that.data.username);
    if (that.data.username == "") {
      wx.showModal({
        title: "信息提示",
        content: "用户名不能为空!",
        showCancel:false
      })
    } else if (that.data.password == "") {
      wx.showModal({
        title: "信息提示",
        content: "请输入密码!",
        showCancel: false
      })
    }
    console.log("用户名：" + name + "密码：" + pwd)
    
    wx.request({
      url: 'https://wx.zonmoo.com/login',
      //url:'http://47.110.253.98:8000/login',
      data:JSON.stringify(
        { userName:name, password: pwd }
      ),
      header: {
        'Content-Type': 'application/json' 
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        var per=that.data.per;
        var status = JSON.stringify(res.data.code)
        var msg = JSON.stringify(res.data.msg)
        //弹出提示
        if (status == 200) {
          getApp().globalData.header.Cookie = res.header["Set-Cookie"];
          console.log(res.header["Set-Cookie"]);
          console.log(app.globalData.permission);
          console.log(res.data);
          wx.showToast({
            title: msg
          })

          getApp().globalData.permission = res.data.data.auth;
          per= getApp().globalData.permission;
          console.log(res.data.data.auth);
          console.log(!res.data.data.auth);
          console.log(app.globalData.permission);
          console.log(per);
          app.globalData.newpage=false;
          //that.onLoad();
          wx.switchTab({
            url: '../users/users',
          })
        }
        else{
          wx.showModal({
            title: '登陆失败',
            content: '请重新检查用户名和密码',
            showCancel:false,
          })
        }
      },
      fail: function (res) {
        wx.showToast({

          title: '服务器网络错误,请稍后重试',

          icon: 'loading',

          duration: 1500

        })
      },
      complete: function (res) {

      },
    })
  },
  //点击注册的时候触发的事件
  register: function () {
    wx.navigateTo({
      url: "register/register"
    })
  },
  
  onShow:function(){
  //   this.setData({
  //   np: app.globalData.newpage,
  //   per: app.globalData.permission
  // })
  }
})
