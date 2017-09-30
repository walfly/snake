import { UP, DOWN, LEFT, RIGHT, SQUARE_SIZE } from './constants';

const dirDecisionMethods = {
    [UP]: startPos => newPos => {
        return newPos[1] <= startPos[1];
    },
    [DOWN]: startPos => newPos => {
        return newPos[1] >= startPos[1];
    },
    [LEFT]: startPos => newPos => {
        return newPos[0] <= startPos[0];
    },
    [RIGHT]: startPos => newPos => {
        return newPos[0] >= startPos[0];
    },
    initial: () => false
};

export default class DirectionMarker {
    constructor(dir, pos, count, prevDir) {
        this.dir = dir;
        this.pos = this.posOnGrid(pos, dir, prevDir);
        this.count = count;
        this.test = prevDir ? dirDecisionMethods[prevDir](this.pos) : dirDecisionMethods['initial'];
        this.move = this[this.dir];
    }
    [UP](pos, delta) {
        return [this.pos[0], pos[1] - delta];
    }
    [DOWN](pos, delta) {
        return [this.pos[0], pos[1] + delta];
    }
    [LEFT](pos, delta) {
        return [pos[0] - delta, this.pos[1]];
    }
    [RIGHT](pos, delta) {
        return [pos[0] + delta, this.pos[1]];
    }
    incrementCount() {
        this.count++;
    }
    posOnGrid(pos, dir, prevDir) {
        if(!prevDir) {
            return pos;
        } 
        let additional;
        switch (prevDir) {
            case UP:
                additional = pos[1] % SQUARE_SIZE;
                return [pos[0], pos[1] - additional];
            case DOWN:
                additional = SQUARE_SIZE - (pos[1] % SQUARE_SIZE);
                return [pos[0], pos[1] + additional];
            case LEFT:
                additional = pos[0] % SQUARE_SIZE;
                return [pos[0] - additional, pos[1]];
            case RIGHT:
                additional = SQUARE_SIZE - (pos[0] % SQUARE_SIZE);
                return [pos[0] + additional, pos[1]];
        }
    }
};
