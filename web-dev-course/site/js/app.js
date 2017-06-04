window.onload = function(){
	let overlays = document.getElementsByClassName('overlay');
	let handlerIn = function(event) {
		let cur = event.target;
		let id = cur.id;
		let modalId = "m" + id;
		let modal = document.getElementById(modalId);
		modal.style.visibility = "visible";
		console.log(modal);
	};
	let handlerOut = function(event) {
		let cur = event.target;
		let id = cur.id;
		let modalId = "m" + id;
		let modal = document.getElementById(modalId);
		modal.style.visibility = "hidden";
	};
	for (let i = 0; i < overlays.length; ++i) {
		overlays[i].onmouseover = handlerIn;
		overlays[i].onmouseout = handlerOut;
	}
};
