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
    //wx.clearStorageSync();
    var header = getApp().globalData.header; 
    wx.request({
      url: 'https://wx.zonmoo.com/worklogs',
      header: header,
      method: "GET",
      success: function (res) {
        //console.log(res);
        that.setData({
          logs:res.data.data.logs
        });
        console.log(res.data.data.logs);
        for(var i=0;i<that.data.logs.length;i++){
          var logsOn="logs["+i+"].loadOnTime";
          var logsOff="logs["+i+"].loadOffTime";
          var logsLength="logs["+i+"].loadLength";
          that.setData({
           [logsOn]:that.data.logs[i].loadOnTime.replace('T','\n').replace('Z',''),
            [logsOff]:that.data.logs[i].loadOffTime.replace('T','\n').replace('Z',''),
          })
          //var day
          //var day1=(that.data.logs[i].loadOnTime).substring(0,10);
          //var day2=(that.data.logs[i+1].loadOnTime).substring(0,10);
          //if(day1==day2){
            //dayTime=
         // }

          //for(var year=2020;year<=parseInt(that.data.logs[i].loadOnTime.substring(0,4));year++){
            //for(var month=5;month<=5;month++){
              //for(var day=1;day<=8;day++){
                //字符串分割，得到时间
                //var key=year.toString()+"-"+month.toString()+"-"+day.toString();
                //console.log(typeof(key));
                //var masterKey=(that.data._index).toString()+"-"+key;
                //相同一天的时间相加
                // if(that.data.logs[i].loadOnTime.indexOf(key)>=0)
                //   dayTime+=parseInt(res.data.data.logs[i].loadLength);
                // var value=dayTime.toString();
                //异步缓存
                // wx.setStorage({
                //   key:masterKey,
                //   data:value
                // })
             // }
           // }
         // }
          if(that.data.logs[i].loadLength/3600>=1){
            that.setData({
              [logsLength]:(that.data.logs[i].loadLength/3600).toFixed(2)+"小时",
            })
          }
          else if(that.data.logs[i].loadLength/3600<1&&that.data.logs[i].loadLength/60>=1){
            that.setData({
              [logsLength]:(that.data.logs[i].loadLength/60).toFixed(2)+"分钟",
            })
          }
          else{
            that.setData({
              [logsLength]:(that.data.logs[i].loadLength/1).toFixed(2)+"秒",
            })
          }
        }
        console.log("logs:",that.data.logs);
      }
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
    }, 60000)    //代表60秒钟发送一次请求
    
    
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