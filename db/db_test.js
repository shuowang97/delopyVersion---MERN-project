/*
* 1. connect to mongodb
*   1.1 import mongoose
*   1.2 connect to db
*   1.3 get the connected object
*   1.4 banded to listen
* 2. get the model for specific collection 得到对应特定集合的model
*   2.1 Schema(describe document structure
*       属性/属性值的类型， 是否必须/默认值
*   2.2 define model
* 3. using model to CRUD
*   3.1 save() -- create  这里要先创建model实例
*   3.2 find() / findOne() -- read
*   3.3 findByIdAndUpdate() -- update
*   3.4 remove() -- delete
* */
const md5 = require('blueimp-md5')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
const conn = mongoose.connection
conn.on('connected', function(){
    console.log('connection success')
})
// mongoose 包含文档和集合的概念
// 文档(user)就是一个对象 包含_id的键  多个文档组合称为集合 集合(users)就是一系列数据
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String},
})
// 如果集合名为users 这里必须写user 返回值是一个构造函数
const UserModel = mongoose.model('user', userSchema)

//using md5 to encrypt password
function testSave() {
    const userModel = new UserModel({username: 'Bob', password: md5('234'), type: 'Student'})
    //第二个参数是一个user的文档
    userModel.save(function (error, userDoc) {
        console.log('save()', error, userDoc)
    })
}
// testSave()

function testFind() {
    //find方法不一定只返回多个 可以加入{_id}来返回单个，但是默认返回数组，找不到返回[]
    UserModel.find(function (error, users) {
        console.log('find()', error, users)
    })
    //找不到返回null
    UserModel.findOne({_id:'5dd8f15e8f04d3ad98fff856'}, function (error, user) {
        console.log('findOne()', error, user)
    })
}
// testFind()

function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5dd8f15e8f04d3ad98fff856'},
                                {username: 'Jack'}, function (error, user) {
        console.log(('update()', error, user))
        }
    )
}
// testUpdate()

function testRemove() {
    UserModel.remove({_id: '5dd8f15e8f04d3ad98fff856'}, function (error, user) {
        console.log('remove()', error, user)
    })
}
// testRemove()