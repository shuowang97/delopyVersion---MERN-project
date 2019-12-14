const {ChatModel} = require('../db/models')
module.exports = function (server) {
    const io = require('socket.io')(server)
    // 监视客户端与服务器端的连接
    io.on('connection', function (socket) {
        console.log('one client connects')

        // 绑定监听，接收客户端发送的数据
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('server received data from client', {from, to, content})

            // 处理数据 save it
            const chat_id = [from, to].sort().join('_')       //  from_to  or  to_from 这里前面两种格式 应该对应同一条消息 所以进行排序
            const create_time = Date.now()
            new ChatModel({from, to, chat_id, content, create_time}).save(function (error, chatMsg) {
                // 向客户端发消息 (这里的写法是向全部的客户端发消息，较为低效）
                // send msg to clients
                // 一次发一条
                io.emit('receiveMsg', chatMsg)

            })
        })
        // 向客户端发消息


    })
}