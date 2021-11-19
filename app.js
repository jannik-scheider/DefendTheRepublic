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


  let ties = [];
  let xwing;
  let tieImg = new Image();
  let xwingImg = new Image();
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
  let greenCircleX = canvas.width - canvas.width/4;
  let greenCircleY = canvas.height - canvas.height/8;
  let shotCircleX = canvas.width/4;
  let shotCircleY = canvas.height - canvas.height/8;
  let score = 0;


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

      for(let f in fingers){
        if(fingers[f]){
          let finger = fingers[f];
          vector_x = finger.x - greenCircleX;
          vector_y = finger.y - greenCircleY;

          if(isShotPressed(finger.x, finger.y, shotCircleX, shotCircleY, 30)){
            let shot = new Shot(ctx, xwing.get_x(), xwing.get_y(), vector_x, vector_y, rad);
            shots.push(shot);
            drawCircle(greenCircleX,greenCircleY,80,"green");
          }    
        }
      }
      
  },true);


  canvas.addEventListener("touchmove",(evt) => {
      evt.preventDefault();
      console.log("test");
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

  function drawRect(x,y,width, height, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect(x,y,width,height);
    ctx.resetTransform();
  }

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

  function generateSpwan(){
    let spawn = Math.floor(Math.random() * 300);
    if(spawn == 0){
      return true;
    }else{
      return false;
    }
  }

  xwingImg.onload = function(){
    xwing = new XwingFighter(ctx, xwingImg);
  }

  tieImg.onload = function(){
    ties[0] = new TieFighter(ctx,tieImg);
    ties[1] = new TieFighter(ctx,tieImg);
  }

  tieImg.src = "./images/tie2.png";
  xwingImg.src = "./images/xwing2.png";


  // Zeichen-Funktion
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(greenCircleX,greenCircleY,80,"green");
    drawRect(200,100,50,50,"blue");
    //shot button 
    drawCircle(shotCircleX, shotCircleY, 30, "red");

    for (let f in fingers) {
      if(xwing){
        if (fingers[f]) {
          let finger = fingers[f];
          if(xwing.isTouchinCircle(finger.x, finger.y, greenCircleX, greenCircleY, 80)){
            drawCircle(finger.x, finger.y, 20, "red");
            circle_Path_x = finger.x;
            circle_Path_y = finger.y;
            let ankathete = xwing.calculateAnkathete(greenCircleY, finger.y);
            let gegenkathete = xwing.calculateGegenkathete(greenCircleX, finger.x);
            let quadrant = xwing.whichQuadrant(finger.x, finger.y, greenCircleX,greenCircleY);
            rad = xwing.calculateAngle(ankathete, gegenkathete, quadrant)* Math.PI/180;
  
            vector_x = finger.x - greenCircleX;
            vector_y = finger.y - greenCircleY;
  
            if(finger.x == greenCircleX && finger.y == greenCircleY){
              xwing.draw(ctx,flight_x, flight_y, rad);
            }else{
              flight_x =  flight_x + (vector_x/speed);
              flight_y = flight_y + (vector_y/speed);
              xwing.draw(ctx,flight_x, flight_y, rad);
            }
          }else{
            drawCircle(circle_Path_x, circle_Path_y, 20, "red");
            xwing.draw(ctx,flight_x, flight_y, rad);
          }

        }else{
          xwing.draw(ctx,flight_x,flight_y, rad);
        }

      for(let shot of shots){
        shot.moveShot(ctx);
      }

    }

    if(generateSpwan()){
      ties.push(new TieFighter(ctx,tieImg));
    }


    for(let tie of ties){
      tie.draw(ctx, xwing.get_x(), xwing.get_y());
      for(let shot of shots){
        if(shot.checkHit(tie.getX(), tie.getY())){
          console.log("HIT");
          shots.splice(shots.indexOf(shot), 1);
          ties.splice(ties.indexOf(tie), 1);
          score++;
        }
      }

      if(tie.checkCollision(xwing.get_x(), xwing.get_y())){
        //console.log("game over");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px serif';
        ctx.fillText("game over", 100,300);
        ctx.fillText("Score " + score, 100, 400);
        break;
      }
    }

    
  }
    requestAnimationFrame(draw);
  }
  draw(); // Einmaliges Starten, danach sorgt requestAnimationFrame fuer die Aufrufe

}

window.onload = Init;
