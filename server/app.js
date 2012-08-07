var 
    http = require('http')

    , app = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('caju\n');
    })

    , port = process.env.PORT || 5000
    , io = require('socket.io').listen(app)

    , id = 0
    , instances = {}
    , instances_tmp = {}
;

app.listen(port);
io.set('log level', 1);

io.sockets.on('connection', function (socket) {

    socket.on('new', function (player) {

        instances_tmp[id] = [socket, player];
        socket.emit('new', {id: id});
        id++;
    });

    socket.on('join', function (data) {
        var instanceId = data.instanceId;
        var playerB = data.player;

        var socketAFull = instances_tmp[instanceId];

        // Players connected PvP
        if(socketAFull) {
            var socketA = socketAFull[0];
            var playerA = socketAFull[1];

            delete instances_tmp[instanceId];

            instances[socketA.id] = socket;
            instances[socket.id] = socketA;

            socket.emit('ready', playerA);
            socketA.emit('ready', playerB);

        } else {
            socket.emit('join', false);
        }
    });

    socket.on('ready', function (instanceId) {
        /*instances[instanceId][1].emit('ready');
        instances[instanceId][0].emit('ready');*/
    });

    socket.on('move', function (data) {
        if(instances[socket.id]) {
            instances[socket.id].emit('move', data.data);
        }
    });

    socket.on('disconnect', function () {
        var socketB = instances[socket.id];

        if(socketB) {
            socketB.emit('bye');
            delete instances[socket.id];
            delete instances[socketB.id];
        }
    });

});