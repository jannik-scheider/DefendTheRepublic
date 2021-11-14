// MCI-2, Hochschule Esslingen
// author: Andreas Roessler
// version: 1.0, S21

import { getCanvas, rect, circle, the_U } from "./canvas_lib.js";
import XwingFighter from "./xwingfighter.js";
import TieFighter from "./tiefighter.js";
import Shot from "./shot.js";


// outer function
function Init() {
  let canvas = document.getElementById("canvas01");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  window.addEventListener("resize", function (event) {
    console.log("resize");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  });

  // Store the fingers in an array
  let fingers = [];
  function setFingers(touches) {
    for (let t of touches) {
      fingers[t.identifier] = {
        x: t.pageX,
        y: t.pageY,
      };
    }
  }

  function rmFingers(touches) {
    for (let t of touches) {
      console.log("rm", t);
      fingers[t.identifier] = undefined;
    }
  }

  canvas.addEventListener("touchstart",(evt) => {
      evt.preventDefault();
      setFingers(evt.changedTouches);
  },true);

  canvas.addEventListener("touchmove",(evt) => {
      evt.preventDefault();
      setFingers(evt.changedTouches);
  }, true);

  canvas.addEventListener("touchend",(evt) => {
      evt.preventDefault();
      rmFingers(evt.changedTouches);
  },true);


  function drawCircle(x, y, radius, color) {
    const startAngle = 0;
    ctx.fillStyle = color;
    let endAngle = Math.PI * 2; // End point on circle
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, endAngle, true);
    ctx.fill();
    ctx.resetTransform();
  }


  let ties = [];
  let xwing;
  let tieImg = new Image();
  let xwingImg = new Image();

  xwingImg.onload = function(){
    xwing = new XwingFighter(ctx, xwingImg);
  }

  tieImg.onload = function(){
    ties[0] = new TieFighter(ctx,tieImg);
    ties[1] = new TieFighter(ctx,tieImg);
    ties[2] = new TieFighter(ctx,tieImg);
    ties[3] = new TieFighter(ctx,tieImg);
  }

  tieImg.src = "./images/tie2.png";
  xwingImg.src = "./images/xwing2.png";

  //vector zwischen touchpunkt und mittelpunkt von kreis 
  let vector_x = 0;
  let vector_y = 0;
  let speed = 50;
  let flight_x = 150;
  let flight_y = 400;
  let circle_Path_x;
  let circle_Path_y;
  let rad;
  let shots = [];

  function isShotPressed(touch_x, touch_y, x, y, radius){
    let vx = touch_x - x;
    let vy = touch_y - y;
    let vector_length = Math.sqrt((vx*vx) + (vy* vy));

    if(vector_length > radius){
        return false;
    }else{
        return true;
    }
  }

  // Zeichen-Funktion
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(270,720,80,"green");
  
    //shot button 
    drawCircle(80, 750, 30, "red");

    for (let f in fingers) {
      if(xwing){
        if (fingers[f]) {
          let finger = fingers[f];
          if(xwing.isTouchinCircle(finger.x, finger.y, 270, 720, 80)){
            drawCircle(finger.x, finger.y, 20, "red");
            circle_Path_x = finger.x;
            circle_Path_y = finger.y;
            let ankathete = xwing.calculateAnkathete(720, finger.y);
            let gegenkathete = xwing.calculateGegenkathete(270, finger.x);
            let quadrant = xwing.whichQuadrant(finger.x, finger.y, 270,720);
            rad = xwing.calculateAngle(ankathete, gegenkathete, quadrant)* Math.PI/180;
  
            vector_x = finger.x - 270;
            vector_y = finger.y - 720;
  
            if(finger.x == 270 && finger.y == 720){
              xwing.draw(ctx,flight_x, flight_y, rad);
            }else{
              flight_x =  flight_x + (vector_x/speed);
              flight_y = flight_y + (vector_y/speed);
              xwing.draw(ctx,flight_x, flight_y, rad);
            }
          }else{
            drawCircle(circle_Path_x, circle_Path_y, 20, "red");
            xwing.draw(ctx,flight_x,flight_y, rad);
          }
          if(isShotPressed(finger.x, finger.y, 80, 750, 30)){
            let shot = new Shot(ctx, xwing.get_x(), xwing.get_y(), vector_x, vector_y);
            shots.push(shot);
        }

        
        }else{
          drawCircle(270,720,20,"red");
          xwing.draw(ctx,flight_x,flight_y, rad);
        }

        for(let shot of shots){
          shot.moveShot(rad, ctx);
        }
      
    }

    for(let tie of ties){
      tie.draw(ctx, xwing.get_x(), xwing.get_y());
    }
  }



    requestAnimationFrame(draw);
  }
  draw(); // Einmaliges Starten, danach sorgt requestAnimationFrame fuer die Aufrufe

}

window.onload = Init;
