import {SQUARE_SIZE, ATE_IT_EVENT, BLINK_OFF, BLINK_ON} from './constants';
import Square from './Square';

export default class FoodSupply {
    constructor(rowCount) {
        this.rowCount = rowCount;
        this.blinkSettings = [BLINK_OFF, BLINK_ON];
        this.blinkState = 1;
        this.updatePosition = this.updatePosition.bind(this);
        document.addEventListener(ATE_IT_EVENT, this.updatePosition, false);
        this.updatePosition();
    }

    updatePosition() {
        this.square = new Square([
            Math.floor(Math.random() * this.rowCount) * SQUARE_SIZE, 
            Math.floor(Math.random() * this.rowCount) * SQUARE_SIZE 
        ]);
    }

    getBlinkState(time) {
        if (!this.prevTime) {
            this.prevTime = time;
        }
        if (time - this.prevTime > this.blinkSettings[this.blinkState]) {
            this.blinkState = this.blinkState ? 0 : 1;
            this.prevTime = time;
        }
        return this.blinkState;
    }

    draw(time) {
        const blinkState = this.getBlinkState(time);
        if (!blinkState) {
            return null;
        }
        return [...this.square.pos, SQUARE_SIZE, SQUARE_SIZE];
    }

    cleanUp() {
        document.removeEventListener(ATE_IT_EVENT, this.updatePosition);
    }
}
