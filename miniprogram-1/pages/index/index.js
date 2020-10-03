Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgsUrls: [
      '../../images/user/1.jpg',
      '../../images/user/2.jpg',
      '../../images/user/3.jpg',
      '../../images/user/4.jpg',
      '../../images/user/5.jpg',
      '../../images/user/6.jpg'
    ],
    News:[
      {
        id:1,
        title:"中模中星玻纤钢化模板亮相万人展会 引发人头簇",
        time:"2019-03-11 22:18:01",
        img:"../../images/user/news1.jpg"
      }, { 
        id:2,
        title:"模架行业盛会2018-2019年中模生态共享平台年会圆",
         time:"2019-03-11 17:55:39",
        img:"../../images/user/news2.jpg"
      },{
        id:3,
        title:"醴陵市副市长王吉祥亲临中模南方运营中心考察",
        time:"2019-03-11 09:48:22",
        img:"../../images/user/news3.jpg"
      },{
        id:4,
        title:"南北统筹加速推进模架一体化进程 中模南方总部",
        time:"2019-03-10 14:44:13",
        img:"../../images/user/news4.jpg"
      }
    ]
  },
    OpenPage:function(event){
      console.log(event);
      //从1开始
      var index=event.currentTarget.dataset.id;
      console.log(index);
      wx.navigateTo({
        url: '../depage/depage',
      })
      // wx.navigateTo({
      //   url: '../depage/depage?id='+index,
      // })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(parseInt(this.data.test));
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