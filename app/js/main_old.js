var
	connection_ready = false
	, other_player = 0
	, instance = null
	, connection = io.connect('http://ws.jit.su')

window.onload = function () {
	if(DEBUG) document.getElementById('error').innerHTML += '<p>Socket: '+connection+'</p>'
}

connection.on('message', function (message) {

	if(DEBUG) console.log(message)
	var message = message.data.split('&')

	if(message[0] === 'NEW') {
		if(DEBUG) console.log('NEW: ', message[1])
		instance = parseInt(message[1])
	} else if(message[0] === 'MOVE') {
		if(DEBUG) console.log('MOVE: ', message[1])
	}

	document.getElementById('history').innerHTML += '<p>'+message[1]+'</p>'
})

connection.on('connect', function () {
	connection_ready = true
	if(DEBUG) console.log('OPEN')
	if(DEBUG) document.getElementById('log').innerHTML += '<p>OPEN</p>'	
})

// connection.on('error', function (error) {
// 	if(DEBUG) console.log('ERROR: ', error)
// 	if(DEBUG) document.getElementById('error').innerHTML += '<p>'+error+'</p>'
// })

var game = {

	// Create new instance at server
	// server returns the instance id
	new: function () {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: new</p>'
		if(connection_ready) {
			connection.emit('NEW')
			other_player = 1 
		}
	},

	// Append you to existing game instance
	// You send to the server the instance id
	join: function (instanceId) {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: join</p>'
		if(connection_ready) {
			connection.emit('JOIN&'+instanceId)
			instance = instanceId
			other_player = 0
		}
		if(DEBUG) console.log('JOIN: ', instance, other_player)
	},

	move: function (dataToSend) {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: move</p>'
		if(connection_ready) {
			connection.emit('MOVE&'+instance+'&'+other_player+'&'+dataToSend)
		}

	}
}