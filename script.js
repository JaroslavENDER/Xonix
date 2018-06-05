window.onload = function () {
    var maxLevel = 5;
    var ui = document.getElementById("ui");
    var uiHeader = document.getElementById("ui__header");
    var buttonPlay = document.getElementById("ui__button-play");
    var buttonClose = document.getElementById("ui__button-exit");
    var showUI = function (message) {
        uiHeader.innerText = message;
        ui.removeAttribute("hidden");
    };

    buttonPlay.onclick = function () {
        ui.setAttribute("hidden", "");
        xonixGame.start();
    };

    buttonClose.onclick = function () { window.close(); };

    xonixGame.onlevelclear = function () {
        xonixGame.stop();
        var level = xonixGame.getLevel();
        if (level === maxLevel)
            showUI("You win");
        else
            xonixGame.start(level + 1);
    };

    xonixGame.ongameover = function () {
        xonixGame.stop();
        showUI("Game over");
    };

    xonixGame.setUIControls(function () {
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    xonixGame.setDirection(xonixGame.directions.left);
                    break;
                case 38:
                    xonixGame.setDirection(xonixGame.directions.up);
                    break;
                case 39:
                    xonixGame.setDirection(xonixGame.directions.right);
                    break;
                case 40:
                    xonixGame.setDirection(xonixGame.directions.bottom);
                    break;
            }
        }
    });

    xonixGame.start(1, true);
}
