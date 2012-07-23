

/**
 * Basic rectangle class with intersection
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */

(function(window) {
	
	/**
	 * Constructor
	 */
	function Rectangle(left,top,width,height) {
	  this.initialize(left,top,width,height);
	}
	var p = Rectangle.prototype =  new Object();
	
	p.left = 0;
	p.top = 0;
	p.x = 0;
	p.y = 0;
	p.width = 0;
	p.height = 0;
	p.ending = true;
	
		
	/**
	 * Initialize ForeGround
	 */	
	p.initialize = function(left,top,width,height) {
		if(left!=null)this.left = this.x = left;
		if(top!=null)this.top = this.y = top;
		if(width!=null)this.width = width;
		if(height!=null)this.height = height;
	}
	
	/**
	 * Force number output
	 */	
	p.reqNum = function (num) {
	    return Number.from(num);
	}
	
	
	/**
	 * Get intersection of this rectangle and another
	 */	
	
	p.getIntersection = function(rect){		
		var a = this, b = rect;
		var x = Math.max(a.getLeft(), b.getLeft());
		var num2 = Math.min(a.getLeft() + a.getWidth(), b.getLeft() + b.getWidth());
		var y = Math.max(a.getTop(), b.getTop());
		var num4 = Math.min(a.getTop() + a.getHeight(), b.getTop() + b.getHeight());
		
		if ((num2 >= x) && (num4 >= y)) {
			//return true
		    return new Rectangle(x, y, num2 - x, num4 - y);
		}
		return false;
	}
	
	p.getLeft   = function(){return this.left};
	p.getTop    = function(){return this.top;};
	p.getWidth  = function(){return this.width;};
	p.getHeight = function(){return this.height;};
	p.getRight  = function(){return this.getLeft() + this.getWidth()};
	p.getBottom = function(){return this.getTop() + this.getHeight()};
	p.getSize   = function(){return this.getWidth() * this.getHeight()};
	p.isEmpty   = function(){return this.getSize() === 0};  
	
window.Rectangle = Rectangle;
}(window));

/**
 * Guard instance use to display a guard character on the scene.
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 (function(window) {
	function Guard(__x,__y,__patrolMinX,__patrolMaxX,__minX, __maxX) {
	  this.initialize(__x,__y,__patrolMinX,__patrolMaxX,__minX, __maxX);
	}
	var p = Guard.prototype = new BitmapAnimation();
			Guard.prototype.guardSpriteSheet  = new SpriteSheet({
				"images": ["assets/img/characters/enemy_robot_0.png", "assets/img/characters/enemy_robot_1.png"], 
				"animations": {"Walk": [1, 20,true], "Hit": [21, 40,"Stunned"], "Stunned": [41, 70,true], "Stand": [0, 0,false], "Seek": [71, 99]}, 
				"frames": {"regX": 0, "width": 206, "regY": 0, "height": 323, "count": 100}
			});	
	
	// public properties:
		/**
		 * Interrogation mark displayed when guard discover the player
		 * @type Number
		 * @default 15
		 **/
		 p.interrogationMark - null;
		/**
		 * Speed of the guard walking stance,
		 * @type Number
		 * @default 15
		 **/
		p.speed = 8;
		/**
		 * Direction of the guard,
		 * @type Number
		 * @default 15
		 **/
		p.direction = 1;
		/**
		 * Minimum X value of the guard,
		 * @type Number
		 * @default 15
		 **/
		p.minX = 0;
		/**
		 * Maximum X value of the guard,
		 * @type Number
		 * @default 15
		 **/
		p.maxX = 0;
		/**
		 * Minimum X when guard is patrolling
		 * @type Number
		 * @default 15
		 **/
		p.patrolMinX = 0;
		
		/**
		 * Maximum X when guard is patrolling
		 * @type Number
		 * @default 15
		 **/
		p.patrolMaxX = 0
		/**
		 * Stand delay,
		 * @type Number
		 * @default 30
		 **/
		p.standDelay = 30;
		/**
		 * Guard width,
		 * @type Number
		 * @default 0
		 **/
		p.width = 0;
		/**
		 * Guard height,
		 * @type Number
		 * @default 0
		 **/
		p.height = 0;
		/**
		 * Tell if guards need to pause its routine,
		 * @type Number
		 * @default 0
		 **/
		p.walkPaused =  false;
		/**
		 * Tell if guard found a character
		 * @type Number
		 * @default 0
		 **/
		p.isCharacterFound = false;
		/**
		 * Tell if guard is stunned
		 * @type Number
		 * @default 0
		 **/
		p.isStunned = false;
		/**
		 * Tell if guard is standing
		 * @type Number
		 * @default 0
		 **/
		p.standing = false;
		
	
		
	// constructor:
		/**
		 * @property BitmapAnimation_initialize
		 * @type Function
		 * @private
		 **/
		p.BitmapAnimation_initialize = p.initialize;
	
		/**
		 * Initialization method.
		 * @method initialize
		 * @protected
		*/
		p.initialize = function(__x,__y,__patrolMinX,__patrolMaxX,__minX, __maxX) {
			
			
			
		
			this.BitmapAnimation_initialize(this.guardSpriteSheet);
			
			this.width  = 206;
			this.height = 323;
			this.minX = __minX;
			this.maxX = __maxX;
			this.patrolMinX = __patrolMinX;
			this.patrolMaxX = __patrolMaxX;
			this.x = __x;
			this.y = __y;
			this.interrogationMark = new Bitmap("assets/img/characters/interogation.png");
			
			var startDirection = Math.random()*2-1;
			
			if(startDirection<0&& startDirection>-1)this.direction = -1;
			this.gotoAndPlay("Walk");
		}
	
	
		/**
		 * Ticked every friend.
		 * @method initialize
		 * @protected
		*/
		p.tick = function(){
			if(!this.walkPaused && this.standing!=true){
				if(this.direction>0){
				
					if(this.scaleX<0){
						this.scaleX = 1;
						this.x -= this.width/2;
					}
					
					if(this.x>this.patrolMaxX && !this.isCharacterFound){
						this.gotoAndPlay("Stand");
						this.standDelay --;
						if(this.standDelay <=0){
							this.standDelay = 30;
							this.direction  = -1;
							this.gotoAndPlay("Walk");
							this.scaleX = -1;
							this.x += this.width/2;
						}
					}else if(this.x<this.maxX){
						if(this.isCharacterFound){
							this.x +=  this.speed*1.6;
						}else{
							this.x +=  this.speed;
						}
					}else{
						if(this.currentAnimation!="Seek")this.gotoAndPlay("Seek");
						this.standDelay --;
						if(this.standDelay <=0){
							this.standDelay = 30;
							this.direction  = -1;
							this.gotoAndPlay("Walk");
							this.scaleX = -1;
							this.x += this.width/2;
						}
					}
				}else{
					if(this.scaleX>0){
						this.scaleX = -1;
						this.x += this.width/2;
					}
					if(this.x<this.patrolMinX && !this.isCharacterFound){
						this.gotoAndPlay("Stand");
						this.standDelay --;
						if(this.standDelay <=0){
							this.standDelay = 30;
							this.direction  = 1;
							this.gotoAndPlay("Walk");
							this.scaleX = 1;
							this.x -= this.width/2;
						}
					}else if(this.x>this.minX){
						if(this.isCharacterFound){
							this.x -=  this.speed*1.6;
						}else{
							this.x -=  this.speed;
						}
					}else{
						if(this.currentAnimation!="Seek")this.gotoAndPlay("Seek");
						this.standDelay --;
						if(this.standDelay <=0){
							this.standDelay = 30;
							this.direction  = 1;
							this.gotoAndPlay("Walk");
							this.scaleX = 1;
							this.x -= this.width/2;
						}
					}		
				}
			}
		}
		
		
		/**
		 * Seek for the player.
		 * @method initialize
		 * @protected
		*/
		p.seek = function(__direction){
			if(!this.isCharacterFound && this.standing!=true){
				if(this.currentAnimation!= "Seek"){
					this.gotoAndPlay("Seek");
					this.onAnimationEnd = this.resumeState;
				}
		
				this.direction = __direction;
				
				this.walkPaused = true;
				this.isCharacterFound = true;
				
				this.interrogationMark.alpha = 0;
				
				if(this.scaleX==1){
					this.interrogationMark.x = this.x+70;
				}else{
					this.interrogationMark.x = this.x-this.width/2;
				}
				this.interrogationMark.y = this.y+40;
				this.parent.addChild(this.interrogationMark);
				
				Tween.get(this.interrogationMark).to({alpha:1,visible:true,y:this.interrogationMark.y-30},300).wait(500).to({alpha:0,visible:false},300);//.set({visible:false}).call(onComplete)
			}
			
		}
		
		
		/**
		 * Resume the normal state of the guard.
		 * @method initialize
		 * @protected
		 */
		p.resumeState = function(){
			this.gotoAndPlay("Walk");
			this.walkPaused = false;	
			this.onAnimationEnd = null;
		}
		
		
		/**
		 * Triggered when guard lost player.
		 * @method initialize
		 * @protected
		 */
		p.lost = function(){
			this.isCharacterFound = false;
		}
		
		
		p.stunned = function(){
			this.walkPaused = true;
			this.isStunned  = true;
			this.gotoAndPlay("Hit");
		}
		
		p.reset = function (){
			this.isCharacterFound = false;
			this.walkPaused = false;
			this.isStunned  = false;
			this.gotoAndPlay("Walk");
		}
		
		p.stand = function(){
			this.walkPaused = true;
			this.isStunned  = true;
			this.standing   = true;
			this.gotoAndPlay("Stand");
		}
	
	
