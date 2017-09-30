import {UP, DOWN, LEFT, RIGHT, SQUARE_SIZE} from './constants';

const unitVectors = {
    [UP]: [0,1],
    [DOWN]: [0,-1],
    [LEFT]: [1, 0],
    [RIGHT]: [-1, 0]
}

const followDist = SQUARE_SIZE + 2;

export default class Square{
    constructor(pos) {
        this.pos = pos;
    }

    move(dirMarker, delta) {
        this.pos = dirMarker.move(this.pos, delta);
    }

    follow(dir, leaderPos) { // method maintains spacing
        switch (dir) {
            case UP:
            case DOWN:
                this.pos = [leaderPos[0], leaderPos[1] + (unitVectors[dir][1] * followDist)];
                break;
            case RIGHT:
            case LEFT:
                this.pos = [leaderPos[0] + (unitVectors[dir][0] * followDist), leaderPos[1]];
                break;
        }
    }

    isCollision(pos) {
        const distX = Math.abs(pos[0] - this.pos[0]);
        const distY = Math.abs(pos[1] - this.pos[1]);
        const squareOverlap = SQUARE_SIZE / 2;
        return distX < squareOverlap && distY < squareOverlap; // if its less then half a square in both directions it must be a collision 
    }

    draw() {
        return [...this.pos, SQUARE_SIZE, SQUARE_SIZE];
    }
}
