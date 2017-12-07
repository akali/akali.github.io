function jsonpCallback(data) {
	console.log(data);
}
$(window).ready(function() {
	$('#js-search-text').keypress(function (e) {
		if (e.which == 13) {
			$('#js-search-form').submit();
			return false;
		}
	});

	let createItem = function(title, rate, f) {
		let div = document.createElement("div");
		div.classList.add("item");
		let img = document.createElement("img");
		img.setAttribute("src", "icons/play.png");
		img.setAttribute("alt", "play");
		div.appendChild(img);
		let span = document.createElement("span");
		span.innerHTML = title;
		span.addEventListener("click", f);
		div.appendChild(span);
		let span2 = document.createElement("span");
		span2.innerHTML = rate;
		span2.classList.add("rate");
		div.appendChild(span2);
		return div;
		// <div class="item">
		// 	<img src="icons/play.png" alt="play">
		// 	<span>samle song</span>
		// 	<span class="rate">5</span>
		// </div>
	}

	let playSong = function(url) {
		// alert(url);
	}
	let songs = JSON.parse(localStorage.getItem("songs"));
	if (!songs) songs = {}

	// notifyDatasetChanged(songs);
	let notifyDatasetChanged;
	let addSong = function(title, obj) {
		songs[title] = obj;
		localStorage.setItem("songs", JSON.stringify(songs));
		console.log(songs);
		notifyDatasetChanged(songs);
	}

	let removeSong = function(title) {
		delete songs[title];
		localStorage.setItem("songs", JSON.stringify(songs));
		notifyDatasetChanged(songs);
	}

	notifyDatasetChanged = function(data, sortF) {
		let elems = document.createElement("div");
		let last;
		$("#js-songs-list").html("");
		Object.keys(data)
		.sort(function (a, b) {
			if (sortF) return sortF(a, b);
			return a - b;
		}) 
		.forEach(function(key) {
			let title = key;
			let url = data[key][0];
			let rate = data[key][1];
			// console.log("~" + title + " " + url + " " + rate);
			let elem = createItem(title, rate, function() {
				$("#js-detail-input-title").val(title);
				$("#js-detail-input-url").val(url);
				$("#js-detail-input-rate").val(rate);
				$("#js-detail").modal("show");
				removeSong(title);
				$("#js-detail-save-button").click(function() {
					let title = $("#js-detail-input-title").val();
					let url = $("#js-detail-input-url").val();
					let rate = $("#js-detail-input-rate").val();
					addSong(title, [url, rate]);
					$("#js-detail").modal("hide");
				});
			});
			let f = function() {
				console.log(url);
				playSong(url);
				if (last) {
					last.childNodes[0].setAttribute("src", "icons/play.png");
				}
				last = elem;
				elem.childNodes[0].setAttribute("src", "icons/pause.png");
			};
			elem.addEventListener("click", f);
			elems.appendChild(elem);
		});
		$("#js-songs-list").append(elems);// = ();
	}

	notifyDatasetChanged(songs);

	$("#js-fab").click(function(event) {
		$("#js-add-music").modal("show");
	});

	$("#js-save-button").click(function() {
		let title = $("#js-input-title").val();
		let url = $("#js-input-url").val();
		let rate = $("#js-input-rate").val();
		addSong(title, [url, rate]);
		$("#js-add-music").modal("hide");
	});

	$("#js-search-form").on("submit", function(e) {
		e.preventDefault();
		let songName = $("#js-search-text").val();
		let newSongs = {};
		let byRate = $("#js-sort-by-rate")[0].checked;
		Object.keys(songs).forEach(function(e) {
			if (e.indexOf(songName) !== -1)
				newSongs[e] = songs[e];
		});
		let sort;
		if (byRate)
			sort = function(a, b) {
				return songs[a][1] - songs[b][1];
			};
		notifyDatasetChanged(newSongs, sort);
	});
});

