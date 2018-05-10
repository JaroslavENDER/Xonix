var xonixGame = (function () {
    var canvas;
    var resources;
    var gameObjects;
    var width = 640;
    var height = 360
    var level = 1;

    var init = function () {
        canvas = document.getElementById("canvas").getContext("2d");
    }
    var loadResources = function () {
        resources = {};
        resources.background = new Image();
        resources.background.src = "images/level" + level + ".jpg";
    }
    var createGameObjects = function (){

    }
    var run = function () {
        canvas.clearRect(0, 0, width, height);
        render();
        window.requestAnimationFrame(function () { run(); });
    }
    var render = function () {
        canvas.drawImage(resources.background, 0, 0 - Math.abs(resources.background.height - height) / 2);
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
}());

window.onload = xonixGame.start;