window.Guard = Guard;
}(window));

/**
 * Player instance use to display a playable character on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	function Player(_colider) {
	  this.initialize(_colider);
	}
	
	Player.prototype = new Container();
	Player.prototype.animation = null;
	Player.prototype.width     = 210;
	Player.prototype.height    = 280;
	Player.prototype.speed     = 15;
	Player.prototype.jumpReach = 180;
	Player.prototype.jumpSpeed = 18;
	Player.prototype.colider   = null;
	Player.prototype.moveLeft  = false;
	Player.prototype.moveRight = false;
	Player.prototype.moveUp	   = false;
	Player.prototype.moveDown  = false;
	Player.prototype.upPress   = false;
	Player.prototype.downPress = false;
	Player.prototype.touchMode = false;
	Player.prototype.spacePress = false;
	Player.prototype.touchLength = 0;
	Player.prototype.isClimbing = false;
	Player.prototype.isHiding   = false;
	Player.prototype.origin 	= new Point();
	Player.prototype.colisionAnimation   = null;	
	Player.prototype.Container_initialize = Player.prototype.initialize;
	
	/**
	 * Player constructor
	 */	
	Player.prototype.initialize = function(_colider) {
		this.Container_initialize();
		this.colider = _colider;
		
		var playerSheet  = new SpriteSheet({
			"images": ["assets/img/characters/player_0.png", "assets/img/characters/player_1.png"], 
			"animations": {"Climb": [55, 66,true], "Land": [53, 54,false], "Stand": [0, 29,true], "Jump": [45, 52,false], "Hide": [75, 111,false], "Press": [70, 74,"Stand"], "Run": [30, 44,true], "ClimbLand": [67, 69,"Run"]}, 
			"frames": {"regX": 0, "width": 253, "regY": 0, "height": 289, "count": 112}
		});
	
		var colisionSheet = new SpriteSheet({
			"images": ["assets/img/characters/colision.png"], 
			"animations": {"Colide": [0, 29,false]}, 
			"frames": {"regX": 0, "width": 409, "regY": 0, "height": 282, "count": 30}
		});
		
		this.animation = new BitmapAnimation(playerSheet);
		this.animation.gotoAndStop(21);
		
		this.colisionAnimation =  new BitmapAnimation(colisionSheet);
		this.colisionAnimation.gotoAndStop(1);

		this.addChild(this.animation);
	}
	
	
	/**
	 * Update player display
	 */	
	Player.prototype.update = function(){
		if(!this.isHiding){
			if(!this.isClimbing){
				if(this.moveRight){
					this.motionRight();
				}else if(this.moveLeft){
					this.motionLeft();
				}
				
				if(this.moveUp && !this.moveDown){
					this.motionUp();
					if(this.y - this.ty > -5 && this.y - this.ty < 5){
						this.moveUp = false;
						this.moveDown = true;
						this.ty = null;
						this.animation.gotoAndPlay("Land");
					}
					
				}else{
					var falling = this.checkIfFall();
					if(!falling){
						if(!this.moveDown)this.animation.gotoAndPlay("Land");
		
						this.moveDown = true;
						this.motionDown();
						
					}else{
					
						if(this.moveDown){
							if(!this.moveRight&&!this.moveLeft){
								this.animation.gotoAndStop(21);
							}else{
								this.animation.gotoAndPlay("Run");
							}
							/*var oldY =  this.y;
							this.y += falling.height;
							motionY = this.y-oldY;*/
							this.downPress = false;
						}
						 this.moveDown = false;
					}
				}
			}
			
			if(this.upPress){
				var testRect = this.colider.hitTestLadders(this);
				
				if(testRect){
					
					this.moveUp = false;
					
					//Correct Player motion
					if(this.scaleX == 1){
						this.x = testRect.x + testRect.width/2 - this.width/2;
					}else{
						this.x = testRect.x+this.width/2 + testRect.width/2;
					}
					
					this.isClimbing = true;
					this.ty = null;					
						
					
					if(testRect.y>this.y-10){
					//	console.log(testRect.ending);
						if(testRect.ending != false){
							this.y -= this.height;
							this.isClimbing = false;
							this.moveUp = false;
							this.moveDown = false;
							this.downPress = false;
						
							this.animation.gotoAndPlay("ClimbLand");
						}else{
							this.animation.gotoAndStop("Climb");
						}
					}else{
						if(this.animation.currentFrame<55){
							this.animation.gotoAndStop("Climb");
						}else if(this.animation.currentFrame==66){
							this.animation.gotoAndStop("Climb");
						}else{
							this.animation.advance();
							this.animation.paused =true;
						}
						this.y -= this.speed/2;
					}
					
				}else{
					this.isClimbing = false;
				}
			}else if(this.downPress&&this.isClimbing){
				var testRect = this.colider.hitTestLadders(this);
				
				if(testRect){
					this.y += this.speed/2;
					
					if(this.animation.currentAnimationFrame<=0){
						this.animation.currentAnimationFrame = 11
					}else{
						this.animation.currentAnimationFrame -=1
					}
				
					if(this.y+this.height>testRect.y+testRect.height){
						this.isClimbing = false;
					}else{
						//this.animation.gotoAndStop(this.animation.currentAnimationFrame-1);
					}
				}
			}else if(this.downPress && !this.moveDown){
				var testRect = this.colider.hitTestLadders(this,true);
				
				if(testRect){
					if(this.scaleX == 1){
						this.x = testRect.x + testRect.width/2 - this.width/2;
					}else{
						this.x = testRect.x+this.width/2 + testRect.width/2;
					}
					this.y += this.height
					
					this.animation.gotoAndStop("Climb");
					this.isClimbing = true;
					
				}else{
					this.y += this.jumpSpeed*2;
																		
					var falling = this.checkIfFall();
		
					if(falling){
						this.y -= this.jumpSpeed*2;
					}
					this.downPress = true;		
				}
			}
			
			if(!this.moveLeft && !this.moveRight && !this.moveUp && !this.moveDown && !this.isClimbing && !this.isHiding && this.animation.currentAnimation!="Stand" && this.animation.currentAnimation!="Press")this.animation.gotoAndPlay("Stand");
		}
		
		//Check collectable items colision
		this.colider.hitTestCollectable(this);
		
		//Check bushes items colision
		if(this.colider.hitTestBushes(this,this.spacePress) && this.spacePress && !this.moveUp && !this.moveDown){
			if(!this.isHiding){
				Tween.get(this).wait(200).call(function(__this){__this.parent.addChildAt(__this,0)},[this]);
				this.animation.gotoAndPlay("Hide");
				this.isHiding = true;
				
			}
		}else{
			this.isHiding = false;
		}
		
		//Check trap items colision
		if(this.spacePress && !this.isPressed ){
			var trap = this.colider.hitTestTraps(this,this.spacePress);
			
			if(trap){
				this.colider.hitTestTrapGuards(trap);
				if(!this.isPressed){
					this.isPressed = true;
					this.animation.gotoAndPlay("Press");
					Tween.get(this).wait(800).call(function(__this){__this.isPressed = false;},[this]);
					this.x = trap.handleRect.x-this.width/2-80;
					this.scaleX = 1;
				}
			}
		}
	}
	
	
	/**
	 * Handle player motion on key down
	 */	
	Player.prototype.handleKeyDown = function(__e){
		if(!this.isHiding){
			if((KEYCODE_RIGHT == __e.keyCode || KEYCODE_D == __e.keyCode ) && !this.moveRight){
				this.triggerMoveRight();
				
			}else if((KEYCODE_LEFT == __e.keyCode || KEYCODE_A == __e.keyCode ) && !this.moveLeft){
				this.triggerMoveLeft();
				
			}else if((KEYCODE_UP == __e.keyCode || KEYCODE_W == __e.keyCode )&& !this.moveUp){
				if(!this.moveDown && !this.moveUp && !this.upPress){
				
					if(this.ty == null){
						this.oy = this.y
						this.ty = this.y - this.jumpReach;
						this.animation.gotoAndPlay("Jump")
					}
					
					this.moveUp = this.upPress = true;
				}else if(this.isClimbing){
					this.upPress = true;
					
				}
			}else if((KEYCODE_DOWN == __e.keyCode || KEYCODE_S == __e.keyCode ) && !this.moveDown){
				if(!this.downPress && ! this.moveUp){
					this.downPress = true;
					
				}
			}else if(KEYCODE_SPACE == __e.keyCode){
				this.spacePress = true;
			}
		}
		
		__e.preventDefault();
		return false;
	}
	
	
	/**
	 * Handle player motion on key up
	 */	
	Player.prototype.handleKeyUp = function(__e){
		
		if(KEYCODE_RIGHT == __e.keyCode || KEYCODE_D == __e.keyCode ){
			this.moveRight = false;
			if(!this.moveLeft && !this.moveUp && !this.moveDown && !this.isClimbing && !this.isHiding)this.animation.gotoAndPlay("Stand");
		}else if(KEYCODE_LEFT == __e.keyCode || KEYCODE_A == __e.keyCode){
			this.moveLeft = false;
			if(!this.moveRight && !this.moveUp && !this.moveDown && !this.isClimbing && !this.isHiding)this.animation.gotoAndPlay("Stand");
		}
		
		if(KEYCODE_UP == __e.keyCode|| KEYCODE_W == __e.keyCode){
			this.upPress = false;
		}

		if(KEYCODE_DOWN == __e.keyCode|| KEYCODE_S == __e.keyCode){
			this.downPress = false;
		}
		
		
		if(KEYCODE_SPACE == __e.keyCode){
			this.spacePress = false;
			if(this.isHiding){
				Tween.removeTweens(this);
				this.parent.addChildAt(this,this.parent.getNumChildren()-1);
				if(this.moveLeft || this.moveRight){
					this.animation.gotoAndPlay("Run");
				}else{
					this.animation.gotoAndPlay("Stand");
				}
				this.isHiding = false;
			}
		}
		
		
	}
	
	
	/**
	 * Triggered when user touch the screen
	 */
	Player.prototype.handleTouchStart = function(__e){
		var x = __e.touches[0].pageX;
		var y = __e.touches[0].pageY;
		var left = 525;
		var right = 775;
		var spaceLeft = 625;
		var spaceRight = 725;
		
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))){
			left  = 325;
			right = 575;
			spaceLeft = 425;
			spaceRight = 525;
		}
		
		//MOVE DOWN
		if(y>540){
			if(!this.moveDown && !this.spacePress){
				if(!this.downPress && ! this.moveUp){
					this.downPress = true;
					
				}
			}
		}
		
		//MOVE LEFT
		if(x<left){
			if(!(this.downPress && this.isClimbing))this.triggerMoveLeft()
			
			
			
		//MOVE RIGHT
		}else if(x>right){
			if(!(this.downPress && this.isClimbing))this.triggerMoveRight()
			
		}
		
		if(y<350 && !this.moveUp  && !this.upPress && !this.moveDown){
			this.moveUp = this.upPress = true;
			if(this.ty == null){
				this.oy = this.y
				this.ty = this.y -150;
				this.animation.gotoAndPlay("Jump")
			}
		}
		
		
		if(y>590 && x>spaceLeft && x<spaceRight){
			this.spacePress = true;
		}
		
		
		
		this.touchLength = __e.touches.length;
	}
	
	/**
	 * Triggered when user touch the screen
	 */
	Player.prototype.handleTouchEnd = function(__e){
		if(this.spacePress){
			this.spacePress = false;
			if(this.isHiding){
				Tween.removeTweens(this);
				this.parent.addChildAt(this,this.parent.getNumChildren()-1);
				if(this.moveLeft || this.moveRight){
					this.animation.gotoAndPlay("Run");
				}else{
					this.animation.gotoAndPlay("Stand");
				}
				this.isHiding = false;
			}
		}
		//if((this.moveLeft || this.moveRight)&& !this.isClimbing)this.animation.gotoAndPlay("Stand");
		//if(!this.upPress && !this.isClimbing)this.animation.gotoAndPlay("Stand");
		this.moveLeft = false;
		this.moveRight = false;
		this.upPress = false;
		this.downPress = false;
	/*	if(__e.touches.length < this.touchLength){
			this.upPress = false;
			
		}
		
		this.touchLength = __e.touches.length;
		
		if(!this.moveUp)this.animation.gotoAndPlay("Stand");*/
	}
	
	/**
	 * Triggere motion left
	 */
	Player.prototype.triggerMoveLeft = function(){
		this.moveLeft = true;
		if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		if(this.scaleX!=-1){
			this.scaleX = -1;
			this.x += this.width;
		}
		if(this.isClimbing && !this.downPress && !this.upPress){
			this.oy = this.y
			this.ty = this.y - this.jumpReach/2;
			this.animation.gotoAndPlay("Jump")
			this.moveUp = true;
			this.isClimbing = false;	
		}
	}
	
	Player.prototype.triggerMoveRight = function(){
		this.moveRight = true;
		
		if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		if(this.scaleX!=1){
			this.scaleX = 1;
			this.x -= this.width;
		}
		if(this.isClimbing && !this.downPress && !this.upPress){
			this.oy = this.y
			this.ty = this.y - this.jumpReach/2;
			this.animation.gotoAndPlay("Jump")
			this.moveUp = true;
			this.isClimbing = false;	
		}
	}
	
	/**
	 * Move left player and camera
	 */
	Player.prototype.motionLeft =  function (){
		if(this.scaleX!=-1){
			this.scaleX = -1;
			this.x += 220;
		}
		
		this.x -= this.speed;
		
		//Test if movement is possible
		var testRect = this.colider.hitTest(this);
		if(testRect){
			this.x += testRect.width
		}
	}
	
	
	/**
	 * Move right player and camera
	 */
	Player.prototype.motionRight = function(){
		if(this.scaleX!=1){
			this.scaleX = 1;
			this.x -= 220;
		}

		this.x += this.speed;
		
		//Test if movement is possible
		var testRect = this.colider.hitTest(this);
		if(testRect){
			this.x -= testRect.width
		}
	}
	
	
	/**
	 * Make player jump
	 */
	
	Player.prototype.motionUp = function(){
		var motion = (this.y-this.ty)*.2;
		this.y -= motion
		
		var falling = this.colider.hitTestY(this,true);
		
		
		if(falling){
			this.y += motion;
			this.moveUp = false;
			this.moveDown = true;
			this.ty = null;
			this.animation.gotoAndPlay("Land");
		}
	}
	
	
	
	/**
	 * Move down
	 */
	Player.prototype.motionDown = function(){
		this.y += this.jumpSpeed
	}
	
	
	/**
	 * Check if user fall
	 */
	Player.prototype.checkIfFall = function(){
		this.y += this.jumpSpeed
		
		var testRect = this.colider.hitTestY(this);
		
	
		this.y -= this.jumpSpeed;
		
		return testRect
	}
	
	
	/**
	 * Start colide animation
	 */
	Player.prototype.colide = function(){
		if(this.scaleX!=1){
			this.scaleX = 1;
			this.x -= this.width;
		}
		this.removeChild(this.animation);
		this.addChild(this.colisionAnimation);
		this.colisionAnimation.gotoAndPlay("Colide");
	}
	
	/**
	 * Start colide animation
	 */
	Player.prototype.reset = function(){
		this.moveLeft = false;
		this.moveRight = false;
		this.upPress = false;
		this.downPress = false;
		this.addChild(this.animation);
		this.removeChild(this.colisionAnimation);
		this.animation.gotoAndStop(21);
	}
	
	
	
