var
    id = 0
    instances = {}
;

var 
    http = require('http')

    , app = http.createServer(function (request, response) {
        response.writeHead(200)
        response.end()
    })

    , port = process.env.PORT || 5000

    , io = require('socket.io').listen(app)
;

app.listen(port);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

    socket.on('new', function (mapUrl) {
        instances[id] = [socket, null, mapUrl];
        socket.emit('new', {id: id, mapUrl: mapUrl});
        id++;
    });

    socket.on('join', function (instanceId) {
        // Set the two players at the same room
        instances[instanceId][1] = socket;
        // Send to the second player the map url to load
        socket.emit('join', instances[instanceId][2]);
    });

    socket.on('ready', function (instanceId) {
        instances[instanceId][1].emit('ready');
        instances[instanceId][0].emit('ready');
    });

    socket.on('move', function (data) {
        console.log(data.id, data.py);
        if(instances[data.id][data.py]) instances[data.id][data.py].emit('move', data.data );
    });

    socket.on('disconnect', function () {
        //TODO
    });
})
