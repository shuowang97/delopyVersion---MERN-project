var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5');
const {UserModel, ChatModel} = require('../db/models');
// const UserModel = require('../db/models').UserName;
const filter = {password: 0, __v: 0} //指定过滤的属性

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// register a route for user registers
/*
* path: /register
* type: post
* args: username, password
* judge: admin has been registered, others can be used
* success: { code: 0, data: {_id: 'abc', username: 'xxx', password: '123} }
* fail: { code: 1, msg: 'user exists' }
* */
//回调函数两个作用 处理请求，回复响应
// 1. get args 2. process 3. return data
/*router.post('/register', function(req, res){
  //1. get args (req)
  const {username, password} = req.body
  //2. process
  if(username === 'admin'){
    res.send({code: 1, msg: 'user exists'})
  }else{
    res.send({code: 0, data:{id: 'abd123', username, password}})
  }
})*/

//register
router.post('/register', function (req, res) {
  // 读值
  const {username, password, type} = req.body
  // 处理 -- 判断用户是否存在, 不存在->保存, 存在->错误信息
  UserModel.findOne({username}, function (error, user) {
    if(user){
      res.send({code: 1, msg: 'user exists'})
    }else{
      //{username, password, type} 代表一个对象
      new UserModel({username, password: md5(password), type}).save(function (error, user) {
        // 标识登录: cookie or session
        // 持久化cookie 浏览器会保存在本地文件 (会话cookie 浏览器内存    持久化cookie 本地)
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) //7天内免登录效果
        // 这里password不必返回给前台 但是默认的返回格式有_id
        const data = {username, type, _id: user._id}
        res.send({code: 0, data: data})
      })
    }
  })
})


// login
router.post('/login', function (req, res) {
  const {username, password} = req.body
  UserModel.findOne({username, password:md5(password)}, filter, function (error, user) {
    if(user){
      res.cookie('userid', user._id, {maxAge: 1000*24*24*60*7})
      // 这里需要除password之外的参数 引入filter
      // 这里与上面注册不同点在于 信息更多 强行拼接很麻烦
      res.send({code: 0, data: user})
    }else{
      res.send({code: 1, msg: 'user does not exist'})
    }
  })
})

//update info
router.post('/update', function(req, res) {
  // get userid(_id) from cookies
  const userid = req.cookies.userid // userid from 64 line
  // cookies will be cleaned after 7 days
  if(!userid){
    return res.send({code: 1, msg: 'please sign in'})
  }
  // exists, update user document based on userid
  // get user from req
  // 这里的数据是完善用户页面点了提交后 传进来的数据 缺少 username _id type
  const user = req.body
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {
    if(!oldUser) {
      //如果根据cookie的userid找不到对象，告诉浏览器删除cookie
      res.clearCookie(userid)
      res.send({code: 1, msg: 'please sign in'})
    }else {
      // Object assign ES6
      const {_id, username, type} = oldUser
      const data = Object.assign(user, {_id, username, type})
      res.send({code: 0, data: data})
    }
  })
})

// 根据cookie中的userid获取用户信息 这个路由是为了实现自动登录功能
router.get('/user', function (req, res) {
  //从请求的cookie中得到userid
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code: 1, msg: 'please login'})
  }
  // filter 过滤password
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code: 0, data: user})
  })
})
// 根据用户类型获取用户列表 student or recruiter
// 这里是get请求 所以应该用req.params or req.query
// post 请求用req.body
router.get('/userlist', function (req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (error, users) {
    res.send({code: 0, data: users})
  })
})

// 获得当前user的全部信息列表
router.get('/msglist', function (req, res) {
  //获取cookie中的userid
  const userid = req.cookies.userid
  //查询全部的user
  UserModel.find(function (error, userDocs) {
    //将对象以对应格式保存 user{_id: {username, header}}
    // key为user的_id, value为username&header的user对象
    /*userDocs.forEach(doc => {
      users[user._id] = {username: doc.username, header: doc.header}
    })*/
    // 可以用数组的reduce方法代替上面的部分
    // users 初始值为{} 代表一个空的对象容器
    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
      return users
    }, {})
    // 根据users 寻找与当前user有关的消息   找到from 当前user or to 当前user的全部信息
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (error, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

// 更新指定消息为已读
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})




module.exports = router;
