// miniprogram/pages/message/message.js
const app = getApp(); // 拿到app对象
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userMessage:[],
    logged:false
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.userInfo._id){  // 进入之前先登录
       this.setData({
         logged:true,
         userMessage:app.userMessage, // 更新为全局的
       })
    }else{
      wx.showToast({
        title: '请先登录',
        duration: 2000,
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/user/user',
            })
          }, 2000);

        }
      })
    }
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
  onMyEvent(e){
    this.setData({
      userMessage:[],// 先清空再赋值会重新走生命周期渲染
    },()=>{
       this.setData({
         userMessage:e.detail
       })  
    })
   
  }
})