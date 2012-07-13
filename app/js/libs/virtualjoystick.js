(function(w, a, b, af, x, lastTime, v) {
    var c = "c" + a,
        C = "C" + a,
        r = "r" + b,
        R = "R" + b;

    for (; x < 4 && !w[r + af]; ++x) {
        w[r + af] = w[v[x] + R + af];
        w[c + af] = w[v[x] + C + af] || w[v[x] + C + R + af];
    }

    if (!w[r + af]) {
        w[r + af] = function(callback, element) {
            var currTime = +new Date(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = w.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!w[c + af]) {
        w[c + af] = function(id) {
            clearTimeout(id);
        };
    }
})(window, "ancel", "equest", "AnimationFrame", 0, 0, ["ms", "moz", "webkit", "o"]);


var VirtualJoystick	= function(opts)
{
	opts			= opts			|| {};
	this._container		= opts.container	|| document.body;
	this._stickEl		= opts.stickElement	|| this._buildJoystickStick();
	this._baseEl		= opts.baseElement	|| this._buildJoystickBase();
	this._mouseSupport	= 'mouseSupport' in opts? opts.mouseSupport	: false;
	this._range		= opts.range		|| 60;

	this._container.style.position	= "absolute";

	this._container.appendChild(this._baseEl);
	this._baseEl.style.position	= "absolute"
	this._baseEl.style.display	= "none";
	
	this._container.appendChild(this._stickEl);
	this._stickEl.style.position	= "absolute"
	this._stickEl.style.display	= "none";
	
	this._pressed	= false;
	this._baseX	= 0;
	this._baseY	= 0;
	this._stickX	= 0;
	this._stickY	= 0;

	__bind		= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	this._$onTouchStart	= __bind(this._onTouchStart	, this);
	this._$onTouchEnd	= __bind(this._onTouchEnd	, this);
	this._$onTouchMove	= __bind(this._onTouchMove	, this);
	this._container.addEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._container.addEventListener( 'touchend'	, this._$onTouchEnd	, false );
	this._container.addEventListener( 'touchmove'	, this._$onTouchMove	, false );
	if( this._mouseSupport ){
		this._$onMouseDown	= __bind(this._onMouseDown	, this);
		this._$onMouseUp	= __bind(this._onMouseUp	, this);
		this._$onMouseMove	= __bind(this._onMouseMove	, this);
		this._container.addEventListener( 'mousedown'	, this._$onMouseDown	, false );
		this._container.addEventListener( 'mouseup'	, this._$onMouseUp	, false );
		this._container.addEventListener( 'mousemove'	, this._$onMouseMove	, false );
	}
}

VirtualJoystick.prototype.destroy	= function()
{
	this._container.removeChild(this._baseEl);
	this._container.removeChild(this._stickEl);

	this._container.removeEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._container.removeEventListener( 'touchend'		, this._$onTouchEnd	, false );
	this._container.removeEventListener( 'touchmove'	, this._$onTouchMove	, false );
	if( this._mouseSupport ){
		this._container.removeEventListener( 'mouseup'		, this._$onMouseUp	, false );
		this._container.removeEventListener( 'mousedown'	, this._$onMouseDown	, false );
		this._container.removeEventListener( 'mousemove'	, this._$onMouseMove	, false );
	}
}

/**
 * @returns {Boolean} true if touchscreen is currently available, false otherwise
*/
VirtualJoystick.touchScreenAvailable	= function()
{
	return 'createTouch' in document ? true : false;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype.deltaX	= function(){ return this._stickX - this._baseX;	}
VirtualJoystick.prototype.deltaY	= function(){ return this._stickY - this._baseY;	}

VirtualJoystick.prototype.up	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY >= 0 )	return false;
	if( Math.abs(deltaY) < this._range && Math.abs(deltaY) < Math.abs(deltaX) ){
		return false;
	}
	return true;
}
VirtualJoystick.prototype.down	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY <= 0 )	return false;
	if( Math.abs(deltaY) < this._range && Math.abs(deltaY) < Math.abs(deltaX) ){
		return false;
	}
	return true;	
}
VirtualJoystick.prototype.right	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX <= 0 )	return false;
	if( Math.abs(deltaX) < this._range && Math.abs(deltaY) > Math.abs(deltaX) ){
		return false;
	}
	return true;	
}
VirtualJoystick.prototype.left	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX >= 0 )	return false;
	if( Math.abs(deltaX) < this._range && Math.abs(deltaY) > Math.abs(deltaX) ){
		return false;
	}
	return true;	
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

window.to_x = 0
window.to_y = 0
var reqAnim
VirtualJoystick.prototype._onUp	= function(x, y)
{

	cancelAnimationFrame(reqAnim)

	to_x = x - this._stickX
	to_y = y - this._stickY
	this._stickX	= x;
	this._stickY	= y;
	this._pressed	= false; 
	this._stickEl.style.display	= "none";
	this._baseEl.style.display	= "none";
	
	this._baseX	= this._baseY	= 0;
	this._stickX	= this._stickY	= 0;
}

