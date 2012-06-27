/* Author:
	Juan Pablo Pinilla - @jp_pinilla
*/

var
	game
	, socket
	, connection_ready = false
	, other_player = 0
	, instance = null


// Console history, events
const DEBUG = true


/************************************
 * Utils
 ************************************/


/** CSS Classes **/

// Returns true or false if element has css class
Element.prototype.hasClassName = function (name) {
	return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className)
}

// Add css class to element
Element.prototype.addClassName = function (name) {
	if (!this.hasClassName(name)) this.className = this.className ? [this.className, name].join(' ') : name

}

// Remove css class
Element.prototype.removeClassName = function (name) {
	if (this.hasClassName(name)) this.className = this.className.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "")
}


/** Selectors **/

// $ Mootools selector
window.$ = function () {
	return document.getElementById.apply(document, arguments)
}

// $$ Mootools selector
window.$$ = function () {
	return document.querySelectorAll.apply(document, arguments)
}

/************************************
 * Socket
 ************************************/

socket = io.connect('http://localhost:5000', {
	'reconnect': true
	, 'reconnection delay': 500
	, 'max reconnection attempts': 5
})

socket.on('connect', function () {
	connection_ready = true
	if(DEBUG) console.log('OPEN')
	if(DEBUG) document.getElementById('log').innerHTML += '<p>OPEN</p>'	
})

socket.on('new', function (data) {
	if(DEBUG) console.log('NEW: ', data)
	instance = parseInt(data)
	document.getElementById('history').innerHTML += '<p>NEW: '+data+'</p>'
})

socket.on('move', function (data) {
	if(DEBUG) console.log('MOVE: ', data)
		document.getElementById('history').innerHTML += '<p>MOVE: '+data+'</p>'
})

window.onload = function () {
	if(DEBUG) document.getElementById('history').innerHTML += '<p>Socket: '+socket+'</p>'
}

game = {

	// Create new instance at server
	// server returns the instance id
	new: function () {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: new</p>'
		if(connection_ready) {
			socket.emit('new')
			other_player = 1 
		}
	},

	// Append you to existing game instance
	// You send to the server the instance id
	join: function (instanceId) {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: join</p>'
		if(connection_ready) {
			socket.emit('join', instanceId )

			instance = instanceId
			other_player = 0
		}
		if(DEBUG) console.log('JOIN: ', instance, other_player)
	},

	move: function (dataToSend) {
		if(DEBUG) document.getElementById('log').innerHTML += '<p>Click: move</p>'
		if(connection_ready) {
			socket.emit('move',{
				id: instance
				, py: other_player
				, data: dataToSend
			})
		}

	}
}