window.Player = Player;
}(window));

/**
 * Bush instance use to display a bush item on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	function Bush(__x,__y) {
	  this.initialize(__x,__y);
	}
	
	var p = Bush.prototype = new BitmapAnimation();
			Bush.prototype.bushSpritesheet = new SpriteSheet({
				"images": ["assets/img/environnement/items/bush.png"], 
				"animations": {"all": [0, 39]}, 
				"frames": {"regX": 0, "width": 316, "regY": 0, "height": 199, "count": 40}
			});	
			
	
	p.width = 212;
	p.height = 153;
	p.BitmapAnimation_initialize = p.initialize;
	
	/**
	 * WantedPoster constructor
	 */	
	p.initialize = function(__x,__y) {
		this.BitmapAnimation_initialize();
		 				
		this.BitmapAnimation_initialize(this.bushSpritesheet);
		this.gotoAndPlay(0);
	
		this.paused = true;
		this.x = __x;
		this.y = __y;		
	}
	
	/**
	 * Triggered when player is near Bush
	 */
	p.highlight = function(){
		if(this.paused){
			this.gotoAndPlay(0);
			this.paused = false;
		}
	}
	
	/**
	 * Triggered when player is near Bush
	 */
	p.darken = function(){
		if(!this.paused){
			this.gotoAndPlay(0);
			this.paused = true;
		}
	}
	
window.Bush = Bush;
}(window));

/**
 * Energy instance use to display a collectable item on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	function Energy(__x,__y) {
	  this.initialize(__x,__y);
	}
	
	var p = Energy.prototype = new BitmapAnimation();
			Energy.prototype.energySpritesheet = new SpriteSheet({
				"images": ["assets/img/environnement/items/energy.png"], 
				"animations": {"all": [0, 20]}, 
				"frames": {"regX": 0, "width": 144, "regY": 0, "height": 152, "count": 21}
			});	
			
	
	p.width = 138;
	p.height = 120;
	p.BitmapAnimation_initialize = p.initialize;
	
	/**
	 * Energy constructor
	 */	
	p.initialize = function(__x,__y) {
		this.BitmapAnimation_initialize(this.energySpritesheet);
		this.gotoAndStop(0);
	
		this.x = __x-this.width/2;
		this.y = __y;		
	}
	
	
	/**
	 * To be called when collected
	 */	
	p.collected = function(){
		this.gotoAndPlay(1);
		this.onAnimationEnd = this.dispose;
		ITEM_COLLECTED +=1
	}
	
	
	/**
	 * Dispose poster instance
	 */	
	p.dispose = function(){
		this.parent.removeChild(this);
	}
	
