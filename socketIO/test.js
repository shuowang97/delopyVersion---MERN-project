//server只能在www里创建 这里需要从www里传进来
// 这里export的是一个函数
module.exports = function (server) {
    // socket.io 产生io 需要server作为输入
    const io = require('socket.io')(server)
    //监视服务器与客户端的连接
    io.on('connection', function (socket) {
        console.log('one client connected')
        // 绑定监听 接收客户端传来的数据
        socket.on('sendMsg', function (data) {
            //处理数据
            console.log('server receive message', data)
            data.name = data.name.toUpperCase()
            //服务器端发送数据
            io.emit('receiveMsg', data)
            console.log('server send message', data)
        })
    })

}
