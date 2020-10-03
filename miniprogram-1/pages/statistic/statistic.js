let cookie = wx.getStorageSync('cookieID');
let header = {};
if (cookie) {
  header.Cookie = cookie;
}
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    power:true,
    per:null,
    status:1,

    username: "",
    password: "",
    newpage:true,
    np:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var header = getApp().globalData.header; 
    wx.request({
      url:'https://wx.zonmoo.com/eqpList',
      method: 'GET',
      header:header,
      success:function(res){
        console.log(res);
        if(res.data.code!=200)
          that.setData({
            status:1
          })
          // wx.navigateTo({
          //   url: '../user/user',
          // })
        else
          that.setData({
            status:0
          })
      }
    })
  },
  showMap:function(){
    wx.navigateTo({
      url: '../map/map',
    })
  },
  
  showCharts:function(){
    wx.navigateTo({
      url: '../chart/chart',
    })
  },
  showCount:function(){
    wx.navigateTo({
      url: '../count/count',
    })
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
          that.setData({
            status:0
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
      url: "../user/register/register"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      per: app.globalData.permission
    })
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})