window.Energy = Energy;
}(window));

/**
 * Trap instance use to display a trap on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	function Trap(__x,__y,__handleX,__handleY,__trapX,__trapY) {
	  this.initialize(__x,__y,__handleX,__handleY,__trapX,__trapY);
	}
	
	var p = Trap.prototype = new Container();
		p.handle = null;
		p.trap   = null;
		p.trapRect = null;
		p.handleRect = null;
		p.activated = false
		p.rewind    = false;
		
		p.Container_initialize = p.initialize;
		
	
	/**
	 * Trap constructor
	 */	
	p.initialize = function(__x,__y,__handleX,__handleY,__trapX,__trapY) {
		this.Container_initialize();
		
		var handleSheet  = new SpriteSheet({
			"images": ["assets/img/environnement/items/handle.png"], 
			"animations": {"Activate": [0, 4,false]}, 
			"frames": {"regX": 0, "width": 242, "regY": 0, "height": 184, "count": 5}
		});	
		
		
		
		var trapSheet  = new SpriteSheet({
			"images": ["assets/img/environnement/items/trap.png"], 
			"animations": {"Activate": [0, 9,true]},
			"frames": {"regX": 0, "width": 88, "regY": 0, "height": 87, "count": 10}
		});	
	
		this.handle = new BitmapAnimation(handleSheet);
		this.handle.x = __handleX;
		this.handle.y = __handleY;
		this.handle.gotoAndStop(0);
		
		this.trap   = new BitmapAnimation(trapSheet);
		this.trap.x = __trapX;
		this.trap.y = __trapY;
		this.trap.gotoAndStop(0);
		
		this.addChild(this.trap);
		this.addChild(this.handle);
		this.x = __x;
		this.y = __y;
		
		this.trapRect = new Rectangle(this.x+__trapX,this.y+__trapY,186,381);
		this.handleRect = new Rectangle(this.x+__handleX,this.y+__handleY,120,132);
	},
	
	/**
	 * Activate constructor
	 */	
	p.activate = function (){
		if(!this.activated){
			this.handle.gotoAndPlay("Activate");
			this.trap.gotoAndPlay("Activate");
			this.activated = true;
			this.rewind = false;
			
		}
	}
	
	p.tick =  function(){
		if(this.rewind){
			if(this.trap.currentAnimationFrame>0){
				this.trap.currentAnimationFrame -=1;
				this.handle.currentAnimationFrame -=1
			}else{
				this.activated = this.rewind = false;
			}
		}
		if(this.handle.currentAnimationFrame==9)this.rewind = true;
	}
window.Trap = Trap;
}(window));

/**
 * Colider instance use to test collision for player motion.
 * Basic colider for demo purpose, In real game this colider should be 
 * a K-tree(2D-Tree) collision system.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	/**
	 * Constructor
	 */
	function Colider() {
	  this.initialize();
	}
	
	Colider.prototype = new Container();
	
	// public properties:
	Colider.prototype.hitZones = [{x:-60,y:0,width:50,height:455},
								  {x:-60,y:355,width:1660,height:50},
								  {x:1670,y:215,width:50,height:200},
								  {x:1720,y:215,width:280,height:50},
								  {x:2060,y:165,width:1120,height:50},
								  {x:3150,y:-65,width:50,height:300},
								  {x:3150,y:-75,width:2540,height:50},
								  {x:3930,y:-565,width:130,height:500},
								  {x:4590,y:-975,width:130,height:300},
								  {x:5700,y:00,width:400,height:50},
								  
								  {x:6100,y:120,width:2040,height:50},
								  {x:8190,y:-130,width:8480,height:50},
								  {x:8190,y:-130,width:50,height:400},
								
								  {x:16400,y:-45,width:1810,height:50},
								  {x:18300,y:240,width:2700,height:50},
								  {x:12720,y:-1715,width:50,height:600}]
								  
	Colider.prototype.platforms = [{x:2330,y:40,width:180,height:50},
								   {x:2640,y:-100,width:180,height:50},
								   {x:3580,y:-600,width:960,height:50},
								   {x:4280,y:-300,width:100,height:50},
								   {x:7680,y:5,width:50,height:50},
								   {x:7860,y:-140,width:100,height:50},
								   {x:9560,y:-380,width:195,height:50},
								   {x:9200,y:-500,width:195,height:50},
								   {x:8580,y:-620,width:515,height:50},
								   {x:7550,y:-600,width:530,height:50},
								   {x:13100,y:-540,width:75,height:50},
								   
								   {x:13520,y:-653,width:195,height:50},
								   {x:14100,y:-720,width:550,height:50},
								   {x:13650,y:-1145,width:1050,height:50},
								   {x:12600,y:-1085,width:600,height:50},
								   {x:14945,y:-1130,width:100,height:50},
								   {x:15365,y:-1010,width:100,height:50},
								  
								   {x:14900,y:-610,width:935,height:50},
								
								   {x:18880,y:-260,width:1100,height:50}];
								  
	Colider.prototype.ladders = [{x:3730,y:-620,width:80,height:480,end:true},
								 {x:8755,y:-660,width:80,height:460,end:true},
								 {x:12875,y:-750,width:80,height:500,end:false},
								 {x:14515,y:-1240,width:80,height:480,end:true},
								 {x:14995,y:-620,width:80,height:400,end:true},
								 {x:15690,y:-620,width:80,height:400,end:true},
								 {x:18985,y:-290,width:80,height:490,end:true}];
	Colider.prototype.collectable = [];
	Colider.prototype.bushes = [];
	Colider.prototype.traps  = [];
	Colider.prototype.guards = [];
	Colider.prototype.debug  = false;
	
	
	Colider.prototype.Container_initialize = Colider.prototype.initialize;
	
	/**
	 * Initialize ForeGround
	 */	
	Colider.prototype.initialize = function() {
	
		if(this.debug){
			var i = this.hitZones.length;
			
			while(i--){
				var g = new Graphics();
					g.setStrokeStyle(1);
					g.beginStroke(Graphics.getRGB(0,0,0));
					g.beginFill(Graphics.getRGB(255,0,0));
					g.rect(0,0,this.hitZones[i].width,this.hitZones[i].height);
				var s = new Shape(g);
					s.x = this.hitZones[i].x;
					s.y = this.hitZones[i].y;
				this.addChild(s);
			}
			
			i = this.platforms.length;
			
			while(i--){
				var g = new Graphics();
					g.setStrokeStyle(1);
					g.beginStroke(Graphics.getRGB(0,0,0));
					g.beginFill(Graphics.getRGB(0,232,20));
					g.rect(0,0,this.platforms[i].width,this.platforms[i].height);
				var s = new Shape(g);
					s.x = this.platforms[i].x;
					s.y = this.platforms[i].y;
				this.addChild(s);
			}
			
			i = this.ladders.length;
			
			while(i--){
				var g = new Graphics();
					g.setStrokeStyle(1);
					g.beginStroke(Graphics.getRGB(0,0,0));
					g.beginFill(Graphics.getRGB(0,221,255));
					g.rect(0,0,this.ladders[i].width,this.ladders[i].height);
				var s = new Shape(g);
					s.x = this.ladders[i].x;
					s.y = this.ladders[i].y;
					s.alpha = .5;
				this.addChild(s);
			}
		}
	}	
	
	/**
	 * Hit test a rectangle 
	 */	
	Colider.prototype.hitTest = function(__player){
		var left   = __player.x;
		var top    = __player.y;
		var width  = __player.width;
		var height = __player.height
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.hitZones.length;
		
		while(i--){
			var testRect = new Rectangle(this.hitZones[i].x,this.hitZones[i].y,this.hitZones[i].width,this.hitZones[i].height);
			var test = testRect.getIntersection(playerRect);
		
			if(test)return test;
		}
				
		return false;
	}
	
	
	/**
	 * Hit test Y axis only for falling 
	 */
	Colider.prototype.hitTestY = function(__player,__type){
		var left   = __player.x;
		var top    = __player.y;
		var width  = __player.width;
		var height = __player.height
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.hitZones.length;
		
		while(i--){
			var testRect = new Rectangle(this.hitZones[i].x,this.hitZones[i].y,this.hitZones[i].width,this.hitZones[i].height);
			var test = testRect.getIntersection(playerRect);
		
			if(test && test.getSize()!=0){
				return test;
			}else if(__type && test && test.getWidth()>10){
				return test;
			}
		}
		
		//Tests for platforms
		i = this.platforms.length;
		
		while(i--){
			var testRect = new Rectangle(this.platforms[i].x,this.platforms[i].y,this.platforms[i].width,this.platforms[i].height);
			var test = testRect.getIntersection(playerRect);
		
			if(!__type && test && playerRect.getTop()+playerRect.getHeight()-20< testRect.getTop()){
				return test;
			}
		}
		
		
		return false;
	}
	
	
	/**
	 * Hit test with ladders 
	 */
	Colider.prototype.hitTestLadders = function(__player,__type){
		var left   = __player.x+40;
		var top    = __player.y;
		var width  = __player.width-120;
		var height = 1
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		if(__type)height = __player.height;
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.ladders.length;
		
		while(i--){
			var testRect = new Rectangle(this.ladders[i].x,this.ladders[i].y,this.ladders[i].width,this.ladders[i].height);
				testRect.ending = this.ladders[i].end;
			var test = testRect.getIntersection(playerRect);
			
			if(!__type && test && playerRect.getTop() > testRect.getTop()){
				return testRect;
			}
			
			if(__type && test && __player.y<testRect.y){
				return testRect;
			}
		}
				
		return false;
	}
	
	
	/**
	 * Hit test a rectangle 
	 */	
	Colider.prototype.hitTestCollectable = function(__player){
		var left   = __player.x+50;
		var top    = __player.y+80;
		var width  = __player.width-100;
		var height = __player.height-80;
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.collectable.length;
		
		while(i--){
			if(Math.abs(this.collectable[i].x - playerRect.x <500)){
				var testRect = new Rectangle(this.collectable[i].x,this.collectable[i].y,this.collectable[i].width,this.collectable[i].height);
				var test = testRect.getIntersection(playerRect);
			
				if(test){
					this.collectable[i].collected();
					this.collectable.splice(i,1);
					return test;
				}
			}
		}
				
		return false;
	}
	
	
	/**
	 * Hit test a objects with others
	 */	
	Colider.prototype.hitTestGuard = function(__player){
		var left   = __player.x+50;
		var top    = __player.y+50;
		var width  = __player.width-100;
		var height = __player.height-140;
		
		if(__player.scaleX==-1){
			
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);		
		var i = this.guards.length;
		
		while(i--){
			if(this.guards[i].x> __player.x-200 && this.guards[i].x<__player.x + 340 && Math.abs(this.guards[i].y-__player.y)<50 && !__player.isHiding){
				left   = this.guards[i].x+50;
				top    = this.guards[i].y+50;
				width  = this.guards[i].width-100
				height = this.guards[i].height-50;
				
				if(this.guards[i].scaleX==-1){
					left -= 200;
				}
						
				var testRect = new Rectangle(left,top,width,height);
				var test = testRect.getIntersection(playerRect);
				
				if(test){
					this.guards[i].parent.removeChild(this.guards[i].interrogationMark);
					this.guards[i].parent.removeChild(this.guards[i]);
					__player.colide();
					return true;
				}
				if(__player.x>this.guards[i].x){
					this.guards[i].seek(1);
				}else{
					this.guards[i].seek(-1);	
				}
			}else if(Math.abs(this.guards[i].x-__player.x)>500){
				this.guards[i].lost();
			}
		}
				
		return false;
	}
	
	/**
	 * Hit test bushes for hightlight
	 */	
	Colider.prototype.hitTestBushes = function(__player,__space){
		var left   = __player.x+50;
		var top    = __player.y+80;
		var width  = __player.width-100;
		var height = __player.height-80;
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.bushes.length;
		
		while(i--){
			if(Math.abs(this.bushes[i].x - playerRect.x <500) && playerRect.y-50<this.bushes[i].y ){
				var testRect = new Rectangle(this.bushes[i].x+100,this.bushes[i].y,this.bushes[i].width-150,this.bushes[i].height);
				var test = testRect.getIntersection(playerRect);
			
				if(test){
					if(!__space){
						this.bushes[i].highlight();
					}else{
						this.bushes[i].darken();
					}
					return test;
				}else{
					this.bushes[i].darken();
				}
			}
		}
		return false;
	}
	
	
	/**
	 * Hit test traps handle for activation
	 */	
	Colider.prototype.hitTestTraps = function(__player,__space){
		var left   = __player.x+50;
		var top    = __player.y+80;
		var width  = __player.width-100;
		var height = __player.height-80;
		
		if(__player.scaleX==-1){
			left -= 213;
		}
		
		var playerRect = new Rectangle(left,top,width,height);
		
		var i = this.traps.length;
		
		while(i--){
			var testRect = new Rectangle(this.traps[i].handleRect.x,this.traps[i].handleRect.y,this.traps[i].handleRect.width,this.traps[i].handleRect.height);
			var test = testRect.getIntersection(playerRect);
		
			if(test){
				if(__space){
					this.traps[i].activate();
				}
				return this.traps[i];
			}
		}
		return false;
	}
	
	/**
	 * Hit test traps and guards
	 */	
	Colider.prototype.hitTestTrapGuards = function(__trap){
		var left   = __trap.trapRect.x+140;
		var top    = __trap.trapRect.y;
		var width  = 10;
		var height = __trap.trapRect.height;
		
		var i = this.guards.length;
		
		var trapRect = new Rectangle(left,top,width,height);
			
		while(i--){
			left   = this.guards[i].x;
			top    = this.guards[i].y;
			width  = this.guards[i].width;
			height = this.guards[i].height;
			
			if(this.guards[i].scaleX==-1){
				left -= 200;
			}
					
			var testRect = new Rectangle(left,top,width,height);
			var test = testRect.getIntersection(trapRect);
			
			if(test){
				this.guards[i].stunned();
				this.guards.splice(i,1);
				return true;
			}
		}
				
		return false;
	}
	
	
	
