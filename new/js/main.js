Handlebars.registerHelper('str', function(text) {
  return text.replace(/ /g, "%20");
});

/*if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', callbackInit, false);
}*/

const DEBUG = false;
const TOUCH_LISTENER = true;
const CLICK_LISTENER = true;

const SOCKET_URL = "http://cajuws.juan.io:80";
//const SOCKET_URL = "http://127.0.0.1:5000";

// audio files
var bgAudio = document.getElementById("bgAudio");
var audio01 = document.getElementById("audio01");
var audio02 = document.getElementById("audio02");
var audio03 = document.getElementById("audio03");
var audio04 = document.getElementById("audio04");

var connection_ready = false;

var alone = false;

// Box2d vars
var b2Vec2 = Box2D.Common.Math.b2Vec2
	, b2AABB = Box2D.Collision.b2AABB
	, b2BodyDef = Box2D.Dynamics.b2BodyDef
	, b2Body = Box2D.Dynamics.b2Body
	, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	, b2Fixture = Box2D.Dynamics.b2Fixture
	, b2World = Box2D.Dynamics.b2World
	, b2MassData = Box2D.Collision.Shapes.b2MassData
	, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
	, b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
;


var scorePlayer01 = 0, scorePlayer02 = 0;
var enableScore = false;

var bodyPly01, bodyPly02, bodyBall;
var world;

/* var world = new b2World(
	   new b2Vec2(0, 0)    //gravity
	,  false                 //allow sleep
 );
 
 var fixDef = new b2FixtureDef;
 fixDef.density = 1.0;
 fixDef.friction = 0.5;
 fixDef.restitution = 0.9;
 
 var bodyDef = new b2BodyDef;
 
 //create ground
 bodyDef.type = b2Body.b2_staticBody;
 fixDef.shape = new b2PolygonShape;
 fixDef.shape.SetAsBox(30, 2);

 bodyDef.position.Set(10, 600 / 30 + 1.8);
 world.CreateBody(bodyDef).CreateFixture(fixDef);

 bodyDef.position.Set(10, -1.8);
 world.CreateBody(bodyDef).CreateFixture(fixDef);


 fixDef.shape.SetAsBox(2, 14);    

 bodyDef.position.Set(-310 / 30, 13);
 world.CreateBody(bodyDef).CreateFixture(fixDef);

 bodyDef.position.Set((1024 + 310) / 30 + 1.8, 13);
 world.CreateBody(bodyDef).CreateFixture(fixDef);
 */

 // helpers

 var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint, canvasPosition;

 var mouseXLeft, mouseYLeft, mouseXRight, mouseYRight, mouseJointLeft, mouseJointRight, isMouseDownLeft, isMouseDownRight;
 var selectedBodyLeft, selectedBodyRight;
 

function getBodyAtMouseRight() {
	var aabb = new b2AABB();
	mousePVec = new b2Vec2(mouseXRight, mouseYRight);
	aabb.lowerBound.Set(mouseXRight - 0.001, mouseYRight - 0.001);
	aabb.upperBound.Set(mouseXRight + 0.001, mouseYRight + 0.001);

	// Query the world for overlapping shapes.

	selectedBodyRight = null;
	world.QueryAABB(getBodyCBRight, aabb);
	return selectedBodyRight;
}


function getBodyAtMouseLeft() {
	var aabb = new b2AABB();
	mousePVec = new b2Vec2(mouseXLeft, mouseYLeft);
	aabb.lowerBound.Set(mouseXLeft - 0.001, mouseYLeft - 0.001);
	aabb.upperBound.Set(mouseXLeft + 0.001, mouseYLeft + 0.001);

	// Query the world for overlapping shapes.

	selectedBodyLeft = null;
	world.QueryAABB(getBodyCBLeft, aabb);
	return selectedBodyLeft
}


function getBodyCBLeft(fixture) {
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	   if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
		  selectedBodyLeft = fixture.GetBody();
		  return false;
	   }
	}
	return true;
}


function getBodyCBRight(fixture) {
	if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
	   if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
		  selectedBodyRight = fixture.GetBody();
		  return false;
	   }
	}
	return true;
}

//http://js-tut.aardon.de/js-tut/tutorial/position.html
function getElementPosition(element) {
	var elem=element, tagname="", x=0, y=0;

	while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
	   y += elem.offsetTop;
	   x += elem.offsetLeft;
	   tagname = elem.tagName.toUpperCase();

	   if(tagname == "BODY")
		  elem=0;

	   if(typeof(elem) == "object") {
		  if(typeof(elem.offsetParent) == "object")
			 elem = elem.offsetParent;
	   }
	}

	return {x: x, y: y};
}



/************************************
 * Game
 ************************************/

var time_1 = DEBUG ? 0: 1400;
var time_2 = DEBUG ? 0: 800;

var cancel = false;

var containerMain = $('.main');
var containerAside = $('.permanent');
var source;
var template;
var init;
var instance;
var stage;
var world;

const TOTAL_IMAGES = 2;
var loadedImages = 0;

