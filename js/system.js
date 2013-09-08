function system(){
	// in 3script.js
	start();
	var colors = ["Mech Events", "Engineer", "Mathematica", "yellow", "brown", "black"];
	console.log(camera.position);
	$('.searchBox').typeahead({source: colors});
}
window.onload=system;
