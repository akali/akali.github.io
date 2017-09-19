window.onload = function() {
	let d = document.getElementsByClassName("date");
	let a = document.createElement("select");
	a.style.height="30px";
	a.style.paddingRight="5px";
	for (let i = 2017; i >= 1905; --i) {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(i));
		a.appendChild(b);
	}
	d[0].appendChild(a);
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	a = document.createElement("select");
	a.style.height="30px";
	a.style.paddingRight="5px";
	months.forEach((val) => {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(val));
		a.appendChild(b);
	});
	d[0].appendChild(a);
	a = document.createElement("select");
	a.style.height="30px";
	a.style.paddingRight="5px";
	for (let i = 1; i <= 31; ++i) {
		let b = document.createElement("option");
		b.appendChild(document.createTextNode(i));
		a.appendChild(b);
	}
	d[0].appendChild(a);
	let q = document.createElement('div');
	q.style.width = "150px";
	q.style.height="30px";
	q.style.marginLeft= "10px";

	a = document.createElement('a');
	a.fontSize = "11px";
	a.href='https://www.facebook.com/';
	a.appendChild(document.createTextNode('Зачем указывать дату рождения?'));
	a.style.fontSize="10px";
	a.style.textDecoration="none";
	a.style.fontFamily="'Helvetica', 'Arial', sans-serif !important;";

	q.appendChild(a);

	d[0].appendChild(q);
}
