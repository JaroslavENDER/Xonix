var xonixGame = (function () {
    var canvas;
    var resources;
    var gameObjects;
    var xonix;
    var width = 640;
    var height = 360
    var level = 1;
    var directions = { up: 1, right: 2, bottom: 3, left: 4 };

    var init = function () {
        canvas = document.getElementById("canvas").getContext("2d");
    }
    var loadResources = function () {
        resources = {};
        resources.background = new Image();
        resources.background.src = "images/level" + level + ".jpg";
    }
    var createGameObjects = function () {
        gameObjects = [];
        xonix = (function () {
            var x = 300;
            var y = 0;
            var [width, height] = [10, 10];
            var color = "#000";
            var maxVelocity = 2;
            var [currentOffsetX, currentOffsetY] = [0, 0];
            return {
                render: function (canvas) {
                    canvas.fillRect(x, y, width, height);
                },
                setDirection: function (direction) {
                    switch (direction) {
                        case directions.up:
                            currentOffsetY = -maxVelocity;
                            break;
                        case directions.bottom:
                            currentOffsetY = maxVelocity;
                            break;
                        case directions.left:
                            currentOffsetX = -maxVelocity;
                            break;
                        case directions.right:
                            currentOffsetX = maxVelocity;
                            break;
                    }
                },
                stop: function () {
                    currentOffsetX = currentOffsetY = 0;
                },
                update: function () {
                    x += currentOffsetX;
                    y += currentOffsetY;
                }
            }
        })();
        gameObjects.push(xonix);
    }
    var run = function () {
        update();
        render(run);
    }
    var update = function () {
        for (var key in gameObjects) {
            gameObjects[key].update();
        }
    }
    var render = function (callback) {
        canvas.clearRect(0, 0, width, height);
        canvas.drawImage(resources.background, 0, 0 - Math.abs(resources.background.height - height) / 2);
        for (var key in gameObjects)
            gameObjects[key].render(canvas);
        window.requestAnimationFrame(function () { callback(); });
    }

    return {
        start: function () {
            console.log("game starting");
            init();
            loadResources();
            createGameObjects();
            run();
            console.log("game started");
        },
        getCanvas: function () {
            return canvas;
        }
    }
})();

window.onload = xonixGame.start;