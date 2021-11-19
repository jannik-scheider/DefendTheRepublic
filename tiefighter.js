export default class Tie {
    constructor(context, img, xwing) {
      this.img = img;
      this.x = 0;
      this.y= 0;
      this.spawnX = 0;
      this.spawnY = 0;
      this.xwingX = 0;
      this.xwingY = 0;
      this.speed = 1000;
      this.ctxWidth = context.canvas.width;
      this.ctxHeight = context.canvas.height;
      this.generateRandomStartPosition();
    }

    draw(context, xwing_x, xwing_y){
      if(this.xwingX == 0 && this.xwingY == 0){
        this.xwingX = xwing_x;
        this.xwingY = xwing_y;
      }
      let vector_x = this.xwingX - this.spawnX;
      let vector_y = this.xwingY - this.spawnY;

      this.x =  this.x + (vector_x/this.speed);
      this.y = this.y + (vector_y/this.speed);
      context.beginPath();
      context.translate(this.x, this.y);
      context.drawImage(this.img, -20, -20, 40,40);
      context.resetTransform();

    }

    generateRandomStartPosition(){
      let site = this.generateRandomSite();
      switch(site){
        case 1:
          //top
          this.x = Math.floor(Math.random() *  this.ctxWidth);
          this.y = 0;
          this.spawnX = this.x;
          this.spawnY = this.y;
          break;
        case 2:
          //right
          this.x =  this.ctxWidth;
          //console.log(this.ctxWidth);
          this.y = Math.floor(Math.random() *  this.ctxHeight);
          this.spawnX = this.x;
          this.spawnY = this.y;
          break;
        case 3:
          //bottom
          this.x = Math.floor(Math.random() * this.ctxWidth);
          this.y =  this.ctxHeight;
          this.spawnX = this.x;
          this.spawnY = this.y;
          break;
        case 4:
          //left
          this.x = 0;
          this.y = Math.floor(Math.random() *  this.ctxHeight);
          this.spawnX = this.x;
          this.spawnY = this.y;
          break;
        default: 
          console.log("error");
      }

    }

    generateRandomSite(){
      return Math.floor(Math.random() * 4) + 1;
    }

    checkCollision(xwingx, xwingy){
      let vector_x = xwingx - this.x;
      let vector_y = xwingy - this.y;
      let vector_length = Math.sqrt((vector_x*vector_x) + (vector_y* vector_y));
      //let radius_length = Math.sqrt((this.radius*this.radius) + (this.radius*this.radius));

      if(vector_length < 60){
        return true;
      }else{
        return false;
      }
    }

    get_x(){
      return this.x;
    }
  
    get_y(){
      return this.y;
    }

    checkInCanvas(){
      if(this.x >= 0 && this.x <= this.ctxWidth && this.y >= 0 && this.y <= this.ctxHeight){
        return true;
      }else{
        return false;
      }
    }
  
}
  