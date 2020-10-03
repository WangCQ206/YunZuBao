var app=getApp()
Page({
  data: {
    username: "",
    password: "",
    newpage:true,
    np:true,
    per:'',
    menuitems: [
      { text: '用户权限', url: '#', icon: '/images/user/user1.png', tips: '', arrows: '/images/user/arrows.png' },
      { text: '个人信息', url: '#', icon: '/images/user/user2.png', tips: '', arrows: '/images/user/arrows.png' },
      { text: '修改密码', url: '#', icon: '/images/user/user3.png', tips: '', arrows: '/images/user/arrows.png' }
    ]
  },
  onLoad: function () { 
    this.setData({
      np: app.globalData.newpage,
      per: app.globalData.permission
    })
  },
  toLogin:function(){
    wx.navigateTo({
      url: '../user/user',
    })
  },
  backlogin:function(){
    this.setData({
      np:true
    })
    app.globalData.newpage=true;
    app.globalData.permission=false;
    getApp().globalData.header.Cookie=null;
    wx.showToast({
      title: '退出成功',
    });
    wx.navigateTo({
      url: "../user/user"
    })
    //this.onLoad();
  },
  onShow:function(){
  //   this.setData({
  //   np: app.globalData.newpage,
  //   per: app.globalData.permission
  // })
      this.onLoad();
      console.log('cookie:',getApp().globalData.header.Cookie);
  }
})
