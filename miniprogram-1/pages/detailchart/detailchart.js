import * as echarts from '../../utils/ec-canvas/echarts'; //引入echarts.js

let cookie = wx.getStorageSync('cookieID');
let header = {};
if (cookie) {
  header.Cookie = cookie;
}
var app = getApp()
var dataList = [];
var EqpList=[];
var Chart1=null;
var Chart2=null;
var eqp1=[];
var eqp2=[];
var _eqp1=[];
var _eqp2=[];
var option1={};
var option2={};
var lat;
var lon;
// var x=0;//用来循环经纬度
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var demo = new QQMapWX({
   key: 'NPABZ-LOP6K-JSQJV-AE5T2-22LY5-CEB5U' // 必填
});
// var _index=0;
Page({
  data: {
    ec1: {
      lazyLoad: true // 延迟加载
    },
    ec2:{
      lazyLoad:true
    },
    _index:0,
    timer:'',
    eqpStatus:[],
    locationInfo:[]
  },
  onLoad: function (options) {
     console.log(options.id);
     this.setData({
      _index:Number(options.id)
    });
    var that=this;
    //_index=0;
    this.echartsComponnet1 = this.selectComponent('#mychart1');
    this.echartsComponnet2 = this.selectComponent('#mychart2');
    this.getData(); //获取数据
    this.setData({                    //每隔一分钟刷新一次
      timer: setInterval(function () {
              that.getData();
          }, 5000)
  })
  },
  getData: function () {
    var that=this;
    var index=this.data._index;
    console.log('刷新');
    var header = getApp().globalData.header;
  	wx.request({
  	  url: 'https://wx.zonmoo.com/eqpList', 
      method: 'GET',
      header:header,
      success: (res) => {
        console.log(res.data);
        EqpList=res.data.data.eqpList;
        console.log("EqpList:",EqpList);
        dataList=res.data.data.eqpList[index].slaveData; 
        this.setData({
          eqpStatus:EqpList,
        })
        console.log('eqpStatus:',this.data.eqpStatus);
        for(var i=0;i<=dataList.length/2;i++){
          _eqp1[i]=dataList[i].split("+");
          console.log('_eqp1[]',_eqp1[i]);
          eqp1[i]=_eqp1[i][1];
        }
        var j=0;
        for(var i=dataList.length-1;i>=dataList.length/2&&j<dataList.length/2;i--,j++){
          _eqp2[j]=dataList[i].split("+");
          // 21-40从机的数据
          //eqp2[j]=_eqp2[j][1];
        }

        console.log('eqp1:',eqp1);
        console.log('eqp2:',eqp2);
        console.log('dataList的长度为',dataList.length);
        console.log('dataList:',dataList);
        for(var i=0;i<EqpList.length;i++){
          (function(j){
            var lat=(EqpList[j].latitude).match(/\d+\.\d+/g);
            var lon=(EqpList[j].longitude).match(/\d+\.\d+/g);
            console.log(lat);
            //console.log(typeof(3123/10));
            //console.log(typeof(Number(lat)/100.000));
            var _locationInfo="locationInfo["+j+"]";
            demo.reverseGeocoder({
              location:{
                latitude:lat,
                longitude:lon,
              },
              coord_type:5,
              sig:'sTEvd41jHVhjFcMXbHjUjzKjBe1u3p0',
              success:function(res){
                console.log(res);
                console.log('逆解析成功',res.result.address);
                // console.log
                that.setData({
                  [_locationInfo]:res.result.address+res.result.address_reference.landmark_l2.title+res.result.address_reference.town.title
                  //[_locationInfo]:res.result.address
                  //[_locationInfo]:1
                })
              },
              fail:function(res){
                console.log('逆解析错误:',res);
                that.setData({
                  [_locationInfo]:j
                })
                console.log('_locationInfo',that.data.locationInfo[j]);
                //console.log(latitude,longitude);
              },
              complete:function(){
                //console.log('坐标:',EqpList[0].latitude.EqpList[0].longitude);
                console.log('j:',j);
              }
            })
        })(i);
      }
      console.log('locationInfo:',typeof(that.data.locationInfo));

        option1 = {
          canvasId: 'columnCanvas',
          type: 'column',
            xAxis: {
              // type: 'value',
              data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'],
              disableGrid: true,
              axisLabel: {  
                interval: 0,  
                formatter:function(value)  
                {  
                    return value.split("").join("\n");  
                }  
            }  
            },
            yAxis: {
              disableGrid: false,
              gridColor: "#ffffff",
              fontColor: "#ffffff",
              min: 0,
              max: 6,
              disabled: true,
              fontColor: "#ff6700"
            },
            series: [{
              data: eqp1,
              type: 'bar',
              color: "rgba(255,90,87,1)"
            }],
            extra: {
              column: {
                  width: 1
              }
          }
        };
        option2 = {
          canvasId: 'columnCanvas',
          type: 'column',
            xAxis: {
              // type: 'value',
              data: ['21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'],
              disableGrid: true,
              axisLabel: {  
                interval: 0,  
                formatter:function(value)  
                {  
                    return value.split("").join("\n");  
                }  
            }  
            },
            yAxis: {
              disableGrid: false,
              gridColor: "#ffffff",
              fontColor: "#ffffff",
              min: 0,
              max: 6,
              disabled: true,
              fontColor: "#ff6700"
            },
            series: [{
              //data: dataList,
              data:eqp2,
              type: 'bar',
              color: "rgba(255,90,87,1)"
            }],
            extra: {
              column: {
                  width: 1
              }
          }
        };
        if(!Chart1){
          this.init_echarts1();
          this.init_echarts2();
        }
        else{
          this.setOption(Chart1);
          this.setOption(Chart2);
        }
        eqp1=[];
        eqp2=[];
      }
	});
  },
  //初始化图表
  init_echarts1: function () {
    this.echartsComponnet1.init((canvas, width, height) => {
      Chart1 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart1.setOption(option1);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart1;
    });
  },
  init_echarts2: function () {
    this.echartsComponnet2.init((canvas, width, height) => {
      //console.log("触发init");
      // 初始化图表
      Chart2 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      //Chart.setOption(this.getOption());
      Chart2.setOption(option2);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      //this.setOption(Chart);
      return Chart2;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    if(Chart==Chart1)
      Chart.setOption(option1);  //获取新数据
    else
      Chart.setOption(option2);
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
    //var eqpList = that.data.eqpList;
    console.log("eqpList:",EqpList);
    console.log(EqpList[newId].status);
    console.log('that.data.eqpStatus[that.data._index].status:',that.data.eqpStatus[that.data._index].status);
    var _eqp="eqp["+newId+1+"].status";
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
          that.setData({
            [_eqp]:_eqp
          });
          EqpList[newId].status = EqpList[newId].status;
          console.log(EqpList[newId].status);
          console.log('that.data.eqpStatus[that.data._index].status:',that.data.eqpStatus[that.data._index].status);
        }
        else
          {
          if (EqpList[newId].status) {
            that.setData({
              [_eqp]:false
            })
            EqpList[newId].status = false;
            console.log(EqpList[newId]);
            console.log(EqpList[newId].status);
            console.log('eqpStatus[that.data._index]',that.data.eqpStatus[that.data._index]);
            }
          else {
            that.setData({
              [_eqp]:true
            })
            EqpList[newId].status = true;
            console.log(EqpList[newId]);
            console.log(EqpList[newId].status);
            console.log('eqpStatus[that.data._index]',that.data.eqpStatus[that.data._index]);
            }
            wx.request({
              url: 'https://wx.zonmoo.com/turnOnOrOff',
              data:{
                "masterId":'0'+(newId+1),
                "switch": EqpList[newId].status
              },
              header: header,
              method: 'POST',
              dataType: 'json',
              success: function (res) {
                console.log("上传成功之后的开关",EqpList[newId].status);
                console.log("上传成功之后的设备编号", '0'+(newId+1));
                console.log(typeof(('0' +newId).toString()));
                console.log(typeof(parseInt('0' +newId)));
                console.log(typeof(that.data.eqpStatus[that.data._index].status));
                console.log(that.data.eqpStatus[that.data._index].status);
                console.log(res);
                console.log("最后的header",header);
                // that.setData({
                //   status:that.data.eqpStatus[newId].status,
                // });
                // console.log(that.data.status)
                //that.data.eqpList[newId].status=eqpList[newId].status;
                that.onLoad();
  
              },
              fail: function (err) {console.log("失败后的",err) },
              complete: function (res) { },
            })
        }
        //newId=newId+1;    
      },
      fail: function (res) { console.log(res) },
      complete: function (res) { },
    })
  },
  nextpage:function(){
    if(this.data._index<EqpList.length-1){
      this.setData({
        _index:this.data._index+1
      })
      // this.data._index=this.data._index+1;
      this.getData();
    }
    else
    wx.showToast({
      title: '已是最后一台',
      icon:null,
      duration:1000
    })
    console.log(this.data._index);
  },
  lastpage:function(){
    if(this.data._index!=0){
      this.setData({
        _index:this.data._index-1
      })
      //this.data._index=this.data._index-1;
      this.getData();
    }
    else
      wx.showToast({
        title: '已是第一台',
        icon:null,
        duration:1000
      })
    console.log(this.data._index);
  },
 up:function(){
  wx.showModal({
    title: "状态",
    showCancel: false,
    content: "机器正在上升状态",
    confirmText: "确定",
    confirmColor: "#0f0",
    success: function (res){},
  })
 },
 down:function(){
  wx.showModal({
    title: "状态",
    showCancel: false,
    content: "机器正在下降状态",
    confirmText: "确定",
    confirmColor: "#0f0",
    success: function (res){},
  })
 },
 warnover:function(e){
   var warnId=e.currentTarget.id;
   var content1="当前的超载值为"+EqpList[warnId].maxLoad;
  wx.showModal({
    title: "超载",
    showCancel: false,
    content: content1,
    confirmText: "确定",
    confirmColor: "#0f0",
    success: function (res){},
  })
 },
 warnloss:function(e){
  var warnId=e.currentTarget.id;
  var content1="当前的失载值为"+EqpList[warnId].minLoad;
 wx.showModal({
   title: "失载",
   showCancel: false,
   content: content1,
   confirmText: "确定",
   confirmColor: "#0f0",
   success: function (res){},
 })
},
toDetail:function(){
  //console.log(e);
  // let index=e.currentTarget.dataset.index;
  // console.log(e.currentTarget.dataset.index);
  wx.navigateTo({
    url:'/pages/detail/detail?index='+this.data._index,
  })
},
showper:function(){
  wx.showModal({
    title: '权限',
    content: '你是普通用户，无法使用该功能',
    showCancel: false,
    confirmText: '确定',
    confirmColor: '#0f0'
  })
},
 onShow:function(){
   Chart1=null;
   Chart2=null;
   //this.onLoad()
},
onUnload:function(){
  clearInterval(this.data.timer)
},
onHide: function () {
  clearInterval(this.data.timer);
},
})