//Box2D = box2D.Box2D;

Vec2 = Box2D.Common.Math.b2Vec2
BodyDef =  Box2D.Dynamics.b2BodyDef
Body =  Box2D.Dynamics.b2Body
FixtureDef =  Box2D.Dynamics.b2FixtureDef
Fixture =  Box2D.Dynamics.b2Fixture
World =  Box2D.Dynamics.b2World
MassData = Box2D.Collision.Shapes.b2MassData
PolygonShape =  Box2D.Collision.Shapes.b2PolygonShape
CircleShape = Box2D.Collision.Shapes.b2CircleShape
DebugDraw =  Box2D.Dynamics.b2DebugDraw
RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef


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
				//for each object, make a collision object
				for (var objIdx = 0; objIdx < layer.objects.length; objIdx++) {
          			var lobj = layer.objects[objIdx]
					var entityDef = {
						id: lobj.name,
						x: lobj.x + (lobj.width * 0.5),
						y: lobj.y + (lobj.height * 0.5),
						dampen: 0,
						angle: 0,
						polyPoints: lobj.polygon,
						type: 'static',
						categories: ['mapobject'],
						collidesWith: ['all'],
						userData: {
						  "id": lobj.name
						}
					}
					//console.log(entityDef)
					//gPhysicsEngine.addBody(entityDef)					
				}
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

		layerContainer = document.createElement("div")
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

			if(arr[i] != 0) layerContainer.appendChild((layer.properties && layer.properties.type == 'sprite') ? drawSprite(left, top, arr[i]-1, clss): drawTile(left, top - floor, arr[i]-1, clss))
		}
		//container.appendChild(layerContainer)
	}


	// Ejemplo de función para dibujar objetos animados
	function drawSprite(left, top, pos, clss) {

		var 
			oImg = new Element('div', {
				'class': 'sprite_element',
				styles: {
					left: left,
					top: top,
					backgroundPosition: '-87px 0px' //ie fix. IE7 no puede obtener las propiedades si estas se ponen a través de la clase
				}
			})
			, width = parseInt(bgImg.width) / sw
			, bleft =  sw * (pos%width)
			, btop = Math.floor(pos/width) * sh_p

			, animation = setInterval(function() {
				var
					pos = oImg.getStyle('background-position').replace(/px/g, '').split(' ')
					, tx = parseInt(pos[0])
					, ty = parseInt(pos[1]) - 80
				oImg.setStyle('background-position', tx + 'px '+ ty +'px')
			}, 50)

		oImg.store('animation', animation)

		oImg.addEvent('click', function() {
			var
				pos = this.getStyle('background-position').replace(/px/g, '').split(' ')
			this.setStyle('background-position', '100px '+pos[1]+'px')
		})

		return oImg
	}

	function drawTile (left, top, pos, clss) {
		var
			oImg = document.createElement("div")
			, width = parseInt(bgImg.width) / sw
			, bleft =  sw * (pos%width)
			, btop = Math.floor(pos/width) * sh_p

		context.drawImage(bgImg, bleft, btop, sw, sh_p, left, top, sw, sh_p)

		oImg.className = clss
		oImg.style.background = 'url('+bgImg.src+') -'+bleft+'px -'+btop+'px no-repeat'
		oImg.style.width = sw+'px'
		oImg.style.height = sh_p+'px'
		oImg.style.left = left+'px'
		oImg.style.top = top+'px'
		return oImg
	}

}($('app'), map_points, $('app-canvas'))