window.Colider = Colider;
}(window));

/**
 * Ground instance use to display a layer on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	/**
	 * Constructor
	 */
	function Ground(__mapArray,__speedX,__speedY,__loaded) {
	  this.initialize(__mapArray,__speedX,__speedY,__loaded);
	}
	
	Ground.prototype = new Container();
	
	Ground.prototype.positionX = 0;
	Ground.prototype.positionY = 0;
	Ground.prototype.speedX    = 1;
	Ground.prototype.freeze    = false;
	Ground.prototype.map   	   = new Array();
	Ground.prototype.tilling   = new Array();
	Ground.prototype.collectable  = [new Energy(7040,-70),new Energy(7190,-70),new Energy(7340,-70),new Energy(7490,-70),new Energy(7224,-500),new Energy(7311,-660),new Energy(7415,-780),new Energy(7570,-833),new Energy(8670,-762),new Energy(8820,-762),new Energy(8980,-762),new Energy(9290,-650),new Energy(9440,-650),new Energy(9730,-525),
									new Energy(13144,-750),new Energy(13600,-850),new Energy(14200,-900),new Energy(12900,-1250),new Energy(13500,-1450),new Energy(13500,-1250),new Energy(14000,-1350),new Energy(14200,-1350),new Energy(14400,-1350),new Energy(14900,-1300),new Energy(15450,-1200),new Energy(15900,-1400),new Energy(15900,-1200),new Energy(15900,-1000),
									new Energy(17200,-250),new Energy(17350,-250),new Energy(17500,-250),new Energy(18350,70),new Energy(18500,70),new Energy(19800,-450),new Energy(19950,-450),new Energy(20100,-450),new Energy(20250,-650),new Energy(20400,-450),new Energy(20550,-250),new Energy(21400,0),new Energy(21400,150),new Energy(21400,300),new Energy(21200,450),new Energy(21200,450),new Energy(21200,600)];
	Ground.prototype.bushes 	  = [new Bush(10680,-343),new Bush(12000,-343),new Bush(19100,-450)]
	Ground.prototype.traps        = [new Trap(16200,-350,0,0,240,85)];
	Ground.prototype.guards 	  = [new Guard(11500,-415,10000,12400,10000,12400),new Guard(16420,-440,15630,15630,15630,15630),new Guard(19300,-540,19050,19800,19050,19800)] //new Guard(1000,130,500,1300,300,1500)];
	/*Ground.prototype.bushes 	  = [new Bush(10650,-313),new Bush(11575,-305),new Bush(12075,-305),new Bush(14510,-278),new Bush(15574,-278),new Bush(15462,-1012),new Bush(15722,-1012),new Bush(18325,100),new Bush(18565,100),new Bush(19085,-375)]
	Ground.prototype.traps        = [new Trap(16350,-245,0,0,190,-150)];
	Ground.prototype.guards 	  = [new Guard(8600,-380,8600,9200,8300,12400),new Guard(11500,-380,10000,12400,10000,12400),new Guard(15700,-1070,15600,15830,15600,15800),new Guard(15000,-343,14500,15530,14200,15600),new Guard(16800,-243,16670,16900,16670,18500),new Guard(18200,43,18200,18600,18200,19500),new Guard(19300,-443,19000,20500,19000,20800)] //new Guard(1000,130,500,1300,300,1500)];
	*/
	Ground.prototype.maxPositionX = 21638;
	Ground.prototype.Container_initialize = Ground.prototype.initialize;
	Ground.prototype.loadedCount = 0;
	Ground.self = this;
	
	
	/**
	 * Ground constructor
	 */	
	Ground.prototype.initialize = function(__mapArray,__speedX,__speedY,__loaded) {
		Ground.self = this;
		this.map 	= __mapArray;
		this.speedX = __speedX;
		this.speedY = __speedY;
		this.tilling =  new Array();
		this.levelLoaded = __loaded;
		
		for(var i = 0;i<this.map.length;i++){
			var tile =  new Bitmap(this.map[i][0]);
				tile.y = this.map[i][2];
				tile.x = this.map[i][1];
				tile.width = this.map[i][3];
				tile.height = this.map[i][4];
				tile.image.onload = this.loadComplete;
			
			this.tilling[i] = tile;
			this.addChild(tile);
		}
		
		
		
		for(var i = 0;i<this.bushes.length;i++){
			this.addChild(this.bushes[i]);
		}
		
		for(var i = 0;i<this.traps.length;i++){
			this.addChild(this.traps[i]);
		}
		
		for(var i = 0;i<this.guards.length;i++){
			this.addChild(this.guards[i]);
		}
		if(i>1)this.guards[1].stand();
		this.positionX = 0;
		this.positionY = 0;
		this.checkVisible();
		
	}
	
	/**
	 * Update target position based on camera location
	 */
	Ground.prototype.loadComplete = function(){
		Ground.self.loadedCount ++;
		if(Ground.self.map.length == Ground.self.loadedCount){
			Ground.self.levelLoaded();
			for(var i = 0;i<Ground.self.collectable.length;i++){
			
				Ground.self.addChild(Ground.self.collectable[i]);
			}
		}
	}
	
	/**
	 * Update target position based on camera location
	 */
	Ground.prototype.updatePosition = function(__x,__y){
		this.positionX = Math.round(__x);
		this.positionY = Math.round(__y);
		
		if(this.positionX >0){
			this.positionX = 0;
		}
	}
	
	
	
	/**
	 * Update display to current location
	 */
	Ground.prototype.update = function(){
		if(!this.freeze){
			if(this.x != this.positionX && Math.abs(this.positionX-this.x)>1){
				this.x -= (this.x-this.positionX)*this.speedX;
			}else{
				this.x = this.positionX;
			}			
		}
		
		if(this.y != this.positionY && Math.abs(this.positionY-this.y)>1){
			this.y -= (this.y-this.positionY)*this.speedY;
		}else{
			this.y = this.positionY;
		}
		
		if(this.x >0 && this.positionX==0){
			this.freeze = true;
		}else if(this.x-800<-this.maxPositionX && this.positionX-800<-this.maxPositionX){
			this.freeze = true;
		}else{
			this.freeze = false;
			this.checkVisible();
		}
		var i = this.guards.length;
		while (i--) {
			this.guards[i].tick();
		}
	}
	
		
	/**
	 * Update position
	 */
	Ground.prototype.checkVisible =  function(){
		var i = this.tilling.length;
		var posX = Math.abs(this.positionX-this.x);
		while (i--) {
			var tile	= this.tilling[i];
			var visible = false;
			
			if(tile.x+tile.width+(this.positionX-posX)>-150 && posX+tile.x+(this.positionX-posX)<850){
				visible = true;
			}
			
			if(visible){
				if(!tile.parent)this.addChildAt(tile,0);
				
			}else{
				if(tile.parent)this.removeChild(tile);
			}	
			
		}
		
		var i = this.collectable.length;
		while (i--) {
			var tile	= this.collectable[i];
			var visible = false;
			
			if(tile.x+tile.width+(this.positionX-posX)>-150 && posX+tile.x+(this.positionX-posX)<850){
				visible = true;
			}
			
			if(visible){
				if(!tile.parent)this.addChild(tile);
			}else{
				if(tile.parent)this.removeChild(tile);
			}	
		}
		
	}
	
	Ground.prototype.reset = function (){
		for(var i = 0;i<this.guards.length;i++){
			this.guards[i].reset();
			this.addChild(this.guards[i]);
		}
		if(this.guards.length==3)this.guards[1].stand();
	}


