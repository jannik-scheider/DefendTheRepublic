
function breakScreen(context, score){
    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect(100,200,200,50);
    context.font = '48px serif';
    context.fillText("Play", 100, 200);
    context.resetTransform();
  }

  function play(touchx, touchy){
    if(touchx > 100 && touchx < 300 && touchy > 200 && touchy < 250){
      draw();
    }
  }

  function breakk(touchx, touchy, score){
    if(touchx > 200 && touchx < 250 && touchy > 100 && touchy < 150){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      breakScreen(ctx, score);
    }
  }