let Authe = function() {
	this.currentUser = null;//localStorage.getItem("currentUser");
	this.users = {}
	this.getCurrentUser = function() {
		return this.currentUser;
	}

	this.init = function() {
		let users = JSON.parse(localStorage.getItem("users"));
		if (!users) users = {};
		this.users = users;
		this.currentUser = localStorage.getItem("currentUser");
		
		console.log(this.currentUser);
	}
	this.register = function(login, password) {
		this.users[login] = password;
		console.log(this.users);
		localStorage.setItem("users", JSON.stringify(this.users));
	}
	this.checkLogin = function(login, password) {
		return password === this.users[login];
	}
	this.login = function(user) {
		this.currentUser = user;
		localStorage.setItem("currentUser", user);
	}
	this.logout = function() {
		this.currentUser = undefined;
		localStorage.removeItem("currentUser");
	}
	this.userHasBeenTaken = function(user) {
		return this.users[user];
	}
}

Array.prototype.last = function(){
	return this[this.length - 1];
};

$(window).ready(function() {
	let authe = new Authe();//.prototype.init();
	authe.init();

	let currentUser = authe.getCurrentUser();
	let currentPage = window.location.href.split('/').last();
	console.log(currentUser);
	if (!currentUser) {
		$("#js-logout-button").html("login");
		$("#js-logout-button").click(function(event) {
			event.preventDefault();
			window.location = "login.html";
		});
		if (currentPage != "index.html" && 
			currentPage != "login.html" && 
			currentPage != "register.html")
			window.location.replace("login.html");
	} else {
		$("#js-logout-button").click(function(event) {
			event.preventDefault();
			authe.logout();
			window.location = "index.html";
		});
		console.log(currentPage + " " + currentUser);
		if (currentPage === "login.html" ||
			currentPage === "register.html") {
			window.location = "index.html";
		}
	}

	$("#js-register-form").submit(function(event) {
		event.preventDefault();
		let login = $("#js-email").val();
		let password = $("#js-password").val();
		if (!authe.userHasBeenTaken(login)) {
			authe.register(login, password);
			authe.login(login);
			window.location = "index.html";
		} else {
			$("#js-error").attr("style", "display:block;");
		}
	});	

	$("#js-login-form").submit(function(event) {
		event.preventDefault();
		let login = $("#js-email").val();
		let password = $("#js-password").val();
		if (authe.checkLogin(login, password)) {
			authe.login(login);
			window.location = "index.html";
		} else {
			$("#js-error").attr("style", "display:block;");
		}
	});

	$("#js-signup-button").click(function(event) {
		event.preventDefault();
		window.location = ("register.html");
	});
});
