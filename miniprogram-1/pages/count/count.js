var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
//获取年份  
var Y =date.getFullYear();
//获取月份  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
console.log("当前时间：" + Y + '年'  + M+ '月' + D+ '日' );
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
    select: false,
    index:0,
    locationInfo:[],
    pleaseSelect: '请选择速度',
    speeds: [{
      id: 0,
      name: "DPH 5.0-1"
    },
    {
      id: 1,
      name: "DPH 5.0-2"
    },
    {
      id: 2,
      name: "DPH 7.5"
    },
    {
      id: 3,
      name: "DPH 10"
    },{
      id: 4,
      name: "DPH 20"
    },
    ],
    speed:'',
    height:'',
    total:'',
    startDate: "2020-06-30",
    endDate: "2020-06-30",
    logs:[],
    result:0,
    startTime: '11:00',
    endTime: '12:00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   endTime:Y+'-'+M+'-'+D
    // })
    var that=this;
    var header = getApp().globalData.header; 
    wx.request({
      url:'https://wx.zonmoo.com/worklogs',
      method: 'GET',
      header:header,
      success: (res) => {
        console.log(res);
        that.setData({
          logs:res.data.data.logs
        });
      console.log(this.data.logs);
    }
    })
  },
  listenerDatePickerSelectedStart:function(e) {
    this.setData({
      startDate: e.detail.value
    })
    console.log('e:',e);
    console.log(this.data.startDate);
  },
  listenerDatePickerSelectedEnd:function(e) {
    this.setData({
      endDate: e.detail.value
    })
    console.log('e:',e);
    console.log(this.data.endDate);
  },
  listenerTimePickerSelectedStart: function(e) {
    this.setData({
        startTime: e.detail.value,
    });
    console.log('开始时间',this.data.startTime);
},
  listenerTimePickerSelectedEnd: function(e) {
    this.setData({
        endTime: e.detail.value,
    });
    console.log('结束时间',this.data.endTime);
  },

  showResult:function(){
    var totalTime=0;
    //var that=this;
    var _result=0;
    //要查询的开始日期
    var selectStartTime=this.data.startDate;
    //要查询的结束日期
    var selectEndTime=this.data.endDate;
    var restTime=0;
    //this.data.startTime
    var numStartTime=parseInt(this.data.startTime.substring(0,2)+this.data.startTime.substring(3,5));
    //this.data.endTime
    var numEndTime=parseInt(this.data.endTime.substring(0,2)+this.data.endTime.substring(3,5));

      /*
        首先判断要查询的是否是一个月内的记录
        1.如果是一个月的话，匹配开始的日期，
        然后for(起日期+1;起日期<止日期;起日期++) 
          起日期的time-24:00+间隔的日期+00:00-止日期的time
        2.如果不是一个月的话，全都当成31天来算，
        for(起月份+1;起月份<止月份;止月份++){for(日期=1;日期<=31;日期++)} 
        for(起data+1;起data<=31;起data++) 
        for(止data-1;止data>=1;止data--)
          起月份的date-月末+间隔的月份+1号-止时间的date
        3.起止时间当天的时间按照下面的来计算
      */ 
      //起止时间为同一个月
      if(this.data.startDate.substring(5,7)==this.data.endDate.substring(5,7)){
        var totalTime=0;
        var selectTimeSameMonth='';
        //间隔的天
        for(var day=parseInt(this.data.startDate.substring(8,10))+1;day<parseInt(this.data.endDate.substring(8,10));day++){
          if(day<10)
            selectTimeSameMonth=this.data.startDate.substring(0,8)+'0'+day.toString();
          else
            selectTimeSameMonth=this.data.startDate.substring(0,8)+day.toString();
          for(var j=this.data.logs.length-1;j>=0;j--){
            if(this.data.logs[j].loadOnTime.indexOf(selectTimeSameMonth)>=0){
                totalTime+=parseInt(this.data.logs[j].loadLength);
              }
          }
        }
        console.log('间隔的天',totalTime);

        //符合开始时间当天的时间
        for(var i=this.data.logs.length-1;i>=0;i--){
          //log里的开始时间
          var numLogStartTime=parseInt(this.data.logs[i].loadOnTime.substring(11,13)+this.data.logs[i].loadOnTime.substring(14,16));
          //log里的结束时间
          var numLogEndTime=parseInt(this.data.logs[i].loadOffTime.substring(11,13)+this.data.logs[i].loadOffTime.substring(14,16));
          if(this.data.logs[i].loadOnTime.indexOf(selectStartTime)>=0 && numLogStartTime<2400 && numLogStartTime>=numStartTime){
            totalTime+=parseInt(this.data.logs[i].loadLength);
          }
        }
        console.log('符合开始时间当天的时间',totalTime);

        //符合结束时间当天的时间
        for(var i=this.data.logs.length-1;i>=0;i--){
          //log里的开始时间
          var numLogStartTime=parseInt(this.data.logs[i].loadOnTime.substring(11,13)+this.data.logs[i].loadOnTime.substring(14,16));
          //log里的结束时间
          var numLogEndTime=parseInt(this.data.logs[i].loadOffTime.substring(11,13)+this.data.logs[i].loadOffTime.substring(14,16));
          if(this.data.logs[i].loadOnTime.indexOf(selectEndTime)>=0){
            console.log('selectEndTime:',selectEndTime);
            totalTime+=parseInt(this.data.logs[i].loadLength);
            // numLogEndTime>=0 && &&  numLogStartTime<numEndTime
            restTime=i;
          }
        }
        console.log('符合结束时间当天的时间',totalTime);
        //减掉超出的时间
        if(parseInt(this.data.logs[restTime].loadOffTime.substring(11,13)+this.data.logs[restTime].loadOffTime.substring(14,16))>numEndTime){
          var ifPlusMinus=parseInt(this.data.logs[restTime].loadOffTime.substring(11,13)+this.data.logs[restTime].loadOffTime.substring(14,16))-numEndTime;
          if(ifPlusMinus<0)
            totalTime+=(ifPlusMinus*60);
          else
            totalTime-=(ifPlusMinus*60);
        }
        console.log('totalTime:',totalTime);
      }

      //起止时间是跨月的
      else{
        var totalTime=0;
        //计算间隔的月份的时间
        for(var month=parseInt(this.data.startDate.substring(5,7))+1;month<parseInt(this.data.endDate.substring(5,7));month++){
          if(month<10)
            var selectMonth=this.data.startDate.substring(0,5)+'0'+day.toString();
          else
            var selectMonth=this.data.startDate.substring(0,5)+day.toString();
          //var selectMonth=this.data.startDate.substring(0,5)+month.toString();
          for(var j=this.data.logs.length-1;j>=0;j--){
            if(this.data.logs[j].loadOnTime.indexOf(selectMonth)>=0){
                totalTime+=parseInt(this.data.logs[j].loadLength);
              }
          }
        }
        console.log('间隔月份的：',totalTime);
        //开始时间到月末
        for(var day=parseInt(this.data.startDate.substring(8,10))+1;day<=31;day++){
          if(day<10)
            var selectTimeNoSameMonth=this.data.startDate.substring(0,8)+'0'+day.toString();
          else
            var selectTimeNoSameMonth=this.data.startDate.substring(0,8)+day.toString();
          for(var j=this.data.logs.length-1;j>=0;j--){
            if(this.data.logs[j].loadOnTime.indexOf(selectTimeNoSameMonth)>=0){
                totalTime+=parseInt(this.data.logs[j].loadLength);
              }
          }  
        }
        console.log('开始时间到月末的：',totalTime);
        //月初到结束时间
        for(var day=parseInt(this.data.endDate.substring(8,10))-1;day>0;day--){
          if(day<10)
            var selectTimeNoSameMonth=this.data.startDate.substring(0,8)+'0'+day.toString();
          else
            var selectTimeNoSameMonth=this.data.startDate.substring(0,8)+day.toString();
          //var selectTimeNoSameMonth=this.data.startDate.substring(0,8)+day.toString();
          for(var j=this.data.logs.length-1;j>=0;j--){
            if(this.data.logs[j].loadOnTime.indexOf(selectTimeNoSameMonth)>=0){
                totalTime+=parseInt(this.data.logs[j].loadLength);
                //console.log(totalTime);
              }
          }  
        }
        console.log('月初到结束时间的：',totalTime);
        //符合开始时间当天的时间
        for(var i=this.data.logs.length-1;i>=0;i--){
          //log里的开始时间
          var numLogStartTime=parseInt(this.data.logs[i].loadOnTime.substring(11,13)+this.data.logs[i].loadOnTime.substring(14,16));
          //log里的结束时间
          var numLogEndTime=parseInt(this.data.logs[i].loadOffTime.substring(11,13)+this.data.logs[i].loadOffTime.substring(14,16));
          if(this.data.logs[i].loadOnTime.indexOf(selectStartTime)>=0 && numLogStartTime<2400 && numLogStartTime>=numStartTime){
            totalTime+=parseInt(this.data.logs[i].loadLength);
          }
        }
        console.log('符合开始时间当天的时间：',totalTime);
        //符合结束时间当天的时间
        for(var i=this.data.logs.length-1;i>=0;i--){
          //log里的开始时间
          var numLogStartTime=parseInt(this.data.logs[i].loadOnTime.substring(11,13)+this.data.logs[i].loadOnTime.substring(14,16));
          //log里的结束时间
          var numLogEndTime=parseInt(this.data.logs[i].loadOffTime.substring(11,13)+this.data.logs[i].loadOffTime.substring(14,16));
          if(this.data.logs[i].loadOnTime.indexOf(selectEndTime)>=0 && numLogStartTime>=0 && numLogStartTime<numEndTime){
            totalTime+=parseInt(this.data.logs[i].loadLength);
            restTime=i;
          }
        }
        console.log('符合结束时间当天的时间',totalTime);
        if(parseInt(this.data.logs[restTime].loadOffTime.substring(11,13)+this.data.logs[restTime].loadOffTime.substring(14,16))>numEndTime){
          var ifPlusMinus=parseInt(this.data.logs[restTime].loadOffTime.substring(11,13)+this.data.logs[restTime].loadOffTime.substring(14,16))-numEndTime;
          if(ifPlusMinus<0)
            totalTime+=(ifPlusMinus*60);
          else
            totalTime-=(ifPlusMinus*60);
        }
        console.log('totalTime:',totalTime);
      }
      if(totalTime==0){
        wx.showModal({
            title: "这一天没有数据",
            showCancel: false,
            confirmText: "确定",
            confirmColor: "#0f0",
        })
      }
      _result=(totalTime*this.data.speed/this.data.height/60).toFixed(2);
      this.setData({
        result:_result
       })
  },

  heightinput: function (e) {
    this.setData({
      height: e.detail.value
    })
    console.log(this.data.height);
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    console.log(e);
    var speeds = this.data.speeds;
    console.log(speeds);
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.id;
    console.log(id);
    if(id==0){
      this.setData({
        speed:0.09
      })
    }
    else if(id==1){
      this.setData({
        speed:0.18
      })
    }
    else if(id==2){
      this.setData({
        speed:0.12
      })
    }
    else{
      this.setData({
        speed:0.09
      })
    }
    this.setData({
      pleaseSelect: name,
      select: false
    })
    //this.onLoad();
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