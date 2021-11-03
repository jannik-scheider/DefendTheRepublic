import TieFighter from "./tiefighter.js";

export function spawnTies(ctx, ties,width, height){
    for(let tie of ties){
        tie.draw(ctx, width, height);
    }   
}