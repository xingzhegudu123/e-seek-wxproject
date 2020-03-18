// components/search/search.js
const app = getApp();
const db = wx.cloud.database();
Component({
  // 可接收外部样式  如iconfont
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus: false,
    historyList: [],
    searchList:[],
    cache:'', // 输入框变量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){  // 输入框获取光标时
      this.setData({
        isFocus:true
      })

      wx.getStorage({
        key: 'searchHistory',
        success:(res)=> {
           this.setData({
             historyList:res.data
           })
        }
      })
    },
    //  点击取消
    handleCancel(){
      this.setData({
        isFocus: false,
        cache: ''
      })
    },
    //  搜索  回车时存缓存
    handleConfirm(e){
      let value = e.detail.value;
      let cloneHistoryList = [...this.data.historyList];
      cloneHistoryList.unshift(e.detail.value);
      wx.setStorage({
        key: "searchHistory",
        data: [...new Set(cloneHistoryList)]
      })
      this.changeSearchList(value);
    },

   // 删除缓存
    handleHistoryDelete(){
      wx.removeStorage({
        key: 'searchHistory',
        success:(res)=> {
          this.setData({
            historyList:[],
          })
        }
      })
    },
    //  搜索
    changeSearchList(value){
        db.collection('users').where({
          nickName: db.RegExp({
            regexp: value,
            options: 'i',
          })
        }).field({
           userPhoto:true,
           nickName:true,
        }).get().then(res=>{
             this.setData({
               searchList: res.data
             })
        });
    },
    // 点击历史记录
    handleHistoryItemDel(e){
      let value = e.target.dataset.text;
      this.setData({
        cache: value
      })
      this.changeSearchList(value);

    }
  }
})
