// MCI-2, Hochschule Esslingen
// author: Andreas Roessler
// version: 1.0, S21


///////////////////////////////////////////////////////////////////////////////
// abstract base "class"
// is "derived" by rect/circle/the_u


function item(context_object) {
    let context = context_object.context;
    let x = 0, y = 0, alpha = 0, scale = 1;
    let children = [];

    let matrix = new DOMMatrix(), inverse, initialGrabbed;
    let needupdate = false;
    let obj_infos = {};
    let touchId;


    function append(c) {
        children.push(c);
    }

    function getMatrix() {
        update();
        return matrix;
    }

    function isTouched(pointer, identifier) {
        let movingMatrix = pointer.getMatrix();

        // the inverse of the local coord-system
        // used in isTouched()
        let localInverse = DOMMatrix.fromMatrix(matrix);
        localInverse.invertSelf();
        let localTouchPoint = localInverse.transformPoint(new DOMPoint(movingMatrix.e, movingMatrix.f));
        if (context.isPointInPath(obj_infos.path, localTouchPoint.x, localTouchPoint.y)) {
            touchId = identifier;
            obj_infos.fillStyle = "orange";

            inverse = new DOMMatrix(movingMatrix);
            inverse.invertSelf();

            initialGrabbed = new DOMMatrix(matrix);
            initialGrabbed.preMultiplySelf(inverse);
            return true;
        }
        return false;
    }

    function grab(pointer, identifier) {
        if (touchId === identifier) {
            matrix = new DOMMatrix(initialGrabbed);
            matrix.preMultiplySelf(pointer.getMatrix());
            // Store the coords - otherwise rotate does block translation
            x = matrix.e;
            y = matrix.f;
        }
    }

    function touchEnd(identifier) {
        if (touchId === identifier) {
            obj_infos.fillStyle = "gray";
            touchId = undefined;
        }
    }

    // Update the matrix after user translate/rotate
    function update() {
        if (needupdate) {
            matrix = new DOMMatrix();
            matrix.translateSelf(x, y);
            matrix.rotateSelf(alpha); // alpha must be degree not radians
            matrix.scaleSelf(scale);
            needupdate = false;
        }
    }

    function move_global(nx, ny) {
        let localTouchPoint = context_object.inverse.transformPoint(new DOMPoint(nx, ny));
        x = localTouchPoint.x;
        y = localTouchPoint.y;
        needupdate = true;
        update();
    }

    /////////////////////////////////////////////
    // the draw function of base-class
    // stored/used as o.pre in sub-classes
    function draw(parent) {
        update();

        let local = DOMMatrix.fromMatrix(parent);
        local.multiplySelf(matrix);

        // draw children
        for (let c of children) {
            context.save();
            c.draw(local);
            context.restore();
        }
        // parent is drawn AFTER this trans
        context.transform(local.a, local.b, local.c, local.d, local.e, local.f);
        // NOT setTransform - would overwrite the global transform
    }


    function move(nx, ny) {
        x = nx;
        y = ny;
        needupdate = true;
        update();
    }

    function rotate(na) {
        alpha = na;
        needupdate = true;
        update();
    }

    // rad to grad
    function rotateRadians(na) {
        alpha = na * 180 / Math.PI;
        needupdate = true;
    }

    function setScale(sc) {
        scale = sc;
        needupdate = true;
    }


    return {
        "move": move, rotate: rotate, grab, rotateRadians,
        isTouched, touchEnd, getMatrix, draw,
        append, setScale, obj_infos, move_global
    };
}

///////////////////////////////////////////////////////////////////////////////
// simple figures

export function rect(context_object, width, height, fillStyle) {
    let o = item(context_object);
    let context = context_object.context;

    let pre = o.draw;
    o.draw = function (parent) {
        context.save();
        pre(parent);
        context.fillStyle = fillStyle;
        context.fillRect(0, 0, width, height);
        context.restore();
    }
    return o;
}

export function circle(context_object, radius, fillStyle, text = "Circle") {
    let o = item(context_object);
    let context = context_object.context;

    let pre = o.draw;
    o.draw = function (parent) {
        context.save();
        pre(parent);
        context.fillStyle = fillStyle;
        let endAngle = Math.PI * 2; // End point on circle
        context.beginPath();
        context.arc(0, 0, radius, 0, endAngle, true);
        context.fill();

        context.fillStyle = "#fff";
        context.fillText(text, 10, -10);
        context.restore();
    }
    return o;
}

