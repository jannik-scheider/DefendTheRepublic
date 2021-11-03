export default class XwingFighter{
    
  constructor(context) {
    this.img = new Image(40,40);
    this.img.src = "./images/xwing.png";
    this.x = 0;
    this.y= 0;
    this.vx =  5;
    this.vy = 2;
    this.ctxWidth = context.canvas.width;
    this.ctxHeight = context.canvas.height;
  }
  
  draw(context){

    context.beginPath();
    context.fillStyle = "blue";
    context.fillRect( Math.floor(this.ctxWidth/2), Math.floor(this.ctxHeight/2), 40,40);
    context.closePath();

    this.img.onload = drawImageActualSize; // Draw when image has loaded
    function drawImageActualSize() {
      context.drawImage(this, 150, 400, this.width, this.height);
    }
  }

  
}
      //mit Math.floor(this.ctxHeight/2) geht das laden des bildes nicht????
      //Hintergrund entfernen??
      //allgemeiner Hintergrund größer machen
      //bild laden extrem lange
      //bild animation nicht möglich