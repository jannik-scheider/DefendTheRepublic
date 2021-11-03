export default class Tie {
    constructor(context) {
      this.img = new Image(20,20);
      this.img.src = "./images/tie.png";
      this.x = 0;
      this.y= 0;
      this.vx =  5;
      this.vy = 2;
      this.ctxWidth = context.canvas.width;
      this.ctxHeight = context.canvas.height;
      this.generateRandomStartPosition();
    }

    draw(context){
      context.beginPath();
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, 50,50);
      context.closePath();
      this.x += this.vx;
      this.y += this.vy;

      if (this.y + this.vy > this.ctxHeight || this.y + this.vy < 0) {
        this.vy = -this.vy;
      }
      if (this.x + this.vx > this.ctxWidth || this.x + this.vx < 0) {
        this.vx = -this.vx;
      }
      
      function drawImageActualSize() {
        context.drawImage(this, this.x, this.y, this.width, this.height);
      }

      this.img.onload = drawImageActualSize; // Draw when image has loaded
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
  