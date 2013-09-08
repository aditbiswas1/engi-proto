var table = [];
var camera, cameraAngle, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var chosen = [];

var block = new RegExp("^block");
var spinning = new RegExp("^spinning");
var ele;

var printText = ":::::";
var message;
/*for (i in chosen)
{
	printText = printText + "<br/>" + chosen[i].id;
}
printText = printText + "<br/>:::::";
document.getElementById("mess").innerHTML = printText;*/

function getAllChildren(element , regex) {
	if (element.id == undefined)
		return null;
	if (element.hasChildNodes())
	{
		var array = element.childNodes;
		for (x in array)
		{
			if (array[x].id == undefined)
				continue;
			if (regex.test(array[x].id)) //if (array[x].id.match(regex) != null)
			{
				chosen.push (array[x]);
			}
			//document.write(array[x].id+"<br/>");
			else if (array[x].hasChildNodes())
			{
				getAllChildren(array[x] , regex);
			}
		}
	}
}

function getAllChildrenDiv(element) {
	
	if (element.id == undefined)
		return null;
	if (element.hasChildNodes())
	{
		var array = element.childNodes;
		for (x in array)
		{
			if (array[x].id == undefined)
				continue;
			if (array[x].tagName == "DIV")
			{
				chosen.push (array[x]);
			}
			//document.write("Tag Name = "+array[x].tagName+"<br/>");
			//if (array[x].hasChildNodes())
			//{
			//	getAllChildren(array[x] , regex);
			//}
		}
	}
}


function init() {

	cameraAngle = 75;
	camera = new THREE.PerspectiveCamera( cameraAngle, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = window.innerHeight/(2*Math.tan((Math.PI/180)*(cameraAngle/2)));
	/*console.log("inner width = "+window.innerWidth);
	console.log("inner height = "+window.innerHeight);
	console.log("doc width = "+document.width);
	console.log("doc height = "+document.height);*/
		
	// table

	for ( var i = 0; i < chosen.length; i ++ ) {

		var rect = chosen[i].getBoundingClientRect();
		var object = new THREE.Object3D();
		var boxleft = rect.left;
		var boxtop = rect.top;
		var boxwidth = rect.right-rect.left;//chosen[i].offsetWidth;
		var boxheight = rect.bottom-rect.top;//chosen[i].offsetHeight;
		object.position.x = boxleft - (window.innerWidth/2) + boxwidth/2;
		object.position.y = (window.innerHeight/2) - boxtop - boxheight/2;
		var vect = new THREE.Vector3();
		vect.x = 0;
		vect.y = 0;
		vect.z = -3000;
		object.lookAt( vect );
		var ratio = object.position.y / vect.z;
		var theta = Math.atan(ratio);
		object.position.y = vect.z * Math.sin(theta);
		object.position.z = vect.z - vect.z * Math.cos(theta);
		//console.log(object.position.x +":::::"+ object.position.y);
		//console.log("height = "+ boxheight +" width = "+ boxwidth);
		targets.table.push( object );

	}

	scene = new THREE.Scene();
	for ( var i = 0; i < chosen.length; i ++ ) 
	{

		var object = new THREE.CSS3DObject( chosen[i] );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		object.rotation.x = Math.random() % Math.PI*2;
		object.rotation.y = Math.random() % Math.PI*2;
		object.rotation.z = Math.random() % Math.PI*2;
		//object.position.x = targets.table[i].position.x;
		//object.position.y = targets.table[i].position.y;
		//object.position.z = targets.table[i].position.z;
		scene.add( object );
		objects.push( object );
	}

	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) 
	{

		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();
		var radius = 1500;
		object.position.x = radius * Math.cos( theta ) * Math.sin( phi );
		object.position.y = radius * Math.sin( theta ) * Math.sin( phi );
		object.position.z = radius * Math.cos( phi );

		//vector.copy( object.position ).multiplyScalar( 2 );
		vector.x = 0;
		vector.y = 0;
		vector.z = 10000;
		object.lookAt( vector );

		targets.sphere.push( object );

	}

	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = i * 0.175 + Math.PI;

		var object = new THREE.Object3D();
		var radius = 1100;
		
		object.position.x = radius * Math.sin( phi );
		object.position.y = - ( i * 8 ) + 450;
		object.position.z = radius * Math.cos( phi );

		vector.copy( object.position );
		vector.x *= 2;
		vector.z *= 2;

		object.lookAt( vector );

		targets.helix.push( object );

	}

	// grid

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = new THREE.Object3D();

		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

		targets.grid.push( object );

	}

	//

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).innerHTML="";
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	//

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.staticMoving=true;
	controls.addEventListener( 'change', render );
	
	var transformTime = 1500;
	
	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.table, transformTime );

	}, false );

	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.sphere, transformTime );

	}, false );

	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.helix, transformTime );

	}, false );

	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {

		transform( targets.grid, transformTime );

	}, false );

	transform( targets.table, 3000 );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, /*Math.random() * */duration + duration )
			.easing( TWEEN.Easing.Elastic.Out )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, /*Math.random() * */duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
			

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();
	controls.update();

}

function render() {

	renderer.render( scene, camera );

}

function start() 
{
	ele = document.getElementById("container");
	
	message = window.innerWidth + "::::" + window.innerHeight + "<br/>";
	getAllChildren(ele, block);
	for ( var i = 0; i < chosen.length; i ++ ) 
	{
		var rect = chosen[i].getBoundingClientRect();
		message = message + "<br/>"+ chosen[i].id+ "@@@" +rect.left +":::"+ rect.top +":::"+ rect.right +":::"+ rect.bottom +"<br/>";
	}
	//document.getElementById("mess").innerHTML = message;
	init();
	animate();
}
