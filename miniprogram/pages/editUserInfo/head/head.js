// miniprogram/pages/editUserInfo/head/head.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto:''
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
       userPhoto: app.userInfo.userPhoto
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
  // 上传图片
  hanbleUploadImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // console.log(res);
        // tempFilePath可以作为img标签的src属性显示图片
         const tempFilePaths = res.tempFilePaths[0];
         this.setData({
           userPhoto: tempFilePaths
         })
      }
    })
  },
  // 更新到云存储中
  handleBtn(){
    wx.showLoading({
      title: '上传中',
    })
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now()+'.jpg';
    wx.cloud.uploadFile({
      cloudPath,
      filePath: this.data.userPhoto, // 文件路径
    }).then(res => {
     
      // console.log(res.fileID) // 云存储图片路径
      let fileID = res.fileID;
      if (fileID){
        this.updateImg(fileID);
      }
    }).catch(error => {
      // handle error
    })
  },
  // 更新到数据库中
  updateImg(imgPath){
    db.collection('users').doc(app.userInfo._id).update({
      data: {
        userPhoto: imgPath
      }
    }).then(res => {
      wx.hideLoading();
      wx.showToast({
        title: '上传并更新成功',
      });
      app.userInfo.userPhoto = imgPath;
    })
  },
  //  点击使用微信头像
  bindGetUserInfo(e){
    let userInfo = e.detail.userInfo;
    if(userInfo){
      this.setData({
        userPhoto: userInfo.avatarUrl
      },()=>{
        wx.showLoading({
          title: '上传中',
        });
        this.updateImg(userInfo.avatarUrl);
       
      })
    }

  }
})