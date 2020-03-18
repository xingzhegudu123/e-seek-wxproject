// miniprogram/pages/index/index.js
const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    listData:[],
    current:'time',
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500
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
    this.getListData();
    this.getBannerList();
    
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
  // 点击点赞
  handleLinks(e){
    let id = e.target.dataset.id;
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'update',
      // 传递给云函数的event参数
      data: {
        collection:'users',
        doc: id,
        data:"{links: _.inc(1)}"
      }
    }).then(res => {
      let updated = res.result.stats.updated;
      
      if (updated){
        let cloneListData = [...this.data.listData];
        // console.log(cloneListData, '990090909');
        for (let i = 0; i < cloneListData.length;i++){
          if (cloneListData[i]._id == id){
            cloneListData[i].links++;
           }
        }
        this.setData({
          listData: cloneListData
        })
      }
      
    }).catch(err => {
      // handle error
    });
  },
  handleCurrent(e){
    let current = e.target.dataset.current;
    // console.log(current,'点击切换')
    if (current == this.data.current){
       return false;
    }
    this.setData({
      current
    },()=>{
      this.getListData();
    });
  },
  getListData(){
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true,
    })
      .orderBy(this.data.current, 'desc')
      .get().then((res) => {
        this.setData({
          listData: res.data
        })

      })
  },
  // 首页点击进入详情页
  handleDetail(e){
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?userId='+id,
    })
  },
  // 
  getBannerList(){
    db.collection('banner').get().then((res)=>{
       this.setData({
         imgUrls: res.data
       })
    })

  }
})