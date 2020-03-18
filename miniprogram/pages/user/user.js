// miniprogram/pages/user/user.js
const app = getApp(); // 拿到app对象
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: '/images/user/user-unlogin.png',
    nickName: "小喵喵",
    logged: false,
    disabled: true,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 如果用户存在数据库调用云函数自动登录
   * 否则点击登录（添加用户）
   */
  onReady: function () {
     this.getLocation();

     wx.cloud.callFunction({
       name:'login', // 执行云函数
       data:{},
     }).then((res)=>{
       db.collection('users').where({ // 连接数据库查询
         _openid: res.result.openid,
       }).get().then((res)=>{
         if(res.data.length){
           app.userInfo = Object.assign(app.userInfo, res.data[0]);
           this.setData({
             userPhoto: app.userInfo.userPhoto,
             nickName: app.userInfo.nickName,
             logged: true,
             id:app.userInfo._id
           });
           this.getMessage();
         }else{
           this.setData({
             disabled:false,
           })
         }
       
       })
      
     })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto:app.userInfo.userPhoto,
      nickName:app.userInfo.nickName,
      id: app.userInfo._id
    })

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
   /**登录--添加
   * 点击授权登录---获取用户微信信息添加到云数据库
   */
  bindGetUserInfo(ev){
    var that = this;
    // console.log(ev.detail.userInfo);
    let userInfo = ev.detail.userInfo;
    if (!that.data.logged && userInfo){
      db.collection('users').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature:'',
          phoneNumber:'',
          wexinNumber:'',
          links:0,
          time:new Date(),
          isLocation:true,
          longitude: this.longitude,  // 经纬度
          latitude: this.latitude,
          location: db.Geo.Point(this.longitude, this.latitude),
          friendList:[],
         
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
         
          db.collection('users').doc(res._id).get().then((res)=>{
            app.userInfo = Object.assign(app.userInfo, res.data);
            that.setData({
              userPhoto: app.userInfo.userPhoto,
              nickName: app.userInfo.nickName,
              logged: true,
              id: app.userInfo._id
            })
          })
        }
      })
    }

  },
  // 接收好友
  // 实时接收好友申请添加消息红点
  getMessage(){
    db.collection('message').where({ // 监听userId的变化
      userId: app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        console.log('docs\'s changed events', snapshot.docChanges)
        if (snapshot.docChanges.length){
        let list =  snapshot.docChanges[0].doc.list;
          if (list.length){
            wx.showTabBarRedDot({  // 显示红点
              index:2
            })
            app.userMessage = list;
        }else{
            wx.hideTabBarRedDot({
              index: 2
            })
            app.userMessage = [];
        }
       }else{

       }
      },
      onError: function (err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.latitude = res.latitude
        this.longitude = res.longitude
        // this.setData({
        //   latitude,
        //   longitude
        // })
      }
    })
  }
})