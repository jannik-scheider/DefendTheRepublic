export default class Shot{
    
    constructor(context, x, y, vx, vy){
        this.x = x;
        this.y= y;
        this.speed = 500;
        this.vector_x = vx;
        this.vector_y = vy;
        this.ctxWidth = context.canvas.width;
        this.ctxHeight = context.canvas.height;
    }

    drawShot(rad, ctx){
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.fillRect(this.x, this.y, 20, 20);
        ctx.resetTransform();
    }

    moveShot(rad, ctx){
        this.drawShot(rad,ctx);
        this.x += this.vector_x/this.speed;
        this.y += this.vector_y/this.speed;
    }
}