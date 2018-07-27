window.onload = function(e) {
    let tmp =
        document.getElementsByClassName("keys");

    let confirmButton =
        document.getElementById("confirm");

    let btns = [];
    let current = 0;
    let used = [0,0,0,0,0,0,0,0,0];

    let win =
        [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]
        ];

    for (let i = 0; i < tmp.length; ++i) {
        btns.push({
            btn: tmp[i],
            idx: i
        });
    }

    let checkForWin = function() {
        return (win.filter(function (v) {
            return used[v[0]] !== 0 &&
                used[v[0]] === used[v[1]] &&
                used[v[1]] === used[v[2]];
        }).length > 0);
    }

    let myAlert = function(msg) {
        let p = document.getElementById("alert");
        p.innerText = msg;
    }

    confirmButton.onclick =
        function() {
            clear();
        }


    let clear = function() {
        btns.forEach(function(e) {
            e.btn.innerText = "";
            used[e.idx] = 0;
            current = 0;
        });
        myAlert("");
    }

    btns.forEach(function(e) {
        e.btn.onclick = function() {
            if (used[e.idx] !== 0)
                return;
            if (current === 0) {
                e.btn.innerText = 'X';
            } else {
                e.btn.innerText = 'O';
            }
            used[e.idx] = current + 1;
            if (checkForWin()) {
                let currentXO = 'O';
                if (current === 0)
                    currentXO = 'X';
                myAlert(currentXO + ' Wins');
            } else {
                current = 1 - current;
            }
        }
    });

}
