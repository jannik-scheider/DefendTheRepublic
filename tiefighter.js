export default class Tie {
    constructor(context, img) {
      this.img = img;
      this.x = 0;
      this.y= 0;
      this.speed = 100;
      this.ctxWidth = context.canvas.width;
      this.ctxHeight = context.canvas.height;
      this.generateRandomStartPosition();
    }

    draw(context){
      let xwing_x = 150;
      let xwing_y = 400;
      let vector_x = xwing_x - this.x;
      let vector_y = xwing_y - this.y;

      this.x =  this.x + (vector_x/this.speed);
      this.y = this.y + (vector_y/this.speed);

      context.drawImage(this.img, this.x, this.y,40,40);
      
      this.checkCollision();
    }

    generateRandomStartPosition(){
      let site = this.generateRandomSite();
      switch(site){
        case 1:
          //top
          this.x = Math.floor(Math.random() *  this.ctxWidth);
          this.y = 0;
          break;
        case 2:
          //right
          this.x =  this.ctxWidth;
          //console.log(this.ctxWidth);
          this.y = Math.floor(Math.random() *  this.ctxHeight);
          break;
        case 3:
          //bottom
          this.x = Math.floor(Math.random() * this.ctxWidth);
          this.y =  this.ctxHeight;
          break;
        case 4:
          //left
          this.x = 0;
          this.y = Math.floor(Math.random() *  this.ctxHeight);
          break;
        default: 
          console.log("error");
      }

    }

    generateRandomSite(){
      return Math.floor(Math.random() * 4) + 1;
    }

    checkCollision(){
      if(this.x > 150 && this.x < 190 && this.y > 400 && this.y < 440){
        return console.log("game over");
      }
    }

}
  