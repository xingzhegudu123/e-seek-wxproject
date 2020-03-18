const router = require('koa-router')()
const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const request = require('request-promise');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})


router.post('/uploadBannerImg', async (ctx, next) => {
    var files = ctx.request.files;
    var file = files.file;
  // const file = ctx.request.files.file;
  // const formData = ctx.request.body;
  // const extname = path.extname(file.name);
  // //　本地文件服务器获取POST上传文件过程
  // // １. fs.createReadStream 创建可读流
  // // ２. fs.createWriteStream　创建可写流
  // // 3. reader.pipe(writer)
  // const reader = fs.createReadStream(file.path);
  // const writer = fs.createWriteStream(
  //   `static/${Math.random()
  //     .toString(36)
  //     .substr(2)}${extname}`
  // );
  // reader.pipe(writer);
  // ctx.body = formData;
// 原文链接：https://blog.csdn.net/qq_24724109/article/details/103442452
    try {
      let options = {
          uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appid +'&secret=' + config.secret + '',
          json:true
      }
      let {access_token} = await request(options);
      let fileName = `${Date.now()}.jpg`;
      let filePath = `banner/${fileName}`;
      options = {
          method: 'POST',
          uri: 'https://api.weixin.qq.com/tcb/uploadfile?access_token=' + access_token + '',
          body: {
              "env": 'dev-7y8mk',
              "path": filePath,
          },
          json: true
      }
      let res = await request(options);
      let file_id = res.file_id;
    // 写入云数据库
      options = {
        method : 'POST',
        uri : 'https://api.weixin.qq.com/tcb/databaseadd?access_token=' + access_token + '',
        body : {
          "env": 'dev-7y8mk',
          "query" : "db.collection(\"banner\").add({data:{fileId:\""+ file_id +"\"}})"
        },
        json : true
      }

      await request(options)
    // 写入云存储
      options = {
          method: 'POST',
          uri: res.url,
          formData: {
              "Signature": res.authorization,
              "key": filePath,
              "x-cos-security-token": res.token,
              "x-cos-meta-fileid": res.cos_file_id,
              "file": {
                  value: fs.createReadStream(file.path),
                  options: {
                      filename: fileName,
                      contentType: file.type
                  }
              }
          }
      }
      await request(options);
      ctx.body = res;

    } catch (err) {
        console.log(err.stack)
    }
    })


module.exports = router
