export default class Shot{
    
    constructor(context, x, y, vx, vy){
        this.x = x;
        this.y= y;
        this.speed = 200;
        this.vector_x = vx;
        this.vector_y = vy;
        this.radius = 5;
        this.ctxWidth = context.canvas.width;
        this.ctxHeight = context.canvas.height;
    }

    drawShot(ctx){
        const startAngle = 0;
        ctx.fillStyle = "green";
        let endAngle = Math.PI * 2; // End point on circle
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, startAngle, endAngle, true);
        ctx.fill();
        ctx.resetTransform();
    }

    moveShot(ctx){
        this.drawShot(ctx);
        this.x += this.vector_x/this.speed;
        this.y += this.vector_y/this.speed;
    }

    checkHit(tiex, tiey){
        let vector_x = tiex - this.x;
        let vector_y = tiey - this.y;
        let vector_length = Math.sqrt((vector_x*vector_x) + (vector_y* vector_y));
        //let radius_length = Math.sqrt((this.radius*this.radius) + (this.radius*this.radius));

        if(vector_length < 5){
            return true;
        }else{
            return false;
        }
    }
}