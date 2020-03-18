// miniprogram/pages/detail/detail.js
const app = getApp(); // 拿到app对象
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    isFriend:false,
    isHiddle:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = options.userId;
    db.collection('users').doc(userId).get().then((res)=>{
       this.setData({
         detail:res.data
       });
      let friendList = res.data.friendList;
      console.log(userId,'5555')
      if (friendList.includes(app.userInfo._id)){
          this.setData({
            isFriend: true,
          })
      }else{
        this.setData({
          isFriend:false
        },()=>{
          if (userId==app.userInfo._id){
            this.setData({
              isFriend: true,
              isHiddle:true
            })
          }
        })
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
  // 添加好友
  handleAddFriend(){
   if(app.userInfo._id){
     
        db.collection('message').where({
          userId: this.data.detail._id
        }).get().then(res=>{

          if(res.data.length){ // 更新
            if (res.data[0].list.includes(app.userInfo._id)){
                wx.showToast({
                  title: '已经申请过',
                })
            }else{
              wx.cloud.callFunction({ //根据userId去调用云函数在服务端更新
                name:'update',
                data:{
                  collection:'message',
                  where:{
                    userId:this.data.detail._id
                  },
                   data: `{list:_.unshift('${app.userInfo._id}')}`
                },
               
              }).then(res=>{
                wx.showToast({
                  title: '申请成功~',
                })
              })
            }
              
          }else{ // 添加
            db.collection('message').add({
              data:{
                userId: this.data.detail._id, // 本人
                list:[app.userInfo._id], // 添加的对象
              }
            }).then(res=>{
              wx.showToast({
                title: '申请成功',
              })
            })
          } 

        })
   }else{
     wx.showToast({
       title: '请先登录',
       duration: 2000,
       icon: 'none',
       success:()=>{
         setTimeout(()=>{
           wx.switchTab({
             url: '/pages/user/user',
           })
         },2000);
        
       }
     })
   }
  }
})