///////////////////////////////////////////////////////////////////////////////
// a "complex" figure to test selection objects 

function u_path() {
    let upath = new Path2D();
    upath.moveTo(-2, -2);
    upath.lineTo(-2, 2);
    upath.lineTo(-1, 2);
    upath.lineTo(-1, -1);
    upath.lineTo(1, -1);
    upath.lineTo(1, 2);
    upath.lineTo(2, 2);
    upath.lineTo(2, -2);
    upath.closePath();
    return upath;
}

export function the_U(context_object, scale, fillStyle, text = "U") {
    let context = context_object.context;
    let o = item(context_object);
    o.obj_infos.path = u_path();
    o.obj_infos.fillStyle = fillStyle;
    let pre = o.draw;
    o.setScale(scale);

    o.draw = function (m) {
        context.save();
        pre(m);
        context.fillStyle = o.obj_infos.fillStyle;
        context.fill(o.obj_infos.path);
        context.restore();
    }
    return o;
}

///////////////////////////////////////////////////////////////////////////////
// gets the canvas-context
// calculates a global transformation to support device-independant coordinates
// returns

export function getCanvas(id, width, height) {

    const drawing_width = width || 600;
    const drawing_height = height || 800;
    const drawing_aspect_ratio = drawing_width / drawing_height;


    // aus https://www.html5rocks.com/en/tutorials/canvas/hidpi/
    // Get the device pixel ratio, falling back to 1.

    // USAGE OF DPR seems to be NOT necessary
    const dpr = window.devicePixelRatio || 1;
    // let rect = canvas.getBoundingClientRect();
    // canvas.width = rect.width * dpr;
    // canvas.height = rect.height * dpr;
    // console.log(`Canvas ${canvas.width}x${canvas.height} Dpr: ${dpr}`)


    let canvas = document.getElementById(id);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // calculate a global matrix with translation and scale
    let context = canvas.getContext('2d');

    let matrix;

    // variables used to draw a frame around the desired screen part
    const dist = 5;
    let frame_x = dist;
    let frame_y = dist;
    let frame_width = drawing_width - 2 * dist;
    let frame_height = drawing_height - 2 * dist;

    // this will be returned/exported
    let context_object = {};

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let canvas_aspect_ratio = canvas.width / canvas.height;
        let ratio = drawing_aspect_ratio / canvas_aspect_ratio;
        let border_height = 0
        let border_width = 0
        let scale = 1


        // ratio > 1: "to much" height of the real screen
        // width used to calculate the global scale factor
        if (ratio > 1) {
            scale = canvas.width / drawing_width;
            // border_height = (canvas.height - scale * drawing_height) / 2;
            frame_x = dist;
            frame_width = drawing_width - 2 * dist;
        } else {
            // ratio < 1: "to much" width of the real screen
            // height used to calculate the global scale factor
            scale = canvas.height / drawing_height;
            // border_width = (canvas.width - scale * drawing_width) / 2;
            frame_y = dist;
            frame_height = drawing_height - 2 * dist;
        }

        // console.log(`Canvas ${canvas.width}x${canvas.height} Dpr: ${dpr} dr.asp ${drawing_aspect_ratio.toFixed(2)} cv.asp ${canvas_aspect_ratio.toFixed(2)}`)
        // console.log(`Ratio ${ratio.toFixed(2)} Border ${border_width.toFixed(0)}x${border_height.toFixed(0)} scale ${scale.toFixed(2)}`)

        matrix = new DOMMatrix();
        matrix.translateSelf(border_width, border_height);
        matrix.scaleSelf(scale, scale);

        context_object.inverse = DOMMatrix.fromMatrix(matrix);
        context_object.inverse.invertSelf();

    }

    window.addEventListener('resize', resize);
    resize();

    // visualise the usable part of the canvas
    function draw_canvas(stroke) {
        context.strokeStyle = "red";
        context.beginPath();
        context.rect(frame_x, frame_y, frame_width, frame_height);
        context.stroke();
    }

    // clear the canvas, set the context
    context_object.pre_draw = function (vis = false) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.setTransform(matrix);
        if (vis) {
            draw_canvas();
        }
    }

    context_object.context = context;

    return context_object;
}


