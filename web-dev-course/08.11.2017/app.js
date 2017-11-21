Calculator = function(){};

Calculator.prototype.render = function(given) {
	let setStyles = function(element, styles) {
		for (let key in styles)
			element.style[key] = styles[key];
	}

	let createButton = function(character, f) {
		let element = document.createElement('button');
		setStyles(element, {
			height:"40px",
			width:"40px",
			backgroundColor:"white",
			border:"1px solid black",
			color:"black"
		});
		element.innerHTML = character;
		element.addEventListener("click", f);
		return element;
	}

	let createRadioButton = function(value, name, id, checked, f) {
		let root = document.createElement('div');
		let element = document.createElement('input');
		element.type = 'radio';
		element.id = id;
		element.name = name;
		element.addEventListener("change", f);
		element.checked = checked;
		let element2 = document.createElement('label');
		element2.for = id;
		element2.innerHTML = value;
		setStyles(root, {
			height:"40px",
			width:"40px",
			backgroundColor:"white",
			border:"1px solid black",
			color:"black"
		});
		root.appendChild(element);
		root.appendChild(element2);
		return root;
	}

	let adder = function(character, input) {
		input.innerHTML = input.innerHTML + character;
	}

	let body = document.getElementsByTagName('body')[0];
	let rootDiv = document.createElement('div');
	let input = document.createElement('div');
	let operations = document.createElement('div');

	setStyles(input, {
		height:"40px",
		width:"640px",
		fontSize:"1.5em",
		border:"1px solid black"
	});

	operations.appendChild(createButton('C', function() {
		input.innerHTML = '';
	}));

	let last = 10;
	let reparse = function(exp, toSystem) {
		let exps = (exp
			.replace('+', ' ')
			.replace('-', ' ')
			.replace('*', ' ')
			.replace('/', ' ')
			.split(' ')
			.map(function(e) {
				return (parseInt(e, last) >>> 0).toString(toSystem);
			}));
		let lst = 0;
		let result = '';
		result = result + exps[lst++];
		for (let i = 0; i < exp.length; ++i) {
			if (ops.indexOf(exp[i]) >= 0) {
				result = result + exp[i] + exps[lst++];
			}
		}
		last = toSystem;
		return result;
	}

	operations.appendChild(createButton('=', function() {
		input.innerHTML = eval(reparse(input.innerHTML, last));
	}));
	
	let ops = ['+', '-', '/', '*'];
	for (let i = 0; i < ops.length; ++i) {
		operations.appendChild(createButton(ops[i], function() {
			input.innerHTML = input.innerHTML + ops[i];
		}));
	}

	let numbers = document.createElement('div');

	for (let i = 0; i < 10; i++) {
		numbers.appendChild(createButton(i, function() {
			input.innerHTML = input.innerHTML + i;
		}));
	}
	operations.appendChild(numbers);

	let systems = ['binary', 'octal', 'decimal'];
	let systemsDiv = document.createElement('div');

	for (let i = 0; i < systems.length; ++i) {
		let s = 10;
		if (systems[i] === 'binary') s = 2;
		if (systems[i] === 'octal') s = 8;
		let button = createRadioButton(systems[i], "system", systems[i], s === 10, function(e) {
			input.innerHTML = reparse(input.innerHTML, s);
			for (let x = 0; x < s; ++x) {
				numbers.childNodes[x].disabled = false;
			}
			for (let x = s; x < 10; ++x) {
				numbers.childNodes[x].disabled = true;
			}
		});

		systemsDiv.appendChild(button);
	}
	
	rootDiv.appendChild(input);
	rootDiv.appendChild(operations);
	rootDiv.appendChild(systemsDiv);
	body.appendChild(rootDiv);

	setStyles(rootDiv, {
		width: "960px",
		display: "flex",
		"flex-direction": "column",
		"align-items": "center",
		margin: "0 auto"
	});
};

window.onload = function() {
	let calculator = new Calculator();
	calculator.render();
}
