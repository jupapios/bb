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
		if(navigator.userAgent.match(/iPad/i))IS_IPAD=true;
		
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
		this.farGround  = new Scrollpane([["assets/img/environnement/level1/farground/farground1.jpg",0,-305,375,805],["assets/img/environnement/level1/farground/farground2.jpg",375,-305,375,805],["assets/img/environnement/level1/farground/farground3.jpg",750,-305,375,805],["assets/img/environnement/level1/farground/farground4.jpg",1125,-305,375,805],["assets/img/environnement/level1/farground/farground5.jpg",1500,-305,375,805],["assets/img/environnement/level1/farground/farground6.jpg",1875,-305,375,805],["assets/img/environnement/level1/farground/farground7.jpg",2250,-305,375,805],["assets/img/environnement/level1/farground/farground8.jpg",2625,-305,375,805]],1,1,this.checkLevelLoading);
		this.ground	   = new Ground([["assets/img/environnement/level1/ground/part1.png",-60,-415,1690,1039],["assets/img/environnement/level1/ground/part2.png",1629,-1213,1450,1393],["assets/img/environnement/level1/ground/part3.png",3078,-1019,1356,887],["assets/img/environnement/level1/ground/part4.png",4494,-1023,1605,1182],["assets/img/environnement/level1/ground/part5.png",5742,-658,1164,1131],["assets/img/environnement/level1/ground/part6.png",6905,-1400,1162,1753],["assets/img/environnement/level1/ground/part7.png",8066,-1445,1370,1940],["assets/img/environnement/level1/ground/part8.png",9435,-1422,1501,1625],["assets/img/environnement/level1/ground/part9.png",10935,-1701,1499,2099],["assets/img/environnement/level1/ground/part10.png",12433,-1926,1503,2316],["assets/img/environnement/level1/ground/part11.png",13935,-1967,1499,2312],["assets/img/environnement/level1/ground/part12.png",15410,-1579,1503,1922],["assets/img/environnement/level1/ground/part13.png",16913,-1185,1501,1662],["assets/img/environnement/level1/ground/part14.png",18414,-1095,1499,1518],["assets/img/environnement/level1/ground/part15.png",19907,-791,701,1207]],0.2,0.1,this.checkLevelLoading);
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
		this.farGround.updatePosition(-this.camera.x*0.10,-this.camera.y*0.10);
		this.foreGround.updatePosition(-this.camera.x*1.3,-this.camera.y)
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
		if(instance.checkPoint.x<8138 && instance.player.x>8138){
			instance.checkPoint.x = 8139;
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