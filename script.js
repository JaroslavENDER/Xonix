var xonixGame = (function () {
    var canvas;
    var resources;
    var gameObjects;
    var width = 640;
    var height = 360
    var level = 1;
    var directions = { up: 1, right: 2, bottom: 3, left: 4 };

    var initUI = function () {
        canvas = document.getElementById("canvas").getContext("2d");
        window.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    gameObjects.xonix.setDirection(directions.left);
                    break;
                case 38:
                    gameObjects.xonix.setDirection(directions.up);
                    break;
                case 39:
                    gameObjects.xonix.setDirection(directions.right);
                    break;
                case 40:
                    gameObjects.xonix.setDirection(directions.bottom);
                    break;
            }
        }
    }
    var loadResources = function () {
        resources = {};
        resources.background = new Image();
        resources.background.src = "images/level" + level + ".jpg";
    }
    var createGameObjects = function () {
        gameObjects = {};
        gameObjects.xonix = (function () {
            var size = 10;
            var x = 30 * size;
            var y = 0 * size;
            var maxVelocity = 10;
            var [currentOffsetX, currentOffsetY] = [0, 0];
            return {
                render: function (canvas) {
                    canvas.fillStyle = "#650F94";
                    canvas.fillRect(x, y, size, size);
                    canvas.fillStyle = "#fff";
                    canvas.fillRect(x + 2, y + 2, size - 4, size - 4);
                    canvas.fillStyle = "#000";
                },
                setDirection: function (direction) {
                    currentOffsetX = currentOffsetY = 0;
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
                },
                getX: function () { return x; },
                getY: function () { return y; }
            }
        })();
        gameObjects.layer = (function () {
            var [offsetX, offsetY] = [20, 20];
            var cellSize = 10;
            var width = 600 / cellSize;
            var height = 320 / cellSize;
            var area = [];
            for (var x = 0; x < width; x++) {
                area[x] = [];
                for (var y = 0; y < height; y++)
                    area[x][y] = 1;
            }
            var isXonixIn = false;
            var isXonixOut = function (xonixX, xonixY) {
                if (!isXonixIn)
                    return false;
                if (!area[xonixX] || !area[xonixX][xonixY])
                    return true;
                if (area[xonixX] && area[xonixX][xonixY] === 0)
                    return true;
            };
            var tryCut = function () {
                for (var x = 0; x < width; x++)
                    for (var y = 0; y < height; y++)
                        if (area[x][y] === 2)
                            area[x][y] = 0;
            };
            
            return {
                render: function (canvas) {
                    for (var x = 0; x < width; x++)
                        for (var y = 0; y < height; y++)
                            switch (area[x][y]) {
                                case 1:
                                    canvas.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
                                    break;
                                case 2:
                                    canvas.fillStyle = "#940088";
                                    canvas.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
                                    canvas.fillStyle = "#000";
                                    break;
                            }
                },
                update: function () {
                    var xonixToAreaX = Math.round((gameObjects.xonix.getX() - offsetX) / cellSize);
                    var xonixToAreaY = Math.round((gameObjects.xonix.getY() - offsetY) / cellSize);
                    if (area[xonixToAreaX] && area[xonixToAreaX][xonixToAreaY] === 1) {
                        area[xonixToAreaX][xonixToAreaY] = 2;
                        isXonixIn = true;
                    }
                    if (isXonixOut(xonixToAreaX, xonixToAreaY)) {
                        isXonixIn = false;
                        tryCut();
                    }
                }
            }
        })();
    }
    var run = function () {
        update();
        render(run);
    }
    var update = function () {
        gameObjects.xonix.update();
        gameObjects.layer.update();
    }
    var render = function (callback) {
        canvas.clearRect(0, 0, width, height);
        canvas.drawImage(resources.background, 0, 0 - (resources.background.height - height) / 2);
        gameObjects.layer.render(canvas);
        gameObjects.xonix.render(canvas);
        window.requestAnimationFrame(function () { setTimeout(callback, 50); });
    }

    return {
        start: function () {
            console.log("game starting");
            initUI();
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