var player_01 = new Image();
var player_02 = new Image();
var ball_01 = new Image();

var stageContainer = new Container();

// Data from localStorage
var cajuUser = DB.get("caju_name");
var cajuBadges = Badges.getAll();

// Data from localStorage
var cajuMusic = DB.get("caju_music");
if(!cajuMusic) {
	DB.save("caju_music", 1);
	cajuMusic = 1;
	bgAudio.play();
} else if(cajuMusic == 1) {
	bgAudio.play();	
} 
var cajuBadges = Badges.getAll();

// Templates

var templateJoin;
var templateWaiting;
var templateGame;
var templateProfile;
var templateAside;

window.del = function (element, callback) {
	//var element = $(selector);
	element.addClass("hide");
	setTimeout(function () {
		element.innerHTML = '';
		element.removeClass("hide");
		callback();
	}, time_2);
}

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var canvas,
	context,
	debugCanvas,
	debugContext;

function handleImageLoad(event) {
	var image = event.target;

	// create and populate the screen with random daisies:
	this.bitmap = new Bitmap(image);

	for(var option in this.options) {
		this.bitmap[option] = this.options[option];
	}

	this.bitmap.regX = this.bitmap.image.width/2|0;
	this.bitmap.regY = this.bitmap.image.height/2|0;

	loadedImages++;
	stageContainer.addChild(this.bitmap);

	finishedHandleImage();
}


/*function handleMouseMove(e) {
	e.preventDefault();
	mouseX = (e.clientX - canvasPosition.x) / 30;
	mouseY = (e.clientY - canvasPosition.y) / 30;
}

function handleMouseDown(e) {
	isMouseDown = true;
	handleMouseMove(e);
	document.addEventListener("mousemove", handleMouseMove, true);
}

function handleMouseUp(e) {
	document.removeEventListener("mousemove", handleMouseMove, true);
	isMouseDown = false;
	mouseX = null;
	mouseY = null;
}*/

function handleMouseMoveLeft(e) {
	e.preventDefault();
	mouseXLeft = (e.clientX - canvasPosition.x) / 30;
	mouseYLeft = (e.clientY - canvasPosition.y) / 30;
}

function handleMouseMoveRight(e) {
	e.preventDefault();
	mouseXRight = (e.clientX - canvasPosition.x) / 30;
	mouseYRight = (e.clientY - canvasPosition.y) / 30;
	//console.log(mouseXRight, mouseYRight);
}


function handleMouseDownLeft(e) {
	isMouseDownLeft = true;
	handleMouseMoveLeft(e);
	document.getElementById('handleLeft').addEventListener("mousemove", handleMouseMoveLeft, true);
}

function handleMouseUpLeft(e) {
	document.getElementById('handleLeft').removeEventListener("mousemove", handleMouseMoveLeft, true);
	isMouseDownLeft = false;
	mouseXLeft = null;
	mouseYLeft = null;
	/*mouseX = null;
	mouseY = null;*/	
}

function handleMouseDownRight(e) {
	isMouseDownRight = true;
	handleMouseMoveRight(e);
	document.getElementById('handleRight').addEventListener("mousemove", handleMouseMoveRight, true);
}

function handleMouseUpRight(e) {
	document.getElementById('handleRight').removeEventListener("mousemove", handleMouseMoveRight, true);
	isMouseDownRight = false;
	mouseXRight = null;
	mouseYRight = null;
	/*mouseX = null;
	mouseY = null;	*/	
}

/*function handleTouchMove(e) {
	e.preventDefault();
	mouseX = (e.touches[0].pageX - canvasPosition.x) / 30;
	mouseY = (e.touches[0].pageY - canvasPosition.y) / 30;
	
}

function handleTouchStart(e) {
	isMouseDown = true;
	handleTouchMove(e);
	document.addEventListener("touchmove", handleTouchMove, true);
}

function handleTouchEnd(e) {
	document.removeEventListener("touchmove", handleTouchMove, true);
	isMouseDown = false;
	mouseX = null;
	mouseY = null;
}*/

function handleTouchMoveLeft(e) {
	e.preventDefault();
	for(var i=0; i<e.touches.length; i++) {
		if(e.touches[i].pageX < 512) {
			//console.log('hi');
			mouseXLeft = (e.touches[i].pageX - canvasPosition.x) / 30;
			mouseYLeft = (e.touches[i].pageY - canvasPosition.y) / 30;
			/*mouseX = (e.touches[0].pageX - canvasPosition.x) / 30;
			mouseY = (e.touches[0].pageY - canvasPosition.y) / 30;		*/
		}
	}
}

function handleTouchMoveRight(e) {
	e.preventDefault();
	for(var i=0; i<e.touches.length; i++) {
		if(e.touches[i].pageX > 512) {
			//console.log('hi');
			mouseXRight = (e.touches[i].pageX - canvasPosition.x) / 30;
			mouseYRight = (e.touches[i].pageY - canvasPosition.y) / 30;
			/*mouseX = (e.touches[0].pageX - canvasPosition.x) / 30;
			mouseY = (e.touches[0].pageY - canvasPosition.y) / 30;		*/
		}
	}
}

