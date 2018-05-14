var xonixGame = (function () {
    var canvas;
    var resources;
    var gameObjects;
    var width = 640;
    var height = 360
    var lvl;
    var isRuning;
    var directions = { up: 1, right: 2, bottom: 3, left: 4 };

    var initUI = function () {
        canvas = document.getElementById("canvas").getContext("2d");
        setTimeout(function () {
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
        }, 1000);
    }
    var loadResources = function () {
        resources = {};
        resources.background = new Image();
        resources.background.src = "images/level" + lvl + ".jpg";
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
            var foreach = function (f) {
                var result;
                for (var x = 0; x < width; x++)
                    for (var y = 0; y < height; y++)
                        result = f(x, y);
                return result;
            };
            var tryCut = (function () {
                var createAreaPart = function () {
                    return { size: 0, cells: [] };
                }
                var fillAreaPart = function (area, part, startX, startY, n) {
                    if (!area[startX] || !area[startX][startY] || area[startX][startY] !== 1)
                        return part;
                    area[startX][startY] = n;
                    part.size++;
                    part.cells.push({ x: startX, y: startY });
                    fillAreaPart(area, part, startX + 1, startY, n);
                    fillAreaPart(area, part, startX - 1, startY, n);
                    fillAreaPart(area, part, startX, startY + 1, n);
                    fillAreaPart(area, part, startX, startY - 1, n);
                    return part;
                };
                return function () {
                    foreach(function (x, y) {
                        if (area[x][y] === 2)
                            area[x][y] = 0;
                    });
                    gameObjects.balls.forEach(function (ball) {
                        var ballToAreaX = Math.round((ball.getX() - offsetX) / cellSize);
                        var ballToAreaY = Math.round((ball.getY() - offsetY) / cellSize);
                        fillAreaPart(area, createAreaPart(), ballToAreaX, ballToAreaY, 3);
                    });
                    var areaPartsWithoutBalls = [];
                    foreach(function (x, y) {
                        if (area[x][y] === 1)
                            areaPartsWithoutBalls.push(fillAreaPart(area, createAreaPart(), x, y, 3));
                    });
                    foreach(function (x, y) {
                        if (area[x][y] === 3)
                            area[x][y] = 1;
                    });
                    if (areaPartsWithoutBalls.length !== 0)
                        areaPartsWithoutBalls.sort(function (a, b) { return a.size - b.size; })[0].cells.forEach(function (cell) { area[cell.x][cell.y] = 0; });
                }
            })();
            return {
                render: function (canvas) {
                    foreach(function (x, y) {
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
                    });
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
                },
                isLayer: function (X, Y) {
                    var screenToLayerX = Math.round((X - offsetX) / cellSize);
                    var screenToLayerY = Math.round((Y - offsetY) / cellSize);
                    return area[screenToLayerX] && area[screenToLayerX][screenToLayerY] === 1;
                },
                isXonix: function (X, Y) {
                    var screenToLayerX = Math.round((X - offsetX) / cellSize);
                    var screenToLayerY = Math.round((Y - offsetY) / cellSize);
                    return area[screenToLayerX] && area[screenToLayerX][screenToLayerY] === 2;
                },
                fullSize: width * height,
                //getCurrentSize: function () {
                //    var result = foreach((function () {
                //        var size = 0;
                //        return function (x, y) {
                //            if (area[x][y] === 1)
                //                return ++size;
                //        }
                //    })());
                //    return result;
                getCurrentSize: function () {
                    var size = 0;
                    for (var x = 0; x < width; x++)
                        for (var y = 0; y < height; y++)
                            if (area[x][y] === 1)
                                size++;
                    return size;
                }
            }
        })();
        gameObjects.balls = [];
        for (var i = 0; i < lvl + 1; i++)
            gameObjects.balls.push((function () {
                var x = Math.random() * (width - 80) + 40;
                var y = Math.random() * (height - 80) + 40;
                var offsetX = Math.random() * 3 + 3;
                var offsetY = Math.random() * 3 + 3;
                if (Math.random() < .5) offsetX *= -1;
                if (Math.random() < .5) offsetY *= -1;
                var isHorisontalLayerBorder = function () {
                    return !gameObjects.layer.isLayer(x, y + offsetY);
                };
                var isVerticalLayerBorder = function () {
                    return !gameObjects.layer.isLayer(x + offsetX, y);
                };
                var isXonixCollision = function () {
                    return gameObjects.layer.isXonix(x + offsetX, y + offsetY);
                };

                return {
                    render: function (canvas) {
                        canvas.beginPath();
                        canvas.arc(x, y, 5, 0, Math.PI * 2, false);
                        canvas.closePath();
                        canvas.fillStyle = "blue";
                        canvas.fill();
                        canvas.fillStyle = "#000";
                    },
                    update: function () {
                        if (isXonixCollision())
                            game.ongameover();
                        if (isHorisontalLayerBorder())
                            offsetY *= -1;
                        if (isVerticalLayerBorder())
                            offsetX *= -1;
                        x += offsetX;
                        y += offsetY;
                    },
                    getX: function () { return x; },
                    getY: function () { return y; }
                }
            })());
    }
    var run = function () {
        if (!isRuning) return;
        if ((gameObjects.layer.getCurrentSize() / gameObjects.layer.fullSize) < .25)
            game.onlevelclear();
        update();
        render(run);
    }
    var update = function () {
        gameObjects.xonix.update();
        gameObjects.layer.update();
        gameObjects.balls.forEach(function (ball) {
            ball.update();
        });
    }
    var render = function (callback) {
        canvas.clearRect(0, 0, width, height);
        canvas.drawImage(resources.background, 0, 0 - (resources.background.height - height) / 2);
        gameObjects.layer.render(canvas);
        gameObjects.xonix.render(canvas);
        gameObjects.balls.forEach(function (ball) {
            ball.render(canvas);
        });
        window.requestAnimationFrame(function () { setTimeout(callback, 30); });
    };

    var game = {
        start: function (level) {
            lvl = typeof level === "number" ? level : 1;
            isRuning = true;
            initUI();
            loadResources();
            createGameObjects();
            run();
            console.log(lvl == 1 ? "game started" : "new level started");
        },
        stop: function () {
            isRuning = false;
            window.onkeydown = function () { };
        },
        getCanvas: function () {
            return canvas;
        },
        getLevel: function () {
            return lvl;
        },
        ongameover: function () { },
        onlevelclear: function () { }
    };
    return game;
})();

xonixGame.onlevelclear = (function () {
    var maxLevel = 2;
    return function () {
        console.log("level clear");
        xonixGame.stop();
        var level = xonixGame.getLevel();
        if (level === maxLevel) {
            console.log("you win");
            return;
        }
        xonixGame.start(level + 1);
    }
})();

xonixGame.ongameover = function () {
    console.log("game over");
    xonixGame.stop();
}

window.onload = xonixGame.start;