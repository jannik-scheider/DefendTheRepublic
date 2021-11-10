// MCI-2, Hochschule Esslingen
// author: Andreas Roessler
// version: 1.0, S21

import { getCanvas, rect, circle, the_U } from "./canvas_lib.js";
import XwingFighter from "./xwingfighter.js";
import TieFighter from "./tiefighter.js";


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


  let ties = [];
  let xwing;
  let tieImg = new Image();
  let xwingImg = new Image();

  tieImg.onload = function(){
    ties[0] = new TieFighter(ctx,tieImg);
    ties[1] = new TieFighter(ctx,tieImg);
    ties[2] = new TieFighter(ctx,tieImg);
    ties[3] = new TieFighter(ctx,tieImg);
  }

  xwingImg.onload = function(){
    xwing = new XwingFighter(ctx, xwingImg);
  }

  tieImg.src = "./images/tie2.png";
  xwingImg.src = "./images/xwing2.png";

  // Zeichen-Funktion
  function draw() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let f in fingers) {
      if (fingers[f]) {
        let finger = fingers[f];
        if(finger.x > 100){
          ctx.beginPath();
          ctx.fillStyle = "green";
          ctx.fillRect(20,10,10,10);
          ctx.closePath();
        }
      }
    }

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.strokeStyle = "white";
    ctx.arc(70, 750, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    if(xwing)
      xwing.draw(ctx);

    for(let tie of ties){
      tie.draw(ctx);
    }

    requestAnimationFrame(draw);
  }
  draw(); // Einmaliges Starten, danach sorgt requestAnimationFrame fuer die Aufrufe

}

window.onload = Init;
