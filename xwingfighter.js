export default class XwingFighter{
    
  constructor(context,img) {
    this.img = img;
    this.x = 150;
    this.y= 400;
    this.ctxWidth = context.canvas.width;
    this.ctxHeight = context.canvas.height;
  }
  
  draw(context){
    
    
    context.drawImage(this.img, this.x, this.y,70,70);
  }
  
  shot(context){
    context.beginPath();
    context.fillStyle = "green";
    context.fillRect(20,10,10,10);
    context.closePath();
  }

}
      //mit Math.floor(this.ctxHeight/2) geht das laden des bildes nicht????
      //allgemeiner Hintergrund größer machen
      //bild laden extrem lange
      //bild animation nicht möglich