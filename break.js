export function breakScreen(ctx, score){
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(100,200,200,50);
    ctx.font = '48px serif';
    ctx.FillText("Play", 100, 200);
    ctx.resetTransform();
}

