var markers = [];//地图标记点
var callout = [];//地图标记点的气泡
let cookie = wx.getStorageSync('cookieID');
let header = {};
var EqpList=[];
var Allloc=[];
if (cookie) {
  header.Cookie = cookie;
}
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
 
// 实例化API核心类
var demo = new QQMapWX({
    key: 'NPABZ-LOP6K-JSQJV-AE5T2-22LY5-CEB5U' // 必填
});
Page({
  data: {
    select: false,
    index:0,
    locationInfo:[],
    province: '请选择省份',
    scale: 3.5,
    latitude: '33.1191502268',
    longitude: '105.5126953125',
    provinces: [{
      id: 0,
      name: "全览",
      longitude: '105.5126953125',
      latitude: '33.1191502268'
    },{
      id: 1,
      name: "北京市",
        longitude: '116.405289',
        latitude: '39.904987'
      }, {
        id: 2,
        name: "天津市",
        longitude: '117.190186',
        latitude: '39.125595'
      }, {
        id: 3,
        name: "上海市",
        longitude: '121.472641',
        latitude: '31.231707'
      }, {
        id: 4,
        name: "重庆市",
        longitude: '106.504959',
        latitude: '29.533155'
      }, {
        id: 5,
        name: "安徽省",
        longitude: '117.283043',
        latitude: '31.861191'
      }, {
        id: 6,
        name: "福建省",
        longitude: '119.306236',
        latitude: '26.075302'
      }, {
        id: 7,
        name: "甘肃省",
        longitude: '103.834170',
        latitude: '36.061380'
      }, {
        id: 8,
        name: "广东省",
        longitude: '113.28064',
        latitude: '23.125177'
      }, {
        id: 9,
        name: "广西壮族自治区",
        longitude: '108.320007',
        latitude: '22.82402'
      }, {
        id: 10,
        name: "贵州",
        longitude: '106.713478',
        latitude: '26.57834'
      }, {
        id: 11,
        name: "海南省",
        longitude: '110.199890',
        latitude: '20.044220'
      }, {
        id: 12,
        name: "河北省",
        longitude: '114.502464',
        latitude: '38.045475'
      }, {
        id: 13,
        name: "河南省",
        longitude: '113.665413',
        latitude: '34.757977'
      }, {
        id: 14,
        name: "黑龙江省",
        longitude: '126.642464',
        latitude: '45.756966'
      }, {
        id: 15,
        name: "湖北省",
        longitude: '114.298569',
        latitude: '30.584354'
      }, {
        id: 16,
        name: "湖南省",
        longitude: '112.982277',
        latitude: '28.19409'
      }, {
        id: 17,
        name: "吉林省",
        longitude: '125.324501',
        latitude: '43.886841'
      }, {
        id: 18,
        name: "江苏省",
        longitude: '118.76741',
        latitude: '32.041546'
      }, {
        id: 19,
        name: "江西省",
        longitude: '115.892151',
        latitude: '28.676493'
      }, {
        id: 20,
        name: "辽宁省",
        longitude: '123.4292500000',
        latitude: '41.8357100000'
      }, {
        id: 21,
        name: "内蒙古自治区",
        longitude: '111.751990',
        latitude: '40.841490'
      }, {
        id: 22,
        name: "宁夏回族自治区",
        longitude: '106.232480',
        latitude: '38.486440'
      }, {
      id: 23,
      name: "青海省",
        longitude: '101.777820',
        latitude: '36.617290'
      }, {
        id: 24,
        name: "山东省",
        longitude: '117.000923',
        latitude: '36.675808'
      }, {
        id: 25,
        name: "山西省",
        longitude: '112.549248',
        latitude: '37.857014'
      }, {
        id: 26,
        name: "陕西省",
        longitude: '108.948021',
        latitude: '34.263161'
      }, {
        id: 27,
        name: "四川省",
        longitude: '104.065735',
        latitude: '30.659462'
      }, {
        id: 28,
        name: "西藏自治区",
        longitude: '91.11450',
        latitude: '29.644150'
      },{
      id: 29,
        name: "新疆维吾尔自治区",
        longitude: '87.616880',
        latitude: '43.826630'
    }, {
      id: 30,
      name: "云南省",
        longitude: '102.71225',
        latitude: '25.040609'
    },
    {
      id: 31,
      name: "浙江省",
      longitude: '120.15358',
      latitude: '30.287458'
    }],
    latitude_1:'',
    longitude_1:'',
    status_1:''
  },
  onLoad() {
    var that = this;
    var header = getApp().globalData.header; 
    wx.request({
      url: 'https://wx.zonmoo.com/eqpList',
      header:header,
      method:"GET",
      success: function (res) {
        if(res.data.code==200){
        EqpList=res.data.data.eqpList;
        for(var i=0;i<EqpList.length;i++){
          (function(j){
            var lat=(EqpList[j].latitude).match(/\d+\.\d+/g);
            var lon=(EqpList[j].longitude).match(/\d+\.\d+/g);
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
                Allloc[j]=res.result.address;
                // console.log
                that.setData({
                  //[_locationInfo]:res.result.address+res.result.address_reference.landmark_l2.title+res.result.address_reference.town.title
                  [_locationInfo]:res.result.address
                })
              },
            })        
          })(i);
        }
            for (var i = 0; i < EqpList.length; i++) {
              (function(j){
              var lat=(EqpList[j].latitude).match(/\d+\.\d+/g);
              var lon=(EqpList[j].longitude).match(/\d+\.\d+/g);
              markers = markers.concat({
              iconPath: "/images/user/loc.png",
              id: j,
              callout: {
                content: "",
                color:"#2c8df6",
                fontSize:15,
                borderRadius:10,
                bgColor:"#fff",
                display:"ALWAYS",
                boxShadow:"2px 2px 10px #aaa"
              },
              latitude: lat,
              longitude: lon,
              width: 30,
              height: 30
            });
              })(i);
      }
      
        
        console.log(markers)
        that.setData({
          markers: markers,
        })
        }
      else wx.showModal({
        title: '提示',
        content: '请登录',
        showCancel: false,
        confirmText: '去登陆',
          confirmColor: '#0f0',
        success: function(res) {
          wx.switchTab({
            url: '../users/users',
          })
        },
      })
      }
      });
      
    // var interval = setInterval(function () {
    //   console.log("刷新")
    // }, 30000)
  },

  showModal: function (event) {
    console.log(event);
    var i = event.markerId-1;
    var header = getApp().globalData.header;
    var that=this;
    this.setData({
      index:event.markerId
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  

  },

  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  mySelect(e) {
    console.log(e);
    var provinces = this.data.provinces;
    console.log(provinces);
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.id;
    console.log(id);
    if (id == 0) 
      this.setData({
        longitude: provinces[id].longitude,
        latitude: provinces[id].latitude,
        scale: 3.5
      });
    else
      this.setData({
        longitude: provinces[id].longitude,
        latitude: provinces[id].latitude,
        scale: 7.5
      });
    console.log(this.data.longitude);
    console.log(this.data.latitude);
    console.log(name);
    this.setData({
      province: name,
      select: false
    })
    this.onLoad();
  },
  toDetail:function(){
    let _index=this.data.index;
    wx.navigateTo({
      url: '/pages/detailchart/detailchart?id='+_index,
    })
  },
  onShow() {
  },
})