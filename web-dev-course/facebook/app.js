window.onload = function() {
	let d = document.getElementsByClassName("date");
	let a = document.createElement("select");
	for (let i = 2017; i >= 1905; --i) {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(i));
		a.appendChild(b);
	}
	d[0].appendChild(a);
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	a = document.createElement("select");
	months.forEach((val) => {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(val));
		a.appendChild(b);
	});
	d[0].appendChild(a);
	a = document.createElement("select");
	for (let i = 1; i <= 31; ++i) {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(i));
		a.appendChild(b);
	}
	d[0].appendChild(a);
	a = document.createElement('a');
	a.href='https://www.facebook.com/';
	a.appendChild(document.createTextNode('Зачем указывать дату рождения?'));
	a.class='whybday';
	a.style.fontSize="10px";
	a.style.textDecoration="none";
	a.style.fontFamily="'Helvetica', 'Arial', sans-serif !important;";
	
	d[0].appendChild(a);
}
