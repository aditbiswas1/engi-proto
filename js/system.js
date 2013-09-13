function system(){
	// in 3script.js
	start();

	// controlling mouse
	var colors = ["Mech Events", "Engineer", "Mathematica", "yellow", "brown", "black"];
	console.log(camera.position);
	$('.searchBox').typeahead({source: colors});
}


// put this in 3script later
var alpha=0;
function VScroll(isScrollUp){
	var vect = new THREE.Vector3();
	vect.x=0;
	vect.y = 0;
	vect.z = -3000;
	var destination=[]
	for(var i=0;i<targets.table.length;i++){
		var node=targets.table[i];
		if(isScrollUp){
			node.position.y+=30;
		}
		else{
			node.position.y-=30;
		}
		node.lookAt(vect);
		destination.push(node);
	}
	transform(destination,100);
	
/*
	var destination=[];
	alpha+=Math.PI/18;
	getNextScroll(targets.table,destination,alpha);
	transform(destination,50);
	*/
}
var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x
$(window).bind(mousewheelevt, function(event) {
    	if (event.originalEvent.wheelDelta >= 0)
		VScroll(true);
    	else 
		VScroll(false);
});
window.onload=system;
