// miniprogram/pages/editUserInfo/wexin/wexin.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wexinNumber:''
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
    this.setData({
      wexinNumber: app.userInfo.wexinNumber
    })
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
  // 获取输入框的值
  handleText(e) {
    let value = e.detail.value;
    this.setData({
      wexinNumber: value
    })
  },
  // 点击设置
  handleBtn(e) {
    this.updateWexinNumber();
  },
  updateWexinNumber() {
    wx.showLoading({
      title: '更新中',
    })
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        wexinNumber: this.data.wexinNumber
      }
    }).then((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '更新成功',
      });
      app.userInfo.wexinNumber = this.data.wexinNumber;

    })
  }
})