window.Ground = Ground;
}(window));

/**
 * Scrollpane instance use to display a layer on the scene.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
 
(function(window) {
	
	/**
	 * Constructor
	 */
	function Scrollpane(__mapArray,__speedX,__speedY,__loaded) {
	  this.initialize(__mapArray,__speedX,__speedY,__loaded);
	}
	Scrollpane.mapLength = 0;
	Scrollpane.loadCount = 1;
	
	var p = Scrollpane.prototype = new Container();
	
	p.positionX = 0;
	p.positionY = 0;
	p.speedX    = 1;
	p.freeze    = false;
	p.map   	= new Array();
	p.tilling   = new Array();
	p.loadedCount = 0;
	
	p.Container_initialize = p.initialize;
	
	
	/**
	 * FarGround constructor
	 */	
	p.initialize = function(__mapArray,__speedX,__speedY,__loaded) {
		this.Container_initialize();
		this.levelLoaded = __loaded;
		this.map 	= __mapArray;
		this.speedX = __speedX;
		this.speedY = __speedY;
		this.tilling =  new Array();
		
		for(var i = 0;i<this.map.length;i++){
			var tile =  new Bitmap(this.map[i][0]);
				
				tile.y = this.map[i][2];
				tile.x = this.map[i][1];
				tile.width = this.map[i][3];
				tile.height = this.map[i][4];
				tile.image.onload = this.loadComplete;
			
			
			this.tilling[i] = tile;
			if(tile.x<1200)this.addChild(tile);
			
		}
			
		this.positionX = 0;
		this.positionY = 0;
		
		this.checkVisible();
		Scrollpane.mapLength += this.map.length;
		Scrollpane.loaded = __loaded;
	}
	
	/**
	 * Update target position based on camera location
	 */
	p.loadComplete = function(){
		Scrollpane.loadCount ++;
		if(Scrollpane.mapLength == Scrollpane.loadCount)Scrollpane.loaded();
	}
	
	/**
	 * Update target position based on camera location
	 */
	p.updatePosition = function(__x,__y){
		this.positionX = Math.round(__x);
		this.positionY = Math.round(__y);
		
		if(this.positionX >0){
			this.positionX = 0;
		}
	}
	
	
	
	/**
	 * Update display to current location
	 */
	p.update = function(__axis){

		if(!__axis || __axis =="X"){
			if(this.x != this.positionX && Math.abs(this.positionX-this.x)>1){
				this.x -= (this.x-this.positionX)*this.speedX;
			}else{
				this.x = this.positionX;
			}		
		}
	
		
		if(!__axis || __axis =="Y"){
			if(this.y != this.positionY && Math.abs(this.positionY-this.y)>1){
				this.y -= (this.y-this.positionY)*this.speedY;
			}else{
				this.y = this.positionY;
			}
		}
		
		
		if(this.x >0 && this.positionX==0){
			this.freeze = true;
		}else{
			this.checkVisible();
		}
	}
	
		
	/**
	 * Update position
	 */
	p.checkVisible =  function(){
		var i = this.tilling.length;
		var posX = Math.abs(this.positionX-this.x);
		while (i--) {
			var tile	= this.tilling[i];
			var visible = false;
			
			if(tile.x+tile.width+(this.positionX-posX)>-150 && posX+tile.x+(this.positionX-posX)<850){
				visible = true;
			}
			
			if(visible){
				if(!tile.parent)this.addChild(tile);
			}else{
				if(tile.parent)this.removeChild(tile);
			}
			
		}
	}


window.Scrollpane = Scrollpane;
}(window));

/**
 * Current level screen.
 * for a disney proposal.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
(function(window) {
	
	function CurrentLevelScreen() {
	  this.initialize();
	}
	
	CurrentLevelScreen.prototype = new Container();
	CurrentLevelScreen.prototype.text = null;
	CurrentLevelScreen.prototype.count = 0;
	CurrentLevelScreen.prototype.Container_initialize = CurrentLevelScreen.prototype.initialize;
	
	/**
	 * Ground constructor
	 */	
	CurrentLevelScreen.prototype.initialize = function() {
		var bitmap = new Bitmap("assets/img/level1screen.jpg");
		
		this.text = new Text("LOADING", "20px TitilliumMaps26L500wt", "#a4cf17");
		this.text.textAlign = "center";
		this.text.x = 650;
		this.text.y = 440;
		
		this.addChild(bitmap);
		this.addChild(this.text);
	}
	
	CurrentLevelScreen.prototype.tick = function(){
		this.count++
		
		if(this.count % 8){
			this.text.alpha = 1;
			
		}else{
			this.text.alpha = 0;
		}
	}
	
window.CurrentLevelScreen = CurrentLevelScreen;
}(window));

/**
 * Current level screen.
 * for a disney proposal.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
(function(window) {
	
	function EndLevelScreen() {
	  this.initialize();
	}
	
	EndLevelScreen.prototype = new Container();
	EndLevelScreen.prototype.levelScoreField = null;
	EndLevelScreen.prototype.posterScoreField = null;
	EndLevelScreen.prototype.timeBonusScoreField = null;
	EndLevelScreen.prototype.totalScoreField = null;
	EndLevelScreen.prototype.Container_initialize = EndLevelScreen.prototype.initialize;
	
	/**
	 * Ground constructor
	 */	
	EndLevelScreen.prototype.initialize = function() {
		var bitmap = new Bitmap("assets/img/endscreen.jpg");
		
		this.levelScoreField = new Text("10000", "30px TitilliumMaps26L500wt", "#ffffff");
		this.levelScoreField.textAlign = "right";
		this.levelScoreField.x = 620;
		this.levelScoreField.y = 125;
		
		this.posterScoreField = new Text("0", "30px TitilliumMaps26L500wt", "#ffffff");
		this.posterScoreField.textAlign = "right";
		this.posterScoreField.x = 620;
		this.posterScoreField.y = 210;
		
		this.timeBonusScoreField = new Text("0", "30px TitilliumMaps26L500wt", "#ffffff");
		this.timeBonusScoreField.textAlign = "right";
		this.timeBonusScoreField.x = 620;
		this.timeBonusScoreField.y = 295;
		
		this.totalScoreField = new Text("10000", "40px TitilliumMaps26L500wt", "#ffffff");
		this.totalScoreField.textAlign = "left";
		this.totalScoreField.x = 560;
		this.totalScoreField.y = 373;
		
		
		
		this.addChild(bitmap);
		this.addChild(this.levelScoreField);
		this.addChild(this.posterScoreField);
		this.addChild(this.timeBonusScoreField);
		this.addChild(this.totalScoreField);
		
	}
	
	EndLevelScreen.prototype.update = function(__poster,__time){
		var min = __time.split("'")[0];
		var sec = __time.split("'")[1];
		this.posterScoreField.text = __poster*1000;
		if((180 -(min*60+Number(sec)))*250>0)this.timeBonusScoreField.text = (180 -(min*60+Number(sec)))*250;
		this.totalScoreField.text = 10000+ __poster*1000 +Number(this.timeBonusScoreField.text);
	
	}
	
