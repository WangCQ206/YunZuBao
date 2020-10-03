let cookie = wx.getStorageSync('cookieID');
let header = {};
if (cookie) {
  header.Cookie = cookie;
}
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _index:'',
    eqpList:[],
    logs:[],
    option:''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      option:options
    })
    console.log('this.data.option',this.data.option);
    console.log("刷新");
    var that=this;
    var index=options.index;
    that.setData({
      _index:index
    });
    console.log("点击的是第"+this.data._index+"台机器");
    console.log(index);
    var header = getApp().globalData.header; 
    wx.request({
      url: 'https://wx.zonmoo.com/oplogs',
      header: header,
      method: "GET",
      success: function (res) {
        //console.log(res);
        that.setData({
          logs:res.data.data.logs
        });
        console.log(res.data.data.logs);
        for(var i=0;i<that.data.logs.length;i++){
          //var logsOn="logs["+i+"].loadOnTime";
          //var logsOff="logs["+i+"].loadOffTime";
          var datetime="logs["+i+"].datetime";
          that.setData({
           // [logsOn]:that.data.logs[i].datatime,
            //[logsOff]:that.data.logs[i].loadOffTime.replace('T','\n').replace('Z',''),
            [datetime]:that.data.logs[i].datetime.replace('T','\t').replace('Z','')
          })
        }
        console.log("logs:",that.data.logs);
      }
    })
  },
  OffOn:function(res){
    wx.navigateTo({
      url:'/pages/openTime/openTime?index='+this.data.option.index,
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
    var that=this;
    setInterval(function () {
      that.onLoad(that.data.option);
      console.log('onShow刷新成功');
    }, 30000)    //代表30秒钟发送一次请求
  },
  onPullDownRefresh: function () {
    this.onLoad(this.data.option);
    console.log('下拉刷新成功');
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