function handleTouchStartLeft(e) {
	isMouseDownLeft = true;
	handleTouchMoveLeft(e);
	document.getElementById('handleLeft').addEventListener("touchmove", handleTouchMoveLeft, true);
}

function handleTouchEndLeft(e) {
	document.getElementById('handleLeft').removeEventListener("touchmove", handleTouchMoveLeft, true);
	isMouseDownLeft = false;
	mouseXLeft = null;
	mouseYLeft = null;
	/*mouseX = null;
	mouseY = null;*/	
}

function handleTouchStartRight(e) {
	isMouseDownRight = true;
	handleTouchMoveRight(e);
	document.getElementById('handleRight').addEventListener("touchmove", handleTouchMoveRight, true);
}

function handleTouchEndRight(e) {
	document.getElementById('handleRight').removeEventListener("touchmove", handleTouchMoveRight, true);
	isMouseDownRight = false;
	mouseXRight = null;
	mouseYRight = null;
	/*mouseX = null;
	mouseY = null;	*/	
}



// open browser bb
function openBrowser(url) {
	try {
		var args = new blackberry.invoke.BrowserArguments(url);
		blackberry.invoke.invoke(blackberry.invoke.APP_BROWSER, args);
	} catch (e) {
		//debug.log("openBrowser", e, debug.exception);
		console.log('GOTO: ',url);
	}
}


function handleMenuGoBack() {
	this.parentElement.querySelectorAll('li').removeClass('active');
	this.addClass('active');
	init();
	
}




