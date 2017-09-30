import Square from './Square';
import DirectionMarker from './DirectionMarker';
import { UP, DOWN, LEFT, RIGHT, SQUARE_SIZE } from './constants';

const opposites = {
    [UP]: DOWN,
    [DOWN]: UP,
    [LEFT]: RIGHT,
    [RIGHT]: LEFT
};


export default class Snake{
    constructor(size, eatEvent) {
        this.size = size;
        this.eatEvent = eatEvent;
        this.squares = [];
        this.dirMarkers = [];
        this.squares.push(new Square([
            (this.size/2) - (SQUARE_SIZE/2),
            (size/2) - (SQUARE_SIZE/2)
        ]));
    }

    speed() {
        return 120 * Math.log10(10 * this.squares.length); // diminishing returns on the speed boost.\
    }

    isReverse(dir) {
        return this.dirMarkers.length && this.dirMarkers[this.dirMarkers.length - 1].dir === opposites[dir];
    }

    isSameDir(dir) {
        return this.dirMarkers.length && this.dirMarkers[this.dirMarkers.length - 1].dir === dir;
    }

    queueDirection(dir) {
        if (this.isReverse(dir) || this.isSameDir(dir)) {
            return;
        }
        this.nextDir = dir; // do the actual change in request animation frame
    }

    setDirection() {
        if (!this.nextDir) {
            return;
        }
        let dirMarker;
        if (this.dirMarkers.length === 0) {
            dirMarker = new DirectionMarker(
                this.nextDir,
                this.squares[0].pos,
                this.squares.length
            );
        } else {
            dirMarker = new DirectionMarker(
                this.nextDir,
                this.squares[0].pos,
                0,
                this.dirMarkers[this.dirMarkers.length - 1].dir // need the previous direction to help discern when to redirect
            ); 
        }
        this.dirMarkers.push(dirMarker);
        this.nextDir = null;
    }

    // get rid of passed markers
    cleanDirMarkers() {
        const index = this.dirMarkers.reduceRight((acc, item, index) => {
            if (item.count === this.squares.length && acc === -1) {
                acc = index;
            }
            return acc;
        }, -1);
        if (index !== -1) {
            this.dirMarkers = this.dirMarkers.slice(index, this.dirMarkers.length);
        }
    }

    moveChain(chain, delta, dirMarker, nextDirMarker) {
        chain.forEach((square, index) => {
            if (index === 0) {
                if (nextDirMarker && nextDirMarker.test(square.pos)) {
                    nextDirMarker.incrementCount();
                }
                square.move(dirMarker, delta, nextDirMarker);
            } else {
                square.follow(dirMarker.dir, chain[index - 1].pos);
            }
        });
    }

    // idea is break the snake into sections controlled by invisible direction objects
    move(timeDelta) {
        const delta = (timeDelta/1000) * this.speed();
        if (this.dirMarkers.length === 1) {
            this.moveChain(this.squares, delta, this.dirMarkers[0]);
        } else if (this.dirMarkers.length > 1) {
            const sections = this.dirMarkers.map(item => item.count);
            for (let i = sections.length - 1; i >= 0; i--) {
                this.moveChain(
                    this.squares.slice(sections[i + 1] || 0, sections[i]),
                    delta,
                    this.dirMarkers[i],
                    this.dirMarkers[i + 1]
                );
            }      
        }
    }

    isGameOver() {
        return this.outOfboundsX() || this.outOfboundsY() || this.ateSelf();
    }

    outOfboundsY() {
        const pos = this.squares[0].pos;
        const buffer = SQUARE_SIZE/2;
        return pos[1] + buffer < 0 || pos[1] + buffer > this.size; 
    }

    outOfboundsX() {
        const pos = this.squares[0].pos;
        const buffer = SQUARE_SIZE/2;
        return pos[0] + buffer < 0 || pos[0] + buffer > this.size;
    }

    ateSelf() {
        if (this.dirMarkers.length < 4 || this.squares.length < 4) { // has to be at least 4 turns to make a loop
            return false;
        }
        const checkAgainst = this.squares.slice(this.dirMarkers[this.dirMarkers.length - 3].count, this.squares.length);
        const leader = this.squares[0];
        return checkAgainst.reduce((acc, square) => {
            if (!acc) {
                acc = square.isCollision(leader.pos);
            }
            return acc;
        }, false);
    }

    eats(square) {
        if (square.isCollision(this.squares[0].pos)) {
            const newSquare = new Square([0,0]);
            this.squares.push(newSquare);
            this.dirMarkers[0].count = this.squares.length;
            document.dispatchEvent(this.eatEvent);
        }
    }

    draw() {
        return this.squares.map(square => square.draw());
    }
}
