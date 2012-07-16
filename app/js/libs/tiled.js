//Box2D = box2D.Box2D;

/*Vec2 = Box2D.Common.Math.b2Vec2
BodyDef =  Box2D.Dynamics.b2BodyDef
Body =  Box2D.Dynamics.b2Body
FixtureDef =  Box2D.Dynamics.b2FixtureDef
Fixture =  Box2D.Dynamics.b2Fixture
World =  Box2D.Dynamics.b2World
MassData = Box2D.Collision.Shapes.b2MassData
PolygonShape =  Box2D.Collision.Shapes.b2PolygonShape
CircleShape = Box2D.Collision.Shapes.b2CircleShape
DebugDraw =  Box2D.Dynamics.b2DebugDraw
RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef*/


!function (container, map, drawingCanvas) {


	var context = drawingCanvas.getContext('2d')

	window.caju_canvas = drawingCanvas
	window.caju_context = context

	var
		contWidth = container.getSize().x
		, contHeight = container.getSize().y
		, sw=map.tilewidth
		, sh=map.tileheight
		, sh_p=map.tilesets[0].tileheight
		//, floor_y=85
		, bgImg = document.createElement("img")

	bgImg.src = map.tilesets[0].image
	bgImg.onload = initilize

	function initilize () {
		for(var i=0; i<map.layers.length; i++) {
			var layer = map.layers[i]
			if(layer.name == 'collision') {
			} else if (layer.data) {
				drawLayer(layer)
			}
		}

		//console.log(sw,sh)
	}


	// Función para dibujar objetos estáticos
	function drawLayer (layer) {
		var
			i=0
			// ISOMETRIC
			//, left = contWidth/2 - sw/2
			// ORTO
			, left = 0
			, top = 0
			, arr = layer.data
			, width = layer.width
			, floor = 0
			, row
			, clss = 'tile'

		/*
		layerContainer.className = layer.name

		/*if(layer.properties)
			layerContainer.className += ' '+layer.properties.type

		if(!layer.visible)
			layerContainer.className += ' opaque'

		*/
		for(;arr.length > i;i++) {

			// ISOMETRIC
			//left += sw/2
			//top += sh/2

			// ORTO
			left += sw

			if(i%width==0) {
				row=Math.floor(i/width)
				top=row*sh
				//ISOMETRIC
				//left=(container.getSize().x)/2 - row*sw/2
				//ORTO
				left = 0
			}

			if(arr[i] != 0) drawTile(left, top - floor, arr[i]-1, clss)
		}
		//container.appendChild(layerContainer)
	}

	function drawTile (left, top, pos, clss) {
		var
			width = parseInt(bgImg.width) / sw
			, bleft =  sw * (pos%width)
			, btop = Math.floor(pos/width) * sh_p

		context.drawImage(bgImg, bleft, btop, sw, sh_p, left, top, sw, sh_p)
	}

}($('app'), map_points, $('app-canvas'))