/*  只要是保存到数据库里的，都必须将格式写在这里
*   include multiple Model模块 to control set data
* 1. import mongodb
*   1.1 import mongoose
*   1.2 connect to specific db
*   1.3 get the connected object
*   1.4 finish listening
* 2. define Model and export
*   2.1 Schema
*   2.2 define Model
*   2.3 export Model
*
* */
/*1. 连接数据库*/
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin2')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', () => {
    console.log('db connect success!')
})

/*2. 定义出对应特定集合的Model并向外暴露*/
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 月薪
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) // 集合为: users
// 2.3. 向外暴露Model
exports.UserModel = UserModel


// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // user that sends message
    to: {type: String, required: true}, // user that receive message
    chat_id: {type: String, required: true}, // used to judge who the two users are + "from"和 "to" 组成的字符串
    content: {type: String, required: true}, // message content
    read: {type: Boolean, default: false, required: false}, // sign for reading
    create_time: {type: Number} // create time
})
//定义Model
const ChatModel = mongoose.model('chat', chatSchema)
//向外暴露
exports.ChatModel = ChatModel