window.EndLevelScreen = EndLevelScreen;
}(window));


//CONSTANTS USED IN GAME LOGIC
var GAME_PAUSED  = "Paused";
var GAME_STARTED = "Playing";
var GAME_OVER    = "GameOver";
var GAME_END	 = "GameEnded";
var ITEM_COLLECTED = 0 ;
var KEYCODE_SPACE = 32;
var KEYCODE_LEFT  = 37;	
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN  = 40;
var KEYCODE_UP = 38;	
var KEYCODE_W  = 87;			
var KEYCODE_A  = 65;			
var KEYCODE_D  = 68;
var KEYCODE_S  = 83;
var IS_IPAD    = false;


/**
 * Demo Game instance. Based on Raspunzel game by Disney
 * for a disney proposal.
 *
 * Use of Easel.js
 *
 * @author trochette[followed by the usual sign]bkom.com
 */
(function(window) {
	
	function BkomRobot() {
	  this.initialize();
	}
	
	BkomRobot.prototype.homescreen = null;
	BkomRobot.prototype.levelscreen = null;
	BkomRobot.prototype.currentlevelscreen = null;
	BkomRobot.prototype.endlevelscreen = null;
	BkomRobot.prototype.retrylevelscreen = null;
	BkomRobot.prototype.instance  = this;
	BkomRobot.prototype.player = null;
	BkomRobot.prototype.canvas  = null;
	BkomRobot.prototype.ground  = null;
	BkomRobot.prototype.fps 	= null;
	BkomRobot.prototype.colider = null;
	BkomRobot.prototype.camera  = new Point(0,0);
	BkomRobot.prototype.gameState = GAME_PAUSED;
	BkomRobot.prototype.touchMode = false;
	BkomRobot.prototype.timeField  = null;
	BkomRobot.prototype.collectedField  = null;
	BkomRobot.prototype.startTime  = new Date();
	BkomRobot.prototype.rate = 60;
	BkomRobot.prototype.loadedCount = 0;
	BkomRobot.prototype.checkPoint = new Point();

	BkomRobot.prototype.initialize = function(__x,__y) {
		this.canvas = document.getElementById("gameCanvas");
		this.stage  = new Stage(this.canvas);
		
		
		this.homescreen = new Bitmap("assets/img/homescreen.jpg");
		this.levelscreen = new Bitmap("assets/img/levelscreen.jpg");
		this.retrylevelscreen = new Bitmap("assets/img/retryscreen.jpg");
		this.currentlevelscreen = new CurrentLevelScreen();
		this.endlevelscreen = new EndLevelScreen();
		this.endlevelscreen.alpha = 0;
		this.endlevelscreen.visible = false;
			
		Ticker.setFPS(35);
		
		
		if(Touch.isSupported){
			touchMode = true;
		}
		if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/AppleWebKit/i))IS_IPAD=true;
		
		window.tick = this.tick;
		window.instance = this;
		Ticker.addListener(window);
		this.displayHomeScreen();
	}
	
	
	/**
	 * Triggered when a key is pressed down
	 */
	BkomRobot.prototype.handleKeyDown = function(__e){
		if(this.gameState!=GAME_PAUSED && this.gameState!=GAME_OVER)instance.player.handleKeyDown(__e);
	}
	
	
	/**
	 * Triggered when a key is up
	 */
	BkomRobot.prototype.handleKeyUp = function(__e){
		if(this.gameState!=GAME_PAUSED && this.gameState!=GAME_OVER)instance.player.handleKeyUp(__e);	
	}
	
	/**
	 * Triggered when user touch the screen
	 */
	BkomRobot.prototype.handleTouchStart = function(__e){
		if(this.gameState!=GAME_PAUSED && this.gameState!=GAME_OVER)instance.player.handleTouchStart(__e);
		
		
		if(instance.gameState == GAME_END){
			instance.refresh();
		}
		
		__e.preventDefault();
	}
	
	/**
	 * Triggered when user touch the screen
	 */
	BkomRobot.prototype.handleTouchEnd = function(__e){
		if(this.gameState!=GAME_PAUSED && this.gameState!=GAME_OVER)instance.player.handleTouchEnd(__e);
	}
	
	
	/**
	 * Display game welcome screen
	 */
	BkomRobot.prototype.displayHomeScreen =  function() {
		
		this.stage.addChild(this.levelscreen);
		this.stage.addChild(this.homescreen);
		this.canvas.addEventListener("click",this.handleHomeScreenClick);
	}
	
	/**
	 * Remove homescreen from display list
	 */
	BkomRobot.prototype.removeHomeScreen = function(){
		instance.canvas.addEventListener("click",instance.handleLevelScreenClick);
		instance.stage.removeChild(instance.homescreen);
		instance.homescreen = null;
	}
	
	
	
	/**
	 * Handle click on canvas when application is paused
	 */
	BkomRobot.prototype.handleHomeScreenClick = function(__e) {
		instance.canvas.removeEventListener("click",instance.handleHomeScreenClick);
		Tween.get(instance.homescreen).to({alpha:0,visible:false},500).call(instance.removeHomeScreen);
	}
	
	/**
	 * Handle click on canvas when level is selected
	 */
	BkomRobot.prototype.handleLevelScreenClick = function(__e) {
		instance.canvas.removeEventListener("click",instance.handleLevelScreenClick);
		document.getElementById("gameCanvas").ontouchstart = instance.handleTouchStart;
		document.getElementById("gameCanvas").ontouchend   = instance.handleTouchEnd;
		instance.restart();
		instance.stage.addChild(instance.currentlevelscreen);
		Tween.get(instance.levelscreen).to({alpha:0,visible:false},500).call(instance.removeLevelScreen);
	}
	
	/**
	 * Remove levelscreen from display list
	 */
	BkomRobot.prototype.removeLevelScreen = function(){
		instance.stage.removeChild(instance.levelscreen);
		instance.levelscreen = null;
		
	}
	
	/**
	 * Restart Game to it's initial stage
	 */
	BkomRobot.prototype.restart = function(__e){
		document.onkeydown = this.handleKeyDown;
		document.onkeyup   = this.handleKeyUp;
		
		//USUALY SET UP WILL HAVE TO BE MADE FROM A LEVEL JSON or XML, 
		//FOR DEMO PURPOSE ALL ASSETS ARE HARDCODED
		this.farGround=new Scrollpane([["assets/img/environnement/level1/farground/farground6.jpg?"+Math.random()*1e4,0,-305,375,805],["assets/img/environnement/level1/farground/farground7.jpg?"+Math.random()*1e4,375,-305,375,805],["assets/img/environnement/level1/farground/farground8.jpg?"+Math.random()*1e4,750,-305,375,805]],1,1,this.checkLevelLoading);
	
	
	
	
		this.ground	   = new Ground([["assets/img/environnement/level1/ground/part1.png?"+Math.random()*10000,-60,-115,1690,1039],["assets/img/environnement/level1/ground/part2.png?"+Math.random()*10000,1629,-1213,1450,1393],["assets/img/environnement/level1/ground/part3.png?"+Math.random()*10000,3078,-869,1356,887],["assets/img/environnement/level1/ground/part4.png?"+Math.random()*10000,4494,-1023,1605,1182],["assets/img/environnement/level1/ground/part5.png?"+Math.random()*10000,5742,-658,1164,1131],["assets/img/environnement/level1/ground/part6.png?"+Math.random()*10000,6905,-700,1162,1753],["assets/img/environnement/level1/ground/part7.png?"+Math.random()*10000,8066,-1195,1370,1940],["assets/img/environnement/level1/ground/part8.png",9435,-1422,1501,1625],["assets/img/environnement/level1/ground/part9.png?"+Math.random()*10000,10935,-1701,1499,2099],["assets/img/environnement/level1/ground/part10.png?"+Math.random()*10000,12433,-1926,1503,2316],["assets/img/environnement/level1/ground/part11.png?"+Math.random()*10000,13935,-1967,1499,2312],["assets/img/environnement/level1/ground/part12.png?"+Math.random()*10000,15410,-1579,1503,1922],["assets/img/environnement/level1/ground/part13.png?"+Math.random()*10000,16913,-525,1501,1662],["assets/img/environnement/level1/ground/part14.png?"+Math.random()*10000,18414,-295,1499,1518],["assets/img/environnement/level1/ground/part15.png?"+Math.random()*10000,19907,-291,1300,1207]],0.2,0.1,this.checkLevelLoading);
		//this.foreGround = new Scrollpane([["assets/img/environnement/level1/foreground/part1.png",-170,-660,801,1238],["assets/img/environnement/level1/foreground/part2.png",631,-1000,889,1590],["assets/img/environnement/level1/foreground/part3.png",1520,-1000,707,1587],["assets/img/environnement/level1/foreground/part4.png",2727,-20,2160,690],["assets/img/environnement/level1/foreground/part5.png",4257,-1400,1504,6140],["assets/img/environnement/level1/foreground/part6.png",5782,-1335,1419,1613],["assets/img/environnement/level1/foreground/part7.png",7182,-885,2684,1246],["assets/img/environnement/level1/foreground/part8.png",9082,-1165,1503,359],["assets/img/environnement/level1/foreground/part8.png",16100,-1700,1503,359],["assets/img/environnement/level1/foreground/part8.png",17600,-1750,1503,359],["assets/img/environnement/level1/foreground/part8.png",20300,-1400,1503,359],["assets/img/environnement/level1/foreground/part4.png",16600,-400,1146,368],["assets/img/environnement/level1/foreground/part4.png",18600,-200,1146,368],["assets/img/environnement/level1/foreground/part4.png",19500,-200,1146,368],["assets/img/environnement/level1/foreground/part9.png",21500,-1200,1620,1596],["assets/img/environnement/level1/foreground/part7.png",25500,-715,2684,359]],.2,.1,this.checkLevelLoading);
		this.foreGround = new Scrollpane([],.2,.1,this.checkLevelLoading);
		
		this.foreGround.y = this.ground.y = -18;
	
		//SET COLIDER PROPERTIES
		this.colider = new Colider();
		this.colider.collectable = this.ground.collectable;
		this.colider.bushes = this.ground.bushes;
		this.colider.traps  = this.ground.traps;
		this.colider.guards = this.ground.guards;
		
		//SET PLAYER PROPERTIES
		this.player	= new Player(this.colider);
		this.player.touchMode = this.touchMode;
		this.player.y = -115;
		this.player.x = 100;
		this.checkPoint.x = 200;
		this.checkPoint.y = 100;
		this.player.origin.y = 120;
		this.player.origin.x = 200;	
		
		//SET HUD TEXT
		this.fps = new Text("-- fps","bold 14px Arial","#FFF");
		this.fps.x = 10;
		this.fps.y = 20;		
		
		this.timeField = new Text("Time: 0:00", "25px TitilliumMaps26L500wt", "#FFFFFF");
		this.timeField.textAlign = "left";
		this.timeField.x = 205;
		this.timeField.y = this.canvas.height - 30;
		
		this.collectedField = new Text("Collected: 0/45 ", "25px TitilliumMaps26L500wt", "#FFFFFF");
		this.collectedField.textAlign = "left";
		this.collectedField.x = 58;
		this.collectedField.y = this.canvas.height - 30;
		
		var poster = new Bitmap("assets/img/hud/poster.png");
			poster.x = 10;
			poster.y = this.canvas.height - 70;
			
		var time = new Bitmap("assets/img/hud/time.png");
			time.x = 140;
			time.y = this.canvas.height - 65;
		
		var menu = new Bitmap("assets/img/hud/menu.png");
			menu.x = 600;
			menu.y = this.canvas.height - 50;
			
			
				
		this.stage.addChild(this.farGround);
		this.stage.addChild(this.ground);
		this.ground.addChild(this.player);
		this.ground.addChild(this.colider);
		this.stage.addChild(this.foreGround);
		//this.stage.addChild(this.fps);
		this.stage.addChild(this.timeField);
		this.stage.addChild(this.collectedField);
		this.stage.addChild(poster);
		this.stage.addChild(time);
		//this.stage.addChild(menu);
		
		if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) ||navigator.userAgent.match(/iPod/i)){
			var space = new Bitmap("assets/img/hud/spacebar.png");
			space.x = 325;
			space.y = this.canvas.height - 50;
			this.stage.addChild(space);
			this.fps.y = 480;
			
			poster.y = 20;
			time.y = 20;
			this.collectedField.y = 50;
			this.timeField.y = 50;
			menu.y = 20;
		}
	}
	
	/**
	 * Check level loading
	 */
	BkomRobot.prototype.checkLevelLoading = function(){
		instance.loadedCount++;
		if(instance.loadedCount==2){
			instance.gameState = GAME_STARTED;
			
			Tween.get(instance.currentlevelscreen).wait(1000).to({alpha:0},300).call(function(){instance.stage.removeChild(instance.currentlevelscreen)})
		}
		
	} 
		
	
	/**
	 * Update current game state
	 */
	BkomRobot.prototype.update =  function(__motion){
		if(this.player.scaleX>=1){
			this.camera.x = -Math.round((this.player.origin.x - this.player.x))+125;
			
		}else{
			this.camera.x = -Math.round((this.player.origin.x - this.player.x))-255;
		}
		
		this.camera.y = -Math.round((this.player.origin.y - this.player.y))-0;
		
		this.ground.updatePosition(-this.camera.x,-this.camera.y);
		//this.farGround.updatePosition(-this.camera.x*.1,-this.camera.y*.1);
	}
	
	
	/**
	 * Main Game loop
	 */
	BkomRobot.prototype.tick = function(__e){
		var test = Math.ceil(Ticker.getMeasuredFPS());
		if(instance.gameState==GAME_STARTED || instance.gameState==GAME_END){
			var movement = instance.player.update();
			instance.update(movement);
			instance.ground.update();
			if(!instance.ground.freeze){
				instance.foreGround.update();
				instance.farGround.update();
			}else{
				instance.foreGround.update("Y");
				instance.farGround.update("Y");
			}
		
			instance.fps.text = test+" fps";		
			instance.timeField.text = instance.timeElapsed();
			instance.collectedField.text = ITEM_COLLECTED+"/45";
			
			//Check colision with guards
			if(instance.colider.hitTestGuard(instance.player)){
				instance.gameState = GAME_OVER;
				instance.stage.addChild(instance.retrylevelscreen);
				instance.retrylevelscreen.alpha = 0;
				instance.retrylevelscreen.onClick = instance.retry;
				instance.retrylevelscreen.onPress = instance.retry;
				document.getElementById("gameCanvas").ontouchstart = null;
				document.getElementById("gameCanvas").ontouchend   = null;
				Tween.get(instance.retrylevelscreen).wait(800).to({alpha:1},300);
			};
			
			if(IS_IPAD){
				if(test>=30 && Ticker.getFPS()>30){
					Ticker.setFPS(test-1);
				}else if(test>30){
					Ticker.setFPS(test);
				}else{
					Ticker.setFPS(30);
				}
			}
			
			if(instance.player.y>600 && instance.gameState != GAME_END){
				instance.gameState = GAME_END;
				instance.stage.addChild(instance.endlevelscreen);
				instance.endlevelscreen.visible = true;
				instance.endlevelscreen.alpha = 0;
				instance.endlevelscreen.update(ITEM_COLLECTED,instance.timeElapsed());
				instance.endlevelscreen.onClick = instance.refresh;
				instance.endlevelscreen.onPress = instance.refresh;
				Tween.get(instance.endlevelscreen).to({alpha:1},300);
			}
			
			instance.setCheckPoint();
		}
	
				
		instance.stage.update();
		if (typeof(CollectGarbage) == "function")CollectGarbage();
	}
	
	BkomRobot.prototype.retry = function(){
		document.getElementById("gameCanvas").ontouchstart = instance.handleTouchStart;
		document.getElementById("gameCanvas").ontouchend   = instance.handleTouchEnd;
		instance.player.reset();
		instance.ground.reset();
		instance.ground.addChild(instance.player);
		instance.gameState=GAME_STARTED 
		instance.player.x = instance.checkPoint.x;
		instance.player.y = instance.checkPoint.y;
		Tween.get(instance.retrylevelscreen).wait(200).to({alpha:0},300).call(function(){instance.stage.removeChild(instance.endlevelscreen)});
	}
	
	BkomRobot.prototype.refresh = function(){
		window.location.reload()
	}
	
	BkomRobot.prototype.setCheckPoint = function(){
		if(instance.checkPoint.x<7838 && instance.player.x>7838){
			instance.checkPoint.x = 7838;
			instance.checkPoint.y = -440;
			
		}else if(instance.checkPoint.x<13743 && instance.player.x>13743){
			instance.checkPoint.x = 13744;
			instance.checkPoint.y = -473;
		}else if(instance.checkPoint.x<17852 && instance.player.x>17852){
			instance.checkPoint.x = 17853;
			instance.checkPoint.y = -455;
		}
	}
	
	BkomRobot.prototype.timeElapsed = function(){
		var time = new Date();
		var interval = time.getTime()-this.startTime.getTime();
		var minutes = Math.floor(interval / 60000 );
		interval = interval - (minutes *  60000 );
		var seconds = Math.floor(interval / 1000 );
		
		if(seconds<=9)seconds = "0"+seconds;
		
		return  minutes +"'"+seconds;
	}
	
	
	
window.BkomRobot = BkomRobot;
}(window));