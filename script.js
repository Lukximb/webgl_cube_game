var canvas, ctx;
var sumA = 0;
var w = 0;
var a = 0;
var boxes = new Array(20);
var stop = false;
var breakStop = 0;

var walls = [
    [0, 1, 2, 3],
    [1, 5, 6, 2],
    [5, 4, 7, 6],
    [4, 0, 3, 7],
    [0, 4, 5, 1],
    [3, 2, 6, 7]
];

var rgb = [
    "rgb(255, 164, 20)",
    "rgb(255, 0, 0)",
    "rgb(161, 255, 0)",
    "rgb(0, 255, 153)",
    "rgb(0, 110, 255)",
    "rgb(178, 0, 255)",
    "rgb(255, 0, 195)",
    "rgb(255, 246, 0)"
];

window.onload = function() {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    init();
    setInterval(main, 10);
};

function Point3D(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.project = function(viewWidth, viewHeight, fov, viewDistance) {
        var factor, x, y;
        factor = fov / (viewDistance + this.z);
        x = this.x * factor + viewWidth / 2;
        y = this.y * factor + viewHeight / 2;
        return new Point3D(x, y, this.z);
    }
}

function init() {
    for (var i = 0; i < boxes.length; i++) {
        boxes[i] = createBox();
    }
}

function createBox() {
    box = {
        x: Math.random() * 400 - 200,
        y: Math.random() * 50,
        z: Math.random() * 50 + 50,
        rgb: rgb[Math.floor(Math.random()*8)],
        vertices: [
            new Point3D(-1,1,-1),
            new Point3D(1,1,-1),
            new Point3D(1,-1,-1),
            new Point3D(-1,-1,-1),
            new Point3D(-1,1,1),
            new Point3D(1,1,1),
            new Point3D(1,-1,1),
            new Point3D(-1,-1,1)
        ]
    };

    for( var j = 0; j < box.vertices.length; j++ ) {
        box.vertices[j].x -= (box.x)/10.0;
        box.vertices[j].y += (box.y)/10.0;
        box.vertices[j].z += (box.z)/10.0;
    }

    return box;
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    console.log(charStr);
    checkKey(charStr);
    checkKey(charStr);
    checkKey(charStr);
    checkKey(charStr);
};

function checkKey(key) {
    switch (key) {
        case "W":
            if (!stop) {
                w += 0.05;
                sumA = 0;
            }
            break;
        // case "S":
        //     w -= 1;
        //     wT -= 0.05;
        //     break;
        case "D":
            if (sumA > -300) {
                sumA--;
                a -= 0.05;
                breakStop += 0.05;
            }
            break;
        case "A":
            if (sumA < 250) {
                sumA++;
                a += 0.05;
                breakStop += 0.05;
            }
            break;
    }
}

function main() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, 1000, 600);

    for (var i = 0; i < boxes.length; i++) {
        ctx.strokeStyle = boxes[i].rgb;
        var t = [];
        for( var j = 0; j < boxes[i].vertices.length; j++ ) {
            var v = boxes[i].vertices[j];
            v.x += a;
            v.y -= w/5.0;
            v.z -= w;
            var p = v.project(250, 150, 100, 4);
            t.push(p);


            if (v.z < 1 && v.z > -1) {
                if (v.x > -1 && v.x < 1) {
                    if (v.y > -2 && v.y < 2) {
                        stop = true;
                    }
                }
            }
            if (breakStop > 0.2 || breakStop < -0.2) {
                stop = false;
                breakStop = 0;
            }
        }

        for(var k = 0; k < walls.length; k++ ) {
            var f = walls[k];
            ctx.beginPath();
            ctx.moveTo(t[f[0]].x,t[f[0]].y);
            ctx.lineTo(t[f[1]].x,t[f[1]].y);
            ctx.lineTo(t[f[2]].x,t[f[2]].y);
            ctx.lineTo(t[f[3]].x,t[f[3]].y);
            ctx.closePath();
            ctx.stroke()
        }
    }
    w = 0;
    a = 0;

    for (i = 0; i < boxes.length; i++) {
        var minZ = 1000;
        for( j = 0; j < boxes[i].vertices.length; j++) {
            v = boxes[i].vertices[j];
            if (v.z < minZ) {
                minZ = v.z;
            }
        }
        if (minZ < -2) {
            boxes[i] = createBox();
        }
    }
}