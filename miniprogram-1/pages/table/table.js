let cookie = wx.getStorageSync('cookieID');
let header = {};
if (cookie) {
  header.Cookie = cookie;
}
var app = getApp()
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var demo = new QQMapWX({
    key: 'NPABZ-LOP6K-JSQJV-AE5T2-22LY5-CEB5U' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eqpList:[],
    per:null,
    power:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      per: app.globalData.permission
    })
    var that = this;
    var header = getApp().globalData.header; 
    wx.request({
      url: 'https://wx.zonmoo.com/eqpList',
      header: header,
      method: "GET",
      success: function (res) {
        console.log(res);
        console.log(res.data.code);
        console.log(res.header);
        if (res.data.code == 200){
          that.setData({
            per: app.globalData.permission,
            eqpList: res.data.data.eqpList
            });
            // eqpList= res.data.data.eqpList,
            for (var i = 0; i < res.data.data.eqpList.length; i++) {
              demo.reverseGeocoder({
                location: {
                  latitude:that.data.eqpList[i].latitude,
                  longitude:that.data.eqpList[i].longitude
                },
                success: function (res) {
                  console.log(res.result);
                },
                fail: function (res) {
                  console.log(res);
                },
                // complete: function (res) {
                //   console.log(res);
                // }
              })
            }
        }
        
        else 
          wx.showModal({
          title: '提示',
          content: '请登录',
          showCancel: false,
          confirmText: '去登陆',
          confirmColor: '#0f0',
          success: function (res) {
            wx.switchTab({
              url: '../user/user',
            })
          },
        })
     } });
      // var interval = setInterval(function () {
      //   console.log("刷新")
      // }, 30000)
  },
  toDetail:(e)=>{
    let index=e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    wx.navigateTo({
      url:'/pages/detail/detail?index='+index,
    })
  },
  controlonoff:function(e){
    console.log("点击时的e",e);
    console.log(e.currentTarget);
    console.log(e.currentTarget.id);
    var tapid = e.currentTarget.id;
    console.log(tapid);
    this.changeTap(tapid);
  },

  changeTap: function (newId) {
    var that=this;
    var newId=Number(newId);
    //var masterId=Number(newId);
    // var newId=that.newId;
    console.log("点击时",newId);
    //console.log("masterId:",masterId);
    var header = getApp().globalData.header;
    console.log("全局变量的header", header);
    //let str = { "Content-Type": "application/x-www-form-urlencoded" };application/json

    header['content-type'] ="application/x-www-form-urlencoded";
    console.log("添加之后的header:",header);
    var eqpList = that.data.eqpList;
    console.log("that.data.eqpList:",eqpList);
    console.log(eqpList[newId].status);
    
    wx.showModal({
      title: "通知",
      showCancel: true,
      content: "是否要执行开关操作",
      confirmText: "确定",
      cancelText: "取消",
      cancelColor: "#000",
      confirmColor: "#0f0",
      success: function (res) {
        console.log("点击确定后的：",res) 
        if(res.cancel){
          eqpList[newId].status = eqpList[newId].status;
          console.log(eqpList[newId].status)
        }
        else
          {
          if (eqpList[newId].status) {
            eqpList[newId].status = false;
            console.log(eqpList[newId]);
            console.log(eqpList[newId].status);
            }
          else {
            eqpList[newId].status = true;
            console.log(eqpList[newId]);
            console.log(eqpList[newId].status);
            }
        }
        newId=newId+1;
          wx.request({
            url: 'http://47.110.253.98:8000/turnOnOrOff',
            data:{
              "masterId":'0'+(newId-1),
              "switch": eqpList[newId-1].status
            },
            header: header,
            method: 'POST',
            dataType: 'json',
            success: function (res) {
              console.log("上传成功之后的开关",eqpList[newId-1].status);
              console.log("上传成功之后的设备编号", '0'+(newId-1));
              console.log(typeof(('0' +newId).toString()));
              console.log(typeof(parseInt('0' +newId)));
              console.log(res);
              console.log("最后的header",header);
              //that.data.eqpList[newId].status=eqpList[newId].status;
              that.onLoad();

            },
            fail: function (err) {console.log("失败后的",err) },
            complete: function (res) { },
          })
          
      },
      fail: function (res) { console.log(res) },
      complete: function (res) { },
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
    console.log('1231231',this.data.eqpList)
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