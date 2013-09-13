var table = [];
var camera, cameraAngle, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var chosen = [];

var REblock = new RegExp("^block");
var REpage = new RegExp("^page");
var ele;

var printText = ":::::";
var message;

function getAllChildren(element , regex, chosenElements) {
	
	if (element.id == undefined)
		return null;
	if (element.hasChildNodes())
	{
		var array = element.childNodes;
		for (x in array)
		{
			if (array[x].id == undefined)
				continue;
			if (regex.test(array[x].id))
			{
				chosenElements.push (array[x]);
			}
			else if (array[x].hasChildNodes())
			{
				getAllChildren(array[x] , regex, chosenElements);
			}
		}
	}
}

function getPageTargets(source, destination)
{
	var rect, object, boxleft, boxtop, boxwidth, boxheight, ratio, theta;
	var vect = new THREE.Vector3();
	vect.y = 0;
	vect.z = -1000;
	for ( var i = 0; i < source.length; i ++ ) 
	{
		rect = source[i].getBoundingClientRect();
		object = new THREE.Object3D();
		boxleft = rect.left;
		boxtop = rect.top;
		boxwidth = rect.right-rect.left;
		boxheight = rect.bottom-rect.top;
		object.position.x = boxleft - (window.innerWidth/2) + boxwidth/2;
		object.position.y = (window.innerHeight/2) - boxtop - boxheight/2;
		vect.x = object.position.x;
		ratio = object.position.y / vect.z;
		theta = Math.atan(ratio);
		object.position.y = vect.z * Math.sin(theta);
		object.position.z = vect.z - vect.z * Math.cos(theta);
		object.lookAt( vect );
		destination.push( object );
	}
}

var alpha = 0;
function getNextScroll(source, destination, alpha)
{
	var vect = new THREE.Vector3();
	vect.y = 0;
	vect.z = -3000;
	var object;
	for ( var i = 0; i < source.length; i ++ )
	{
		object = new THREE.Object3D();
		vect.x = source[i].position.x;
		var theta = Math.atan(source[i].position.y / vect.z) + alpha;
		/*
		object.position.y = vect.z * Math.sin(theta);
		object.position.z = vect.z - vect.z * Math.cos(theta);
		*/
		object.position.y = 0;
		object.position.z = 0;
		object.lookAt( vect );
		destination.push( object );
	}
}

function getSphereTargets(source, destination, radius)
{
	var vector = new THREE.Vector3();
	var phi, theta, object;
	for ( var i = 0, l = source.length; i < l; i ++ ) 
	{
		phi = Math.acos( -1 + ( 2 * i ) / l );
		theta = Math.sqrt( l * Math.PI ) * phi;
		object = new THREE.Object3D();
		object.position.x = radius * Math.cos( theta ) * Math.sin( phi );
		object.position.y = radius * Math.sin( theta ) * Math.sin( phi );
		object.position.z = radius * Math.cos( phi );
		vector.copy( object.position ).multiplyScalar( 2 );
		object.lookAt( vector );
		destination.push( object );
	}
}

function getHelixTargets(source, destination, radius)
{
	var vector = new THREE.Vector3();
	var phi, object;
	for ( var i = 0, l = source.length; i < l; i ++ ) 
	{
		var phi = i * 0.175 + Math.PI;
		var object = new THREE.Object3D();
		object.position.x = radius * Math.sin( phi );
		object.position.y = - ( i * 8 ) + 450;
		object.position.z = radius * Math.cos( phi );
		vector.copy( object.position );
		vector.x *= 2;
		vector.z *= 2;
		object.lookAt( vector );
		destination.push( object );
	}
}

function getGridTargets(source, destination)
{
	var object;
	for ( var i = 0; i < source.length; i ++ ) {
		object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;
		destination.push( object );
	}
}

function getRandomTarget(object)
{
	object.position.x = (Math.random() * 4000 + 1000)*Math.pow(-1,Math.floor(Math.random()*100));
	object.position.y = (Math.random() * 4000 + 1000)*Math.pow(-1,Math.floor(Math.random()*100));
	object.position.z = (Math.random() * 4000 + 1000)*Math.pow(-1,Math.floor(Math.random()*100));
	//object.position.x = Math.random() * 4000 - 2000;
	//object.position.y = Math.random() * 4000 - 2000;
	//object.position.z = Math.random() * 4000 - 2000;
	object.rotation.x = Math.random() % Math.PI*2;
	object.rotation.y = Math.random() % Math.PI*2;
	object.rotation.z = Math.random() % Math.PI*2;
}

function init() {

	cameraAngle = 75;
	camera = new THREE.PerspectiveCamera( cameraAngle, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = window.innerHeight/(2*Math.tan((Math.PI/180)*(cameraAngle/2)));
	scene = new THREE.Scene();
	
	getPageTargets(chosen, targets.table);
	getSphereTargets(chosen, targets.sphere, 900);
	getHelixTargets(chosen, targets.helix, 1100);
	getGridTargets(chosen, targets.grid);
	
	for ( var i = 0; i < chosen.length; i ++ ) 
	{
		var object = new THREE.CSS3DObject( chosen[i] );
		getRandomTarget(object);
		scene.add( object );
		objects.push( object );
	}

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	document.getElementById( 'container' ).innerHTML="";
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	/*
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.addEventListener( 'change', render );
	*/
	
	var transformTime = 1500;
	
	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {transform(objects, targets.table, transformTime );}, false );

	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {transform(objects, targets.sphere, transformTime );}, false );

	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {transform(objects, targets.helix, transformTime );}, false );

	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {transform(objects, targets.grid, transformTime );}, false );

	transform(objects, targets.table, 3000 );
	window.addEventListener( 'resize', onWindowResize, false );
}

function transform(sources, targets, duration ) 
{
	TWEEN.removeAll();
	for ( var i = 0; i < sources.length; i ++ ) 
	{
		var object = sources[ i ];
		var target = targets[ i ];
		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Elastic.Out )
			.start();
		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
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
	//controls.update();

}

function render() {
	renderer.render( scene, camera );
}

function start() 
{
	ele = document.getElementById("container");
	getAllChildren(ele, REblock,chosen);
	init();
	animate();
}
