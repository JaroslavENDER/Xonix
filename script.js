window.onload = function () {
    var maxLevel = 5;
    var ui = document.getElementById("ui");
    var uiHeader = document.getElementById("ui__header");
    var buttonPlay = document.getElementById("ui__button-play");
    var buttonClose = document.getElementById("ui__button-exit");
    var buttonUp = document.getElementById("arrows__button-up");
    var buttonLeft = document.getElementById("arrows__button-left");
    var buttonRight = document.getElementById("arrows__button-right");
    var buttonDown = document.getElementById("arrows__button-down");
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
        };
        buttonUp.onclick = function () {
            xonixGame.setDirection(xonixGame.directions.up);
        };
        buttonLeft.onclick = function () {
            xonixGame.setDirection(xonixGame.directions.left);
        };
        buttonRight.onclick = function () {
            xonixGame.setDirection(xonixGame.directions.right);
        };
        buttonDown.onclick = function () {
            xonixGame.setDirection(xonixGame.directions.bottom);
        };
    });

    xonixGame.start(1, true);
}
