export default class XwingFighter{
    
  constructor(context,img) {
    this.img = img;
    this.x = 150;
    this.y= 400;
    this.ctxWidth = context.canvas.width;
    this.ctxHeight = context.canvas.height;
  }
  drawRect(x,y,width, height, color, rad, ctx){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(rad);
    ctx.drawImage(this.img,-width/2,-height/2,width,height);
    ctx.resetTransform();
}

  draw(context, x, y, rad){
    this.x = x;
    this.y = y;
    this.drawRect(x,y, 80,80,"red", rad, context);    
    //context.drawImage(this.img, x, y,80,80);
  }
  
  get_x(){
    return this.x;
  }

  get_y(){
    return this.y;
  }
    //ausrechnen des winkels immer max 90 deshalb + quadrant -> winkel bei 90 und 270 90 abziehen da rechnung sonst winkel falsch angibt bei gegenkathete und ankathete
  calculateAngle(ankathete, gegenkathete, quadrant){
      if(quadrant == 90){
          return 90 - Math.atan(gegenkathete/ankathete) * (180/Math.PI) + 90;
      }else if(quadrant == 270){
          return 90 - Math.atan(gegenkathete/ankathete) * (180/Math.PI) + 270;
      }else if(quadrant == 180){
          return Math.atan(gegenkathete/ankathete) * (180/Math.PI) + 180;
      }else{
          return Math.atan(gegenkathete/ankathete) * (180/Math.PI);
      }  
  }
   
  calculateRad(ankathete, gegenkathete){
      return Math.atan(gegenkathete/ankathete);
  }

  
  calculateAnkathete(y, touch_y){
      if(touch_y < y){
          return y - touch_y;
      }else{
          return touch_y - y;
      }   
  }

  
  calculateGegenkathete(x, touch_x){
      if(touch_x < x){
          return x - touch_x;
      }else{
          return touch_x - x;
      }
  }

  
  calculateHypothenuse(a, b){
      return Math.sqrt((a*a) + (b*b));
  }

  
  isTouchinCircle(touch_x, touch_y, x, y, radius){
      let vector_x = touch_x - x;
      let vector_y = touch_y - y;
      let vector_length = Math.sqrt((vector_x*vector_x) + (vector_y* vector_y));

      if(vector_length > radius){
          return false;
      }else{
          return true;
      }
  }
  // überprüft ausgehend von einem Koordinatensystem mit dem Usprung des Kreis mittelpunkts in welcher hälfte der touch punkt liegt
  
  whichQuadrant(touch_x, touch_y, circle_x, circle_y){
      if(touch_x > circle_x && touch_y < circle_y){
          return 0;
      }else if(touch_x > circle_x && touch_y > circle_y){
          return 90;
      }else if(touch_x < circle_x && touch_y > circle_y){
          return 180;
      }else{
          return 270;
      }
  }

}
