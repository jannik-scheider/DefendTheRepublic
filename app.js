// MCI-2, Hochschule Esslingen
// author: Andreas Roessler
// version: 1.0, S21

import { getCanvas, rect, circle, the_U } from "./canvas_lib.js";
import XwingFighter from "./xwingfighter.js";
import TieFighter from "./tiefighter.js";
import Shot from "./shot.js";
import Powerup from "./powerup.js";


// outer function
function Init() {
  let canvas = document.getElementById("canvas01");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let powerups = [];
  let ties = [];
  let xwing;
  let tieImg = new Image();
  let xwingImg = new Image();
  let powerupImg = new Image();

  //vector zwischen touchpunkt und mittelpunkt von kreis 
  let vector_x = 0;
  let vector_y = 0;
  let vector_length = 0;
  let evector_x = 0;
  let evector_y = 0;
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
  let gameover = false;

  //game sounds
  let mission = new Audio('./audio/military-mission.mp3');
  let crash = new Audio('./audio/crash.mp3');


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
  let timeOfFirstTouch = 0;

  canvas.addEventListener("touchstart",(evt) => {
      evt.preventDefault();
      setFingers(evt.changedTouches);

      for(let f in fingers){
        if(fingers[f]){
          let finger = fingers[f];
          let delta = new Date().getTime() - timeOfFirstTouch;
              if(isShotPressed(finger.x, finger.y, shotCircleX, shotCircleY, 30)){
                if(delta > 300){
                  let shot = new Shot(ctx, xwing.get_x(), xwing.get_y(), evector_x, evector_y, rad);
                  shots.push(shot);
                  drawCircle(greenCircleX,greenCircleY,80,"green");
                  timeOfFirstTouch = timeOfFirstTouch + delta;
                  let lasersound = new Audio('./audio/laser-gun.mp3');
                  lasersound.play();
                }  
              }
        }
      }
      
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
    ctx.strokeStyle = color;
    let endAngle = Math.PI * 2; // End point on circle
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, startAngle, endAngle, true);
    ctx.stroke();
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
    let vlength = Math.sqrt((vx*vx) + (vy* vy));

    if(vlength > radius){
        return false;
    }else{
        return true;
    }
  }
  //wahrscheinlichkeitsrechnung ob ein Tiefighter gespawnt werden soll darüber kann schwierigkeit eingestellt werden
  function generateSpwan(){
    let spawn = Math.floor(Math.random() * 300);
    if(spawn == 0){
      return true;
    }else{
      return false;
    }
  }
  // berechnet ob ein power up gespawnt wird -> random
  function spawnRandomly(){
    let spawn = Math.floor(Math.random() * 1000);
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
  powerupImg.src = "./images/powerup.png";
  let start = true;
  // Zeichen-Funktion
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Zeichnet grünen Steuerkreis
    drawCircle(greenCircleX,greenCircleY,80,"green");
    //shot button 
    drawCircle(shotCircleX, shotCircleY, 30, "red");
    if(start){
      ctx.font = '20px serif';
      ctx.fillStyle = "white";
      ctx.fillText("click here to start", greenCircleX - 70, greenCircleY);
    }
    //draw score display
    ctx.font = '20px serif';
    ctx.fillStyle = "white";
    ctx.fillText("score: " + score, canvas.width/8, canvas.height/10);

    if(!gameover){
      mission.play();
          for (let f in fingers) {
            if(xwing){
              if (fingers[f]) {
                start = false;
                let finger = fingers[f];
                //checkt ob der finger noch im grünen Steuerkreis ist wenn ja wird die Flugrichtung neu berechnet
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
                  //einheitsvektor berechnen für ein Schuss
                  vector_length = Math.sqrt((vector_x*vector_x) + (vector_y* vector_y));
                  evector_x = 1/vector_length * vector_x;
                  evector_y = 1/vector_length * vector_y;
                  //wenn der Touchpunkt in der mitte des Steuerkreises ist keine bewegung 
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
                //überprüft ob powerup angeklickt wurde
                for(let powerup of powerups){
                  if(powerup.checkClicked(finger.x, finger.y)){
                    ties = [];
                    //powerups.splice(powerup, 1);
                  }
                }

              //wenn kein Touch bleibt XwingFighter stehen
              }else{
                xwing.draw(ctx,flight_x,flight_y, rad);
              }
              //zeichnet alle aktuellen Schüsse im Array
              for(let shot of shots){
                shot.moveShot(ctx);
              }
            }

          
            // berechnet zufällig ob ein tiefighter gespawnt werden soll
            if(generateSpwan()){
              ties.push(new TieFighter(ctx,tieImg));
            }

            //zeichnet alle tie fighter aus dem array ties
            for(let tie of ties){
              tie.draw(ctx, xwing.get_x(), xwing.get_y());
              for(let shot of shots){
                if(shot.checkHit(tie.getX(), tie.getY())){
                  //console.log("HIT");
                  shots.splice(shots.indexOf(shot), 1);
                  ties.splice(ties.indexOf(tie), 1);
                  score++;
                }
              }
              if(tie.checkCollision(xwing.get_x(), xwing.get_y())){
                //console.log("game over");
                crash.play();
                gameover = true;
              }
            }

            //spawn power up randomly
            if(spawnRandomly()){
              powerups.push(new Powerup(ctx, powerupImg));
            }

            if(powerups != undefined){
              for(let powerup of powerups){
                powerup.draw(ctx);
              }
            }

          }
              
      }else{
        ties = [];
        shots = [];
        powerups = [];
        let x = canvas.width/4;
        let y = canvas.height/2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        flight_x = 150;
        flight_y = 400;
        ctx.font = '48px serif';
        ctx.fillStyle = "white";
        ctx.fillText("game over", 100,300);
        ctx.fillText("Score " + score, 100, 400);
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, 250,100);
        ctx.fillStyle = "white";
        ctx.fillText("try again", x+ 50, y+ 50);
        for(let f in fingers){
          if(fingers[f]){
            let finger = fingers[f];
            if(finger.x > x && finger.x < x+250 && finger.y > y && finger.y < y+100){
              score = 0;
              gameover = false;
            }
          }
        }

        mission.pause();
      }
 
    
    requestAnimationFrame(draw);
  }
 
  draw(); // Einmaliges Starten, danach sorgt requestAnimationFrame fuer die Aufrufe

}

window.onload = Init;
