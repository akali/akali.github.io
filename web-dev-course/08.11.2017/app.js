Calculator = function(){};

Calculator.prototype.render = function() {
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

	operations.appendChild(createButton('=', function() {
		input.innerHTML = eval(input.innerHTML);
	}));
	
	let ops = ['+', '-', '/', '*'];
	for (let i = 0; i < ops.length; ++i) {
		operations.appendChild(createButton(ops[i], function() {
			input.innerHTML = input.innerHTML + ops[i];
		}));
	}

	for (let i = 0; i < 10; i++) {
		operations.appendChild(createButton(i, function() {
			input.innerHTML = input.innerHTML + i;
		}));
	}

	rootDiv.appendChild(input);
	rootDiv.appendChild(operations);
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
