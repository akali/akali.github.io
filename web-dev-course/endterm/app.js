window.onload = function(argument) {
	let root = document.getElementById("root");
	let face = document.createElement("div");
	root.appendChild(face);
	let lastElement = null;

	for (let i = 1; i <= 3; ++i) {
		let div = document.createElement("div");
		root.appendChild(div);
		div.innerHTML = i;
		for (let j = 1; j <= 4 - i; ++j) {
			let div2 = document.createElement("div");
			div.appendChild(div2);
			div2.innerHTML = i + "." + j;
			div2.style.marginLeft = "10px";
			for (let k = 1; k <= 3; ++k) {
				let div3 = document.createElement("div");
				div2.appendChild(div3);
				div3.innerHTML = i + "." + j + "." + k;
				div3.style.marginLeft = "10px";
				div3.addEventListener("click", function(e) {
					face.innerHTML = i + " -> " + j + " -> " + k;
					e.srcElement.style.color = "red";
					if (lastElement) {
						lastElement.style.color = "black";
					}
					lastElement = e.srcElement;
				});
			}
		}
	}
}
