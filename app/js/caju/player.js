/**
 * Player instance use to display a playable character on the scene.
 *
 * Use of Easel.js
 *
 * @author @jp_pinilla
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
	Player.prototype.update = function() {
		if(this.moveRight){
			this.motionRight();
		}else if(this.moveLeft){
			this.motionLeft();
		}else if(this.moveUp){
			this.motionUp();
		}else if(this.moveDown){
			this.motionDown();
		}
	}

	/**
	 * Handle player motion on key down
	 */	
	Player.prototype.handleKeyDown = function(__e){
			if((KEYCODE_RIGHT == __e.keyCode || KEYCODE_D == __e.keyCode ) && !this.moveRight){
				this.triggerMoveRight();
				
			}else if((KEYCODE_LEFT == __e.keyCode || KEYCODE_A == __e.keyCode ) && !this.moveLeft){
				this.triggerMoveLeft();
				
			}else if((KEYCODE_UP == __e.keyCode || KEYCODE_W == __e.keyCode )&& !this.moveUp){
				this.triggerMoveUp();

			}else if((KEYCODE_DOWN == __e.keyCode || KEYCODE_S == __e.keyCode ) && !this.moveDown){
				this.triggerMoveDown();

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
			if(!this.moveLeft && !this.moveUp && !this.moveDown) this.animation.gotoAndPlay("Stand");
		}else if(KEYCODE_LEFT == __e.keyCode || KEYCODE_A == __e.keyCode){
			this.moveLeft = false;
			if(!this.moveRight && !this.moveUp && !this.moveDown) this.animation.gotoAndPlay("Stand");
		}else if(KEYCODE_UP == __e.keyCode|| KEYCODE_W == __e.keyCode){
			this.moveUp = false;
			if(!this.moveRight && !this.moveLeft && !this.moveDown) this.animation.gotoAndPlay("Stand");
		}else if(KEYCODE_DOWN == __e.keyCode|| KEYCODE_S == __e.keyCode){
			this.moveDown = false;
			if(!this.moveRight && !this.moveLeft && !this.moveUp) this.animation.gotoAndPlay("Stand");
		}	
		
	}

	
	/**
	 * Triggere motion left
	 */
	Player.prototype.triggerMoveLeft = function(){

		//if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		this.moveLeft = true;
		this.animation.gotoAndPlay("Run");
		if(this.scaleX!=-1){
			this.scaleX = -1;
			this.x += this.width;
		}
	}

	/**
	 * Triggere motion right
	 */
	Player.prototype.triggerMoveRight = function(){
		
		//if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		this.moveRight = true;
		this.animation.gotoAndPlay("Run");
		if(this.scaleX!=1){
			this.scaleX = 1;
			this.x -= this.width;
		}
	}

	/**
	 * Triggere motion up
	 */
	Player.prototype.triggerMoveUp = function(){

		//if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		this.moveUp = true;
		this.animation.gotoAndPlay("Run");
		if(this.scaleY!=-1){
			this.scaleY = -1;
			this.y += this.height;
		}
	}


	/**
	 * Triggere motion down
	 */
	Player.prototype.triggerMoveDown = function(){
		
		//if(!this.moveUp && !this.moveDown && !(this.downPress && this.isClimbing) && !(this.upPress && this.isClimbing))this.animation.gotoAndPlay("Run");
		this.moveDown = true;
		this.animation.gotoAndPlay("Run");
		if(this.scaleY!=1){
			this.scaleY = 1;
			this.y -= this.height;
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
	 * Move left player and camera
	 */
	Player.prototype.motionUp =  function (){
		if(this.scaleY!=-1){
			this.scaleY = -1;
			this.y += 220;
		}
		
		this.y -= this.speed;
		
		//Test if movement is possible
		var testRect = this.colider.hitTest(this);
		if(testRect){
			this.y += testRect.height
		}
	}
	
	
	/**
	 * Move right player and camera
	 */
	Player.prototype.motionDown = function(){
		if(this.scaleY!=1){
			this.scaleY = 1;
			this.y -= 220;
		}

		this.y += this.speed;
		
		//Test if movement is possible
		var testRect = this.colider.hitTest(this);
		if(testRect){
			this.y -= testRect.height
		}
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
	/*Ground.prototype.collectable  = [new Energy(7040,-70),new Energy(7190,-70),new Energy(7340,-70),new Energy(7490,-70),new Energy(7224,-500),new Energy(7311,-660),new Energy(7415,-780),new Energy(7570,-833),new Energy(8670,-762),new Energy(8820,-762),new Energy(8980,-762),new Energy(9290,-650),new Energy(9440,-650),new Energy(9730,-525),
									new Energy(13144,-750),new Energy(13600,-850),new Energy(14200,-900),new Energy(12900,-1250),new Energy(13500,-1450),new Energy(13500,-1250),new Energy(14000,-1350),new Energy(14200,-1350),new Energy(14400,-1350),new Energy(14900,-1300),new Energy(15450,-1200),new Energy(15900,-1400),new Energy(15900,-1200),new Energy(15900,-1000),
									new Energy(17200,-250),new Energy(17350,-250),new Energy(17500,-250),new Energy(18350,70),new Energy(18500,70),new Energy(19800,-450),new Energy(19950,-450),new Energy(20100,-450),new Energy(20250,-650),new Energy(20400,-450),new Energy(20550,-250),new Energy(21400,0),new Energy(21400,150),new Energy(21400,300),new Energy(21200,450),new Energy(21200,450),new Energy(21200,600)];
	*/
	Ground.prototype.collectable  = [];
	Ground.prototype.bushes 	  = [];
	Ground.prototype.traps 	  = [];
	Ground.prototype.guards 	  = [];
	//Ground.prototype.bushes 	  = [new Bush(10680,-343),new Bush(12000,-343),new Bush(19100,-450)]
	//Ground.prototype.traps        = [new Trap(16200,-350,0,0,240,85)];
	//Ground.prototype.guards 	  = [new Guard(11500,-415,10000,12400,10000,12400),new Guard(16420,-440,15630,15630,15630,15630),new Guard(19300,-540,19050,19800,19050,19800)] //new Guard(1000,130,500,1300,300,1500)];
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
	
	function Caju() {
	  this.initialize();
	}

	Caju.prototype.homescreen = null;
	Caju.prototype.levelscreen = null;
	Caju.prototype.currentlevelscreen = null;
	Caju.prototype.endlevelscreen = null;
	Caju.prototype.retrylevelscreen = null;
	Caju.prototype.instance  = this;
	Caju.prototype.player = null;
	Caju.prototype.canvas  = null;
	Caju.prototype.ground  = null;
	Caju.prototype.fps 	= null;
	Caju.prototype.colider = null;
	Caju.prototype.camera  = new Point(0,0);
	//Caju.prototype.gameState = GAME_PAUSED;
	Caju.prototype.touchMode = false;
	Caju.prototype.timeField  = null;
	Caju.prototype.collectedField  = null;
	Caju.prototype.startTime  = new Date();
	Caju.prototype.rate = 60;
	Caju.prototype.loadedCount = 0;
	Caju.prototype.checkPoint = new Point();	



	Caju.prototype.initialize = function(__x,__y) {
		this.canvas = document.getElementById("app");
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
	 * Display game welcome screen
	 */
	Caju.prototype.displayHomeScreen =  function() {
		
		this.stage.addChild(this.levelscreen);
		this.stage.addChild(this.homescreen);
		this.canvas.addEventListener("click",this.handleHomeScreenClick);
	}

	
	/**
	 * Remove homescreen from display list
	 */
	Caju.prototype.removeHomeScreen = function(){
		instance.canvas.addEventListener("click",instance.handleLevelScreenClick);
		instance.stage.removeChild(instance.homescreen);
		instance.homescreen = null;
	}


	/**
	 * Handle click on canvas when application is paused
	 */
	Caju.prototype.handleHomeScreenClick = function(__e) {
		console.log(__e);
		instance.canvas.removeEventListener("click",instance.handleHomeScreenClick);
		Tween.get(instance.homescreen).to({alpha:0,visible:false},500).call(instance.removeHomeScreen);
	}

	/**
	 * Handle click on canvas when level is selected
	 */
	Caju.prototype.handleLevelScreenClick = function(__e) {
		instance.canvas.removeEventListener("click",instance.handleLevelScreenClick);
		document.getElementById("app").ontouchstart = instance.handleTouchStart;
		document.getElementById("app").ontouchend   = instance.handleTouchEnd;
		instance.restart();
		instance.stage.addChild(instance.currentlevelscreen);
		Tween.get(instance.levelscreen).to({alpha:0,visible:false},500).call(instance.removeLevelScreen);
	}

	/**
	 * Remove levelscreen from display list
	 */
	Caju.prototype.removeLevelScreen = function(){
		instance.stage.removeChild(instance.levelscreen);
		instance.levelscreen = null;
		
	}
	
	/**
	 * Restart Game to it's initial stage
	 */
	Caju.prototype.restart = function(__e){
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
	Caju.prototype.checkLevelLoading = function(){
		instance.loadedCount++;
		if(instance.loadedCount==2){
			instance.gameState = GAME_STARTED;
			
			Tween.get(instance.currentlevelscreen).wait(1000).to({alpha:0},300).call(function(){instance.stage.removeChild(instance.currentlevelscreen)})
		}
		
	} 	

	
window.Caju = Caju;
}(window));