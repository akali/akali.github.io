function myAuthorizationRoutine() {
	$("#my-js-logout").click(function() {
		localStorage.removeItem("currentUser");
		location.reload();
	});
	let users2 = JSON.parse(localStorage.getItem("users2"));
	if (!users2)
		users2 = {};
	// localStorage.setItem("currentUser", null);
	let checkLogin = function() {
		return (localStorage.getItem("currentUser"));
	}

	let check = function(login, password) {
		if (users2[login] === password) {
			localStorage.setItem("currentUser", login);
			return true;
		}
		return false;
	}

	let register = function(login, password) {
		// alert(password);
		users2[login] = password;
		localStorage.setItem("currentUser", login);
		localStorage.setItem("users2", JSON.stringify(users2));
	}

	if (!checkLogin()) {
		$("#js-login-modal").modal(({
			keyboard: false
		}));
		$("#js-login-modal").modal("show");
	}

	let isRegistering = false;

	($("#js-login")).on("click", function() {
		let email = $("#js-email").val();
		let password = $("#js-password").val();

		if (isRegistering) {
			register(email, password);
			$("#js-login-modal").modal("hide");
		} else {
			if (check(email, password)) {
				$("#js-login-modal").modal("hide");
			}
		}
	});

	($("#js-login-tab")).click(function() {
		isRegistering = false;
		($("#js-login")).html("Sign in");
	});
	($("#js-register-tab")).click(function() {
		isRegistering = true;
		($("#js-login")).html("Sign up");
	});
}

window.addEventListener("load", myAuthorizationRoutine);
