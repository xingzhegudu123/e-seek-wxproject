// miniprogram/pages/near/near.js
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude:'',  // 经纬度
    latitude: '',
    markers:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     this.getLocation();
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

  },
  getLocation(){
    wx.getLocation({
      type: 'gcj02',
      success:(res)=> {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude,
          longitude
        });
        this.getNearUsers();
      }
    })
  },
  // 查找附近用户
  getNearUsers(){
     db.collection('users').where({
       location: _.geoNear({
         geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
         minDistance: 0,
         maxDistance: 5000,
       }),
       isLocation: true, // 开启共享位置才能被查找
    }).field({
      longitude:true,
      latitude:true,
      userPhoto:true,
    }).get().then(res=>{
     let data = res.data;
     let result = [];
     if(data.length){
      
       for(let i=0;i<data.length;i++){
         if (data[i].userPhoto.includes('cloud://')) {
           wx.cloud.getTempFileURL({  //换取图片临时链接
             fileList: [data[i].userPhoto],
             success: res => {
               // fileList 是一个有如下结构的对象数组
               // [{
               //    fileID: 'cloud://xxx.png', // 文件 ID
               //    tempFileURL: '', // 临时文件网络链接
               //    maxAge: 120 * 60 * 1000, // 有效期
               // }]
               result.push({
                 iconPath: res.fileList[0].getTempFileURL,
                 id: data[i]._id,
                 latitude: data[i].latitude,
                 longitude: data[i].longitude,
                 width: 30,
                 height: 30
               });
               this.setData({
                 markers: result,
               })
             },
            
           })
         } else {
           result.push({
             iconPath: data[i].userPhoto,
             id: data[i]._id,
             latitude: data[i].latitude,
             longitude: data[i].longitude,
             width: 30,
             height: 30
           });
         }
        
       }
      
       this.setData({
         markers:result,
       })
     }
    })
  },
  //  点击地图头像跳转
  markertap(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?userId=' + e.markerId,
    })
  },
  
})