function finishedHandleImage () {
	//if(DEBUG) console.log(loadedImages, TOTAL_IMAGES);
	if(loadedImages == TOTAL_IMAGES) {

		stage.snapPixelsEnabled = true;

		Ticker.setFPS(30);
		Ticker.useRAF = true;
		Ticker.addListener(window);

		// enable touch interactions if supported on the current device:
		Touch.enable(stage);

		// enabled mouse over / out events
		stage.enableMouseOver(10);
		//stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
		stage.addChild(stageContainer);
		cancel = false;

		setTimeout(function () {
			//containerMain.addClass("finished");*
			// 3
			document.getElementById("time-3").className += ' active';
			setTimeout(function() {
				// 2
				//document.getElementById("time-3").className = 'time';
				document.getElementById("time-3").style.display = 'none';
				document.getElementById("time-2").className += ' active';
				setTimeout(function() {
					//1
					//document.getElementById("time-2").className = 'time';
					document.getElementById("time-2").style.display = 'none';
					document.getElementById("time-1").className += ' active';
					setTimeout(function() {
						//document.getElementById("time-1").className = 'time';
						document.getElementById("time-1").style.display = 'none';
						var winner = document.getElementById("winner");
						if(scorePlayer01 > scorePlayer02) {
							winner.innerText = cajuUser + ' won!';
						} else if(scorePlayer01 < scorePlayer02) {
							winner.innerText = 'your friend won!';
						} else {
							winner.innerText = 'no one won, dead heat';
						}
						if(CLICK_LISTENER) {
							/*document.addEventListener("mousedown", handleMouseDown, true);
							document.addEventListener("mouseup", handleMouseUp, true);*/

							document.getElementById('handleLeft').removeEventListener('mousedown', handleMouseDownLeft, true);
							document.getElementById('handleLeft').removeEventListener('mouseup', handleMouseUpLeft, true);

							document.getElementById('handleRight').removeEventListener('mousedown', handleMouseDownRight, true);
							document.getElementById('handleRight').removeEventListener('mouseup', handleMouseUpRight, true);			
						}

						if(TOUCH_LISTENER) {
							/*document.removeEventListener("touchstart", handleTouchStart, true);
							document.removeEventListener("touchend", handleTouchEnd, true);*/
							document.getElementById('handleLeft').removeEventListener('touchstart', handleTouchStartLeft, true);
							document.getElementById('handleLeft').removeEventListener('touchend', handleTouchEndLeft, true);

							document.getElementById('handleRight').removeEventListener('touchstart', handleTouchStartRight, true);
							document.getElementById('handleRight').removeEventListener('touchend', handleTouchEndRight, true);
						}
						Ticker.removeAllListeners();
						cancel = true;
						containerMain.addClass("finished");
					},1000);
				},1000);
			},1000);
		}, 1000 * 60 * 1); // 2 minutes
	}
}
// GAME DEFINITION
var game = {

	//BUTTON FUNCTIONS
	play: function () {
		/*if(typeof blackberry == "undefined") {
			//webrtc
			if(DEBUG) console.log("TODO: webrtc");
		} else {
			blackberry.launch.launchCamera();
		}*/
		//if(DEBUG) console.log('Click: new');
		if(connection_ready) {
			socket.emit('new', cajuUser);
			other_player = 2
		}					
	},
	join: function () {
		del(containerMain, function () {
			containerMain.innerHTML = templateJoin();
			document.body.className = "join";

			var goBack = containerMain.querySelector('.go-back');

			if(TOUCH_LISTENER) {
				goBack.addEventListener('touch', handleMenuGoBack);
			}

			if(CLICK_LISTENER) {
				goBack.addEventListener('click', handleMenuGoBack);
			}

			var anchor = containerMain.querySelector('a');

			function joinGame () {
				var instanceId = this.parentElement.querySelector("input").value;
				if(instanceId) {
					socket.emit('join', {instanceId:instanceId, player:cajuUser});

					instance = instanceId;
					other_player = 1;
				} else {
					var self = this;
					self.parentElement.addClass("error");
					setTimeout(function () {
						self.parentElement.removeClass("error");
					}, 700);
				}
			}
			
			anchor.addEventListener('click', joinGame);
			anchor.addEventListener('touch', joinGame);

		});
	},

	playAlone: function () {
		containerMain.removeClass("finished");
		//console.log("CALLED PLAY ALONE");
		other_player = 2;
		alone = true;
		game.start("FRIEND");
	},

	showProfile: function () {
		del(containerMain, function () {
			containerMain.innerHTML = templateProfile({
				user: cajuUser,
				badges: cajuBadges,
				music: function () {
					if(cajuMusic == 1) {
						return true;
					} else {
						return false;
					}
				},
				stats: {
					online: {
						won: 1,
						lost: 1,
						dead: 1,
						total: 1
					},
					face: {
						won: 1,
						lost: 1,
						dead: 1,
						total: 1						
					}
				}
			});

			//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="http://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

			//var mainMenu = containerMain.querySelectorAll("nav li");

			var tweetButtons = containerMain.querySelectorAll(".tweet-button");

			var musicButton = containerMain.querySelector(".music-button");

			musicButton.addEventListener('click', function () {
				if(cajuMusic == 1) {
					DB.save('caju_music', -1);
					cajuMusic = -1;
					bgAudio.pause();
					this.innerText = 'active music';
				} else {
					DB.save('caju_music', 1);
					cajuMusic = 1;
					bgAudio.play();
					this.innerText = 'disable music';
				}
			});

			for(var i=0; i<tweetButtons.length; i++) {
				tweetButtons[i].addEventListener('click', function (e) {
					e.preventDefault();
					if (e.stopPropagation) e.stopPropagation();
					openBrowser(this.getAttribute('href'));
				});
			}

			function handleMenuBadges() {
				document.querySelector('.options').style.display = 'none';
				this.parentElement.querySelectorAll('li').removeClass('active');
				this.addClass('active');
				document.querySelector('.badges').removeClass('to-left');
				document.querySelector('.options').removeClass('to-left');
				document.querySelector('.stats').removeClass('to-left');
			}

			function handleMenuStats() {
				this.parentElement.querySelectorAll('li').removeClass('active');
				this.addClass('active');
				document.querySelector('.badges').addClass('to-left');
				document.querySelector('.options').removeClass('to-left');
				document.querySelector('.stats').removeClass('to-left');
				setTimeout(function () {
					document.querySelector('.stats').style.display = 'inline-block';
				}, 300);
			}

			function handleMenuOptions() {
				this.parentElement.querySelectorAll('li').removeClass('active');
				this.addClass('active');
				document.querySelector('.badges').addClass('to-left');
				document.querySelector('.stats').addClass('to-left');
				document.querySelector('.options').removeClass('to-left');
				setTimeout(function () {
					document.querySelector('.options').style.display = 'inline-block';
				}, 300);
			}


			if(TOUCH_LISTENER) {
				containerMain.querySelector('.li-badges').addEventListener('touch', handleMenuBadges);
				containerMain.querySelector('.li-options').addEventListener('touch', handleMenuOptions);
				containerMain.querySelector('.li-stats').addEventListener('touch', handleMenuStats);
				containerMain.querySelector('.li-go-back').addEventListener('touch', handleMenuGoBack);
			}


			if(CLICK_LISTENER) {
				containerMain.querySelector('.li-badges').addEventListener('click', handleMenuBadges);
				containerMain.querySelector('.li-options').addEventListener('click', handleMenuOptions);
				containerMain.querySelector('.li-stats').addEventListener('click', handleMenuStats);
				containerMain.querySelector('.li-go-back').addEventListener('click', handleMenuGoBack);
			}

			/*var data = {
			  items: [{label: 'September posts', data: 12015},
			  {label: 'October posts', data: 23834},
			  {label: 'November posts', data: 24689}]
			};			

			var bluffGraph = new Bluff.Pie('onlineGraph', '200x200');
			//Use keynote theme. Several other themes can be used
			  //bluffGraph.theme_keynote();
			  //bluffGraph.title = 'Number of posts';

			  for (i in data.items) {
			    var item = data.items[i];
			    //Add each data item to pie
			    bluffGraph.data(item.label, item.data);
			  }

			  bluffGraph.hide_title = true;
			  bluffGraph.hide_legend = true;
			  bluffGraph.hide_line_numbers = true;
			  bluffGraph.hide_line_markers = true;
			  bluffGraph.hide_mini_legend = true;
			  bluffGraph.hide_dots = true;
			  bluffGraph.hide_labels_less_than = 100;

			bluffGraph.set_theme({
			    colors: ['#202020', 'white', '#a21764', '#8ab438',
			             '#999999', '#3a5b87', 'black'],
			    marker_color: '#aea9a9'
			    //background_colors: ['#D7576C', '#D7576C']
			  });			  
			  //Finally draw the chart
			  bluffGraph.draw();	*/				
			var anchor = containerMain.querySelector('.options a');

			if(TOUCH_LISTENER) {
				anchor.addEventListener('touch', function () {
					var inputValue = this.parentElement.querySelector("input").value;
					if(game.save(inputValue)) {
						init();	
					} else {
						var self = this;
						self.parentElement.addClass("error");
						setTimeout(function () {
							self.parentElement.removeClass("error");
						}, 700);
					}
				});
			}

			if(CLICK_LISTENER) {
				anchor.addEventListener('click', function () {
					var inputValue = this.parentElement.querySelector("input").value;
					if(game.save(inputValue)) {
						init();	
					} else {
						var self = this;
						self.parentElement.addClass("error");
						setTimeout(function () {
							self.parentElement.removeClass("error");
						}, 700);
					}
				});
			}

			/*var badges = containerMain.querySelectorAll(".badge");
			var badge = null;
			for(var i=0, len=badges.length; i<len; i++) {
				badge = badges[i];
				badge.addEventListener('click', function () {
					if(this.hasClass('active')) {
						this.removeClass('active');
					} else {
						badges.removeClass('active');
						this.addClass('active');
					}
				});
			}*/
			document.body.className = "profile";
		});
	},

	save: function (inputValue) {
		if(inputValue) {
			cajuUser = inputValue;
			DB.save('caju_name', cajuUser);
			return true;
		}
		return false;
	},

	// GAME FUNCTIONS
	wait: function (id) {
		del(containerMain, function () {
			containerMain.innerHTML = templateWaiting({id:id});
			document.body.className = "waiting";
		});
	},

	start: function (enemy) {

		//
		bgAudio.pause();

		/*bgAudio.addEventListener('ended', function() {
			bgAudio.play();
			this.currentTime = 0;
		}, false);*/


		loadedImages = 0;
		scorePlayer01 = 0;
		scorePlayer02 = 0;


		world = new b2World(
			   new b2Vec2(0, 0)    //gravity
			,  false                 //allow sleep
		);
		 
		var fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.9;
		 
		var bodyDef = new b2BodyDef;
		 
		//create ground
		bodyDef.type = b2Body.b2_staticBody;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(30, 2);

		bodyDef.position.Set(10, 600 / 30 + 1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);

		bodyDef.position.Set(10, -1.8);
		world.CreateBody(bodyDef).CreateFixture(fixDef);


		fixDef.shape.SetAsBox(2, 14);    

		bodyDef.position.Set(-310 / 30, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);

		bodyDef.position.Set((1024 + 310) / 30 + 1.8, 13);
		world.CreateBody(bodyDef).CreateFixture(fixDef);

		//containerMain.innerHTML = templateGame({player:cajuUser});
		containerMain.innerHTML = templateGame({player:cajuUser, enemy:enemy, alone: alone});
		document.body.className = "game";
		document.querySelector('.ball').style.display = 'none';

		/*if(CLICK_LISTENER) {
			document.removeEventListener("mousedown", handleMouseDown, true);
			document.removeEventListener("mouseup", handleMouseUp, true);
		}

		if(TOUCH_LISTENER) {
			document.removeEventListener("touchstart", handleTouchStart, true);
			document.removeEventListener("touchend", handleTouchEnd, true);
		}*/	

		var li = containerMain.querySelectorAll('li');

		//Listener
		if(TOUCH_LISTENER) {
			if(li.length == 2) {
				li[0].addEventListener('touch', game.playAlone);
				li[1].addEventListener('touch', init);
			} else {
				li[0].addEventListener('touch', init);
			}
		}

		if(CLICK_LISTENER) {
			if(li.length == 2) {
				li[0].addEventListener('click', game.playAlone);
				li[1].addEventListener('click', init);
			} else {
				li[0].addEventListener('click', init);
			}
		}

		//Canvas work
		canvas = $('#canvas');
		context = canvas.getContext("2d");

		debugCanvas = $('#debugCanvas');
		debugContext = debugCanvas.getContext("2d");

		canvas.width = 1024;
		canvas.height = 600;


		if(other_player === 2) { // It's player 1 (clicked new)!!
			 // BEGIN BALL
			 bodyDef.type = b2Body.b2_dynamicBody;
			 fixDef.shape = new b2CircleShape(50/30);

			 bodyDef.position.x = (1024/2 + 300)/30;
			 bodyDef.position.y = (600/2)/30;
			 bodyDef.userData = 0;
			 //world.CreateBody(bodyDef).CreateFixture(fixDef);
			 bodyBall = world.CreateBody(bodyDef);
			 bodyBall.CreateFixture(fixDef);
			 //bodyBall.SetLinearVelocity(new b2Vec2(3,0));
			 // END BALL
		}

		bodyDef.type = b2Body.b2_dynamicBody;
		//bodyDef.angularDamping = 3;
		bodyDef.fixedRotation = true;
		fixDef.restitution = 1.0;

		// BEGIN PLAYER01
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(356/60,160/60);
		bodyDef.position.x = 1100/30;
		bodyDef.position.y = 310/30;
		bodyDef.userData = 1;
		bodyPly01 = world.CreateBody(bodyDef);
		bodyPly01.CreateFixture(fixDef);
		//bodyPly01.SetLinearVelocity(new b2Vec2(3,0));
		// END PLAYER01


		// BEGIN PLAYER02
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(356/60,160/60);
		bodyDef.position.x = -80/30;
		bodyDef.position.y = 310/30;
		bodyDef.userData = 2;
		bodyPly02 = world.CreateBody(bodyDef);
		bodyPly02.CreateFixture(fixDef);
		//bodyPly02.SetLinearVelocity(new b2Vec2(-10,0));
		// END PLAYER02


		/*var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(debugContext);
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);*/


		canvasPosition = getElementPosition(document.getElementById("canvas"));
		stage = new Stage(canvas);
		stageContainer = new Container();

		if(CLICK_LISTENER) {
			/*document.addEventListener("mousedown", handleMouseDown, true);
			document.addEventListener("mouseup", handleMouseUp, true);*/

			document.getElementById('handleLeft').addEventListener('mousedown', handleMouseDownLeft, true);
			document.getElementById('handleLeft').addEventListener('mouseup', handleMouseUpLeft, true);

			document.getElementById('handleRight').addEventListener('mousedown', handleMouseDownRight, true);
			document.getElementById('handleRight').addEventListener('mouseup', handleMouseUpRight, true);			
		}

		if(TOUCH_LISTENER) {
			/*document.addEventListener("touchstart", handleTouchStart, true);
			document.addEventListener("touchend", handleTouchEnd, true);*/
			document.getElementById('handleLeft').addEventListener('touchstart', handleTouchStartLeft, true);
			document.getElementById('handleLeft').addEventListener('touchend', handleTouchEndLeft, true);

			document.getElementById('handleRight').addEventListener('touchstart', handleTouchStartRight, true);
			document.getElementById('handleRight').addEventListener('touchend', handleTouchEndRight, true);
		}

		//if(DEBUG) console.log("PRE LOAD IMAGES");

		ball_01 = new Image();
		player_01 = new Image();
		player_02 = new Image();
		// BALL
		ball_01.onload = function (event) {
			var image = event.target;
			this.bitmap = new Bitmap(image);

			this.bitmap.x = canvas.width/2|0 + 300;
			this.bitmap.y = canvas.height/2|0;
			this.bitmap.regX = this.bitmap.image.width/2|0;
			this.bitmap.regY = this.bitmap.image.height/2|0;

			stageContainer.addChild(this.bitmap);
			update = true;
			finishedHandleImage();
		};

		ball_01.src = "img/ball.png";

		// PLAYERS
		player_01.options = {
			  x: 1100
			, y: 310
			, rotation: 90
		}
		player_01.onload = handleImageLoad;
		player_01.name = 1;
		player_01.src = "img/player_01.png";


		player_02.options = {
			  x: -80
			, y: 280
			, rotation: -90
		}
		player_02.onload = handleImageLoad;
		player_02.name = 0;
		player_02.src = "img/player_02.png";

	}
}


init = function() {
	if(cajuUser) {
		source  = $("#section-intro").innerHTML;
	} else {
		source  = $("#section-welcome").innerHTML;
	}

	template = Handlebars.compile(source);

	setTimeout(function () {
		del(containerMain, function () {
			// show the ball
			document.querySelector('.ball').style.display = '';

			if(cajuUser) { // rendering intro section
				containerMain.innerHTML = template();
				containerAside.innerHTML = templateAside({user:cajuUser});

				// user action
				var userLink = containerAside.querySelector("aside div");

				var li = containerMain.querySelectorAll('li');
				var other = containerMain.querySelector('.other');

				if(TOUCH_LISTENER) {
					li[0].addEventListener('touch', game.play);
					li[1].addEventListener('touch', game.join);

					other.addEventListener('touch', game.playAlone);

					userLink.addEventListener('touch', game.showProfile);
				}

				if(CLICK_LISTENER) {
					li[0].addEventListener('click', game.play);
					li[1].addEventListener('click', game.join);

					other.addEventListener('click', game.playAlone);

					userLink.addEventListener('click', game.showProfile);
				}

				document.body.className = "intro";

			} else { //rendering welcome section
				containerMain.innerHTML = template();
				var anchor = containerMain.querySelector('a');

				if(TOUCH_LISTENER) {
					anchor.addEventListener('touch', function () {
						var inputValue = this.parentElement.querySelector("input").value;
						if(game.save(inputValue)) {
							init();	
						} else {
							var self = this;
							self.parentElement.addClass("error");
							setTimeout(function () {
								self.parentElement.removeClass("error");
							}, 700);
						}
					});
				}

				if(CLICK_LISTENER) {
					anchor.addEventListener('click', function () {
						var inputValue = this.parentElement.querySelector("input").value;
						if(game.save(inputValue)) {
							init();	
						} else {
							var self = this;
							self.parentElement.addClass("error");
							setTimeout(function () {
								self.parentElement.removeClass("error");
							}, 700);
						}
					});
				}

				document.body.className = "welcome";
			}
		});
	}, time_1);
};

