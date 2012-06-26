var
    id = 0
    instances = {}

var 
    http = require('http')

    , app = http.createServer(function (request, response) {
        response.writeHead(200)
        response.end()
    })

    , port = process.env.PORT || 5000

    , io = require('socket.io').listen(app)

app.listen(port)
io.set('log level', 1)

io.sockets.on('connection', function (socket) {

    socket.on('new', function () {
        instances[id] = [socket, null]
        socket.emit('new', id)
        id++
    })

    socket.on('join', function (instanceId) {
        //console.log('JOIN: ',message)
        instances[instanceId][1] = socket
    })

    socket.on('move', function (data) {
        instances[data.id][data.py].emit('move', data.data )
    })

    socket.on('disconnect', function () {
        //TODO
    })
})
