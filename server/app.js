var
    id = 0
    , instances = {}
    , instances_tmp = {}
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

    socket.on('new', function (player) {

        instances_tmp[id] = [socket, player];
        socket.emit('new', {id: id});
        id++;

        /*console.log(socket);
        instances[id] = [socket, null, mapUrl];
        socket.emit('new', {id: id, mapUrl: mapUrl});
        id++;*/
    });

    socket.on('join', function (data) {
        var instanceId = data.instanceId;
        var playerB = data.player;

        var socketAFull = instances_tmp[instanceId];

        // Conectados los sockets :)

        if(socketAFull) {
            var socketA = socketAFull[0];

            var playerA = socketAFull[1];

            //console.log(socketB.id, socket.id)

            delete instances_tmp[instanceId];

            instances[socketA.id] = socket;
            instances[socket.id] = socketA;


            /*for(var key in instances) {
                console.log(key, instances[key].id);
            }*/

            socket.emit('ready', playerA);
            socketA.emit('ready', playerB);

        } else {
            socket.emit('join', false);
        }
        /*console.log(io.sockets)
        if(instances[instanceId] && instances[instanceId][1] == null && instances[instanceId][0] != socket) {
            // Set the two players at the same room
            instances[instanceId][1] = socket;
            // Send to the second player the map url to load
            socket.emit('join', true);
        } else {
            socket.emit('join', false);
        }*/
    });

    socket.on('ready', function (instanceId) {
        /*instances[instanceId][1].emit('ready');
        instances[instanceId][0].emit('ready');*/
    });

    socket.on('move', function (data) {
        //console.log(data.id, data.py);
        //if(instances[data.id][data.py]) instances[data.id][data.py].emit('move', data.data);
        instances[socket.id].emit('move', data.data);
    });

    /*socket.on('data', function (data) {

    });*/

    socket.on('disconnect', function () {
        //TODO
        var socketB = instances[socket.id];

        if(socketB) {
            socketB.emit('bye');

            delete instances[socket.id];
            delete instances[socketB.id];
        }
    });

})
