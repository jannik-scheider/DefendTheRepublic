export default class Powerup {
    constructor(context, img){
        this.img = img;
        this.x = 0;
        this.y = 0;
        this.ctxWidth = context.canvas.width;
        this.ctxHeight = context.canvas.height;
        this.generateRandomStartPosition();
    }

    generateRandomStartPosition(){
        this.x = Math.floor(Math.random() *  this.ctxWidth);
        this.y = Math.floor(Math.random() *  this.ctxHeight);
    }

    draw(context){
        context.beginPath();
        context.translate(this.x, this.y);
        context.drawImage(this.img, -20, -20, 40,40);
        context.resetTransform();
    }

    checkClicked(touch_x, touch_y){
        let vector_x = touch_x - this.x;
        let vector_y = touch_y - this.y;
        let vector_length = Math.sqrt((vector_x*vector_x) + (vector_y* vector_y));
        //let radius_length = Math.sqrt((this.radius*this.radius) + (this.radius*this.radius));
  
        if(vector_length < 20){
          return true;
        }else{
          return false;
        }
    }
}