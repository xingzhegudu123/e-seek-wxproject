# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档
该项目是附近交友类小程序 涉及功能有
   用户授权wx.authorize和wx.getUserInfo获取用户信息
   自定义组件：pages页面下json配置关联组件
   map地图：Command.geoNear附近人查找和wx.getLocation定位地理位置
   缓存搜素历史记录: 通过wx.setStorage设置db.RegExp实现模糊搜索
   云开发:云存储，云函数,云数据库（修改用户头像和昵称）
   利用koa2搭建cms服务端上传图片到云数据库更新轮播图

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