VirtualJoystick.prototype._onDown	= function(x, y)
{
	console.log(x,y);
	this._pressed	= true; 
	this._baseX	= x;
	this._baseY	= y;
	this._stickX	= x;
	this._stickY	= y;

	this._stickEl.style.display	= "";
	this._stickEl.style.left	= (x - this._stickEl.width /2)+"px";
	this._stickEl.style.top		= (y - this._stickEl.height/2)+"px";

	this._baseEl.style.display	= "";
	this._baseEl.style.left		= (x - this._baseEl.width /2)+"px";
	this._baseEl.style.top		= (y - this._baseEl.height/2)+"px";
}

var animating_left = false
var animating_right = false
var animating_up = false
var animating_down = false
VirtualJoystick.prototype._onMove	= function(x, y)
{
	var loop = null
	if( this._pressed === true ){

		var self = this;
		//console.log(x - this._stickX, y - this._stickY)
		//caju_context.drawImage(character, 	x - this._stickX, y - this._stickY)

	/*caju_context.save()
	// move the origin to 50, 35   
	caju_context.translate(x - this._stickX + to_x, y - this._stickY + to_y)

	console.log(this.left())
	 
	 
	// then draw the image back and up
	caju_context.drawImage(character, 0 , 0)
	 
	// and restore the co-ordinate system to its default
	// top left origin with no rotation
	caju_context.restore()*/

	if(this.left()) {
		if(!animating_left) {
			cancelAnimationFrame(reqAnim)
			animating_right = false
			loop = function () {
				caju_context.translate(-1,0)
				caju_context.drawImage(character, 0 , 0)
				if(self._pressed) {
					animating_left = true
					requestAnimationFrame(loop)
				} else {
					animating_left = false
					cancelAnimationFrame(reqAnim)
				}
			}
			reqAnim = requestAnimationFrame(loop)
		}
	} else if(this.right()) {
		if(!animating_right) {
			cancelAnimationFrame(reqAnim)
			animating_left = false
			loop = function () {
				caju_context.translate(1,0)
				caju_context.drawImage(character, 0 , 0)
				if(self._pressed) {
					animating_right = true
					requestAnimationFrame(loop)
				} else {
					animating_right = false
					cancelAnimationFrame(reqAnim)
				}
			}
			reqAnim = requestAnimationFrame(loop)	
		}
	} /*else if(this.up()) {
		loop = function () {
			caju_context.translate(0,-1)
			caju_context.drawImage(character, 0 , 0)
			caju_context.clearRect ( x , y , 100 , 100)
			if(self._pressed) {
				animating = true
				requestAnimationFrame(loop)
			} else {
				animating = false
				cancelAnimationFrame(reqAnim)
			}
		}
		if(!animating) reqAnim = requestAnimationFrame(loop)	
		loop = function () {
			caju_context.translate(0,1)
			caju_context.drawImage(character, 0 , 0)
			caju_context.clearRect ( x , y , 100 , 100)
			if(self._pressed) {
				animating = true
				requestAnimationFrame(loop)
			} else {
				animating = false
				cancelAnimationFrame(reqAnim)
			}
		}
		if(!animating) reqAnim = requestAnimationFrame(loop)	
	}*/
	//cancelAnimationFrame(reqAnim)

		this._stickX	= x;
		this._stickY	= y;
		this._stickEl.style.left	= (x - this._stickEl.width /2)+"px";
		this._stickEl.style.top		= (y - this._stickEl.height/2)+"px";
	}
}


//////////////////////////////////////////////////////////////////////////////////
//		bind touch events (and mouse events for debug)			//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype._onMouseUp	= function(event)
{
	var x	= event.clientX;
	var y	= event.clientY;
	return this._onUp(x, y);
}

VirtualJoystick.prototype._onMouseDown	= function(event)
{
	var x	= event.clientX;
	var y	= event.clientY;
	return this._onDown(x, y);
}

VirtualJoystick.prototype._onMouseMove	= function(event)
{
	var x	= event.clientX;
	var y	= event.clientY;
	return this._onMove(x, y);
}

VirtualJoystick.prototype._onTouchStart	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	var x	= event.touches[ 0 ].pageX;
	var y	= event.touches[ 0 ].pageY;
	return this._onDown(x, y)
}

VirtualJoystick.prototype._onTouchEnd	= function(event)
{
//??????
// no preventDefault to get click event on ios
event.preventDefault();
	var x	= event.touches[ 0 ].pageX;
	var y	= event.touches[ 0 ].pageY;
	return this._onUp(x,y)
}

VirtualJoystick.prototype._onTouchMove	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	var x	= event.touches[ 0 ].pageX;
	var y	= event.touches[ 0 ].pageY;
	return this._onMove(x, y)
}


//////////////////////////////////////////////////////////////////////////////////
//		build default stickEl and baseEl				//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype._buildJoystickBase	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.width	= 126;
	canvas.height	= 126;
	
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle = "cyan"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();	

	ctx.beginPath(); 
	ctx.strokeStyle	= "cyan"; 
	ctx.lineWidth	= 2; 
	ctx.arc( canvas.width/2, canvas.width/2, 60, 0, Math.PI*2, true); 
	ctx.stroke();
	
	return canvas;
}

VirtualJoystick.prototype._buildJoystickStick	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.width	= 86;
	canvas.height	= 86;
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle	= "cyan"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();
	return canvas;
}

VirtualJoystick.prototype._buildJoystickButton	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.width	= 86;
	canvas.height	= 86;
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle	= "red"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();
	return canvas;
}