function tick() {
	if(cancel) return;
	else {
		var bLeft = getBodyAtMouseLeft();
		var bRight = getBodyAtMouseRight();

		if(bLeft && (alone || other_player === 1)) {
			var typeLeft = bLeft.GetUserData();

			if(isMouseDownLeft && !mouseJointLeft) {
				var md = new b2MouseJointDef();
				md.bodyA = world.GetGroundBody();
				md.bodyB = bLeft;
				md.target.Set(mouseXLeft, mouseYLeft);
				//console.log('b: player 2');
				md.collideConnected = true;
				md.maxForce = 300.0 * bLeft.GetMass();
				mouseJointLeft = world.CreateJoint(md);
				//if(!alone) socket.emit('jointLeft', JSON.decycle(md));
				//mouseJointRight = world.CreateJoint(md);
				bLeft.SetAwake(true);
			}
		}

		if(mouseJointLeft) {
			if(isMouseDownLeft) {
				mouseJointLeft.SetTarget(new b2Vec2(mouseXLeft, mouseYLeft));
			} else {
				world.DestroyJoint(mouseJointLeft);
				mouseJointLeft = null;
			}
		}

		if(bRight && (alone || other_player === 2)) {
			var typeRight = bRight.GetUserData();

			if(isMouseDownRight && !mouseJointRight) {
				var md = new b2MouseJointDef();
				//console.log(md);
				md.bodyA = world.GetGroundBody();
				md.bodyB = bRight;
				md.target.Set(mouseXRight, mouseYRight);
				//console.log('b: player 2');
				md.collideConnected = true;
				md.maxForce = 300.0 * bRight.GetMass();
				mouseJointRight = world.CreateJoint(md);
				//if(!alone) socket.emit('jointRight', JSON.decycle(md));
				//mouseJointLeft = mouseJointRight;
				bRight.SetAwake(true);
			}
		}

		if(mouseJointRight) {
			if(isMouseDownRight) {
				mouseJointRight.SetTarget(new b2Vec2(mouseXRight, mouseYRight));
			} else {
				world.DestroyJoint(mouseJointRight);
				mouseJointRight = null;
			}
		}

		world.Step(1 / 60, 10, 10);
		//if(DEBUG) world.DrawDebugData();
		world.ClearForces();

		for (b = world.GetBodyList() ; b; b = b.GetNext()) {
			var type = b.GetUserData();
			var pos = b.GetPosition();

			//ball
			if (type === 0) {
				ball_01.bitmap.x = pos.x * 30;
				ball_01.bitmap.y = pos.y * 30;
				ball_01.bitmap.rotation = b.GetAngle()*57.2;

				socket.emit('ball', {
					x: pos.x,
					y: pos.y,
					rotation: b.GetAngle()
				});

				if(ball_01.bitmap.x > 4 && ball_01.bitmap.x < 1020) {
					enableScore = true;
				} else if(enableScore) {
					if(ball_01.bitmap.x <= 4) {
						audio01.play();
						scorePlayer01++;
						document.getElementById("scorePlayer").innerText = scorePlayer01;
						bodyBall.SetAwake(false);
						bodyBall.SetPosition(new b2Vec2((canvas.width/2 - 300)/30, canvas.height/60));
						//init();
					} else if(ball_01.bitmap.x >= 1020) {
						audio02.play();
						scorePlayer02++;
						document.getElementById("scoreEnemy").innerText = scorePlayer02;
						bodyBall.SetAwake(false);
						bodyBall.SetPosition(new b2Vec2((canvas.width/2 + 300)/30, canvas.height/60));
						//init();
					}
					enableScore = false;
				}
			} else if(type === 1) {
				player_01.bitmap.y = pos.y * 30;
				if(pos.x*30 < 900) {
					bodyPly01.SetAwake(false);
					bodyPly01.SetPosition(new b2Vec2(player_01.bitmap.x/30, player_01.bitmap.y/30));
				} else {
					player_01.bitmap.x = pos.x * 30;
				}
				if(other_player === 2) {
					socket.emit('move', {x:player_01.bitmap.x/30, y:player_01.bitmap.y/30});
				}
			} else if(type === 2) {
				player_02.bitmap.y = pos.y * 30;
				if(pos.x*30 > 124) {
					bodyPly02.SetAwake(false);
					bodyPly02.SetPosition(new b2Vec2(player_02.bitmap.x/30, player_02.bitmap.y/30));
				} else {
					player_02.bitmap.x = pos.x * 30;
				}
				if(other_player === 1) {
					socket.emit('move', {x:player_02.bitmap.x/30, y:player_02.bitmap.y/30});
				}
			}
		}

		stage.update();
	}
	/*if (update) {
		update = false; // only update once
	}*/
}


/************************************
 * Socket
 ************************************/

function callbackInit() {

	/************************************
	 * Ball
	 ************************************/

	var ball = $(".ball");
	var moving = false;
	var initialX, initialY;

	function move_ball (e) {

		e.preventDefault();

		var x = e.x || e.offsetX || (e.pageX - ball.offsetLeft);
		var y = e.y || e.offsetY || (e.pageY - ball.offsetTop);
		if(moving) {
			if(y > 0 && y < (window.innerHeight - 40)) {
				ball.style.top = parseInt(ball.style.top) + (y-initialY) +"px";	
			}
			if(x > 0 && x < (window.innerWidth - 40)) {
				ball.style.left = parseInt(ball.style.left) + (x-initialX) +"px";	
			}
			initialX = x;
			initialY = y;
		}
	}

	window.addEventListener("devicemotion", function(event) {
		if(window.orientation == 90) {
			var x = parseInt(ball.style.left) - event.accelerationIncludingGravity.y;
			var y = parseInt(ball.style.top) - event.accelerationIncludingGravity.x;

			if(x > 0 && x < (window.innerWidth - 40)) ball.style.left =  x + 'px'; 
			if(y > 0 && y < (window.innerHeight - 40)) ball.style.top = y + 'px';            		
		} else if(window.orientation == -90) {
			var x = parseInt(ball.style.left) + event.accelerationIncludingGravity.y;
			var y = parseInt(ball.style.top) + event.accelerationIncludingGravity.x;

			if(x > 0 && x < (window.innerWidth - 40)) ball.style.left =  x + 'px'; 
			if(y > 0 && y < (window.innerHeight - 40)) ball.style.top = y + 'px';       
		}
	}, true);

	if(TOUCH_LISTENER) {

		window.addEventListener("touchend", function () {
			document.body.removeClass("no-select");
			moving = false;
		}, false);

		ball.addEventListener("touchstart", function (e) {
			initialX = e.x || e.offsetX || (e.pageX - ball.offsetLeft);
			initialY = e.y || e.offsetY || (e.pageY - ball.offsetTop);;
			document.body.addClass("no-select");
			moving = true;
		}, false);

	}

	if(CLICK_LISTENER) {

		window.addEventListener("mousemove", move_ball, false);

		window.addEventListener("mouseup", function () {
			document.body.removeClass("no-select");
			moving = false;
		}, false);


		ball.addEventListener("mousedown", function (e) {
			initialX = e.x || e.offsetX || (e.pageX - ball.offsetLeft);
			initialY = e.y || e.offsetY || (e.pageY - ball.offsetTop);
			document.body.addClass("no-select");
			moving = true;
		}, false);
	}

	templateJoin = Handlebars.compile(document.getElementById('section-join').innerHTML);
	templateWaiting = Handlebars.compile(document.getElementById('section-waiting').innerHTML);
	templateGame = Handlebars.compile(document.getElementById('section-game').innerHTML);
	templateProfile = Handlebars.compile(document.getElementById('section-profile').innerHTML);
	templateAside = Handlebars.compile(document.getElementById('aside-user').innerHTML);

	if(typeof io !== "undefined") {

		socket = io.connect(SOCKET_URL, {
			'reconnect': true
			, 'reconnection delay': 500
			, 'max reconnection attempts': 5
		});

		socket.on('connect', function () {
			connection_ready = true;
			init();
			//if(DEBUG) console.log('OPEN');
		});

		socket.on('join', function (data) {
			//other_player = 1;
			if(!data) {
				var div = $('.main div');
				div.addClass("error");
				setTimeout(function () {
					div.removeClass("error");
				}, 700);
			}
		});

		socket.on('new', function (data) {
			//console.log(data);
			game.wait(data.id);
		});

		/*socket.on('jointRight', function (data) {
			mouseJointRight = world.CreateJoint(data);
		});

		socket.on('jointLeft', function (data) {
			mouseJointLeft = world.CreateJoint(data);
		});*/

		socket.on('move', function (data) {
			if(data) {
				if(other_player === 2) {
					bodyPly02.SetPosition(new b2Vec2(data.x, data.y));
				} else {
					bodyPly01.SetPosition(new b2Vec2(data.x, data.y));
				}
			}
		});

		socket.on('ball', function (data) {
			ball_01.bitmap.x = data.x*30;
			ball_01.bitmap.y = data.y*30;
			ball_01.bitmap.rotation = data.rotation*57.2;
		});


		socket.on('bye', function (data) {
			cancel = true;
			containerMain.addClass("no-active");
		});				

		socket.on('ready', function (enemy) {
			cancel = false;
			del(containerMain, function () {
				alone = false;
				game.start(enemy);
			});
		});
	}

}


callbackInit();