import styles from './renderer.css';
import Snake from './Snake';
import FoodSupply from './FoodSupply'
import {UP, DOWN, LEFT, RIGHT, SQUARE_SIZE, ATE_IT_EVENT} from './constants';

export default class Renderer {

    constructor() {
        this.sizeCanvas();
        this.initialDomSetup();
        this.bindEventHandlers();
        this.ateIt = new window.Event(ATE_IT_EVENT);
        document.addEventListener('keyup', this.startGame);
    }

    sizeCanvas() {
        const smallDim = Math.min(window.innerWidth, window.innerHeight - 35);
        let numRows = Math.floor(smallDim/SQUARE_SIZE);
        if (numRows % 2 === 0) { //has to be odd so that there is a middle
            numRows --;
        }
        this.numRows = numRows;
        this.canvasSize = numRows * SQUARE_SIZE;
    }

    bindEventHandlers() {
        this.startGame = this.startGame.bind(this);
        this.arrowEvent = this.arrowEvent.bind(this);
        this.draw = this.draw.bind(this);
    }

    createInstructionOverlay() {
        const instructionOverlay = document.createElement('div');
        instructionOverlay.textContent = "Press Space To Begin";
        instructionOverlay.className = styles.instructionOverlay;
        return instructionOverlay;
    }

    createBottomInstructions() {
        const div = document.createElement('div');
        div.textContent = "← ↑ ↓ → to change direction";
        div.className = styles.arrowInstructions;
        return div;
    }

    createCanvasContext() {
        const canvas = document.createElement('canvas');
        canvas.className = styles.canvas;
        const ctx = canvas.getContext('2d');
        ctx.canvas.height = this.canvasSize;
        ctx.canvas.width = this.canvasSize;
        return ctx;
    }

    arrowEvent(e) {
        switch (e.keyCode) {
            case 38:
                this.snake.queueDirection(UP);
                break;
            case 40:
                this.snake.queueDirection(DOWN);
                break;
            case 39:
                this.snake.queueDirection(RIGHT);
                break;
            case 37:
                this.snake.queueDirection(LEFT);
                break;
        }
    }

    startGame(e) {
        if (e.keyCode === 32) {
            document.removeEventListener('keyup', this.startGame);
            this.instructionOverlay.remove();
            this.bottomInstructions = this.createBottomInstructions();
            document.addEventListener('keydown', this.arrowEvent);
            document.body.append(this.bottomInstructions);
            this.snake = new Snake(this.canvasSize, this.ateIt);
            this.foodSupply = new FoodSupply(this.numRows);
            window.requestAnimationFrame(this.draw);
        }
    }

    initialDomSetup() {
        this.ctx = this.createCanvasContext();
        this.instructionOverlay = this.createInstructionOverlay();
        document.body.append(this.ctx.canvas);
        document.body.append(this.instructionOverlay);
    }

    playAgainPrompt() {
        this.bottomInstructions.remove();
        this.foodSupply.cleanUp();
        document.removeEventListener('keydown', this.arrowEvent);
        document.body.append(this.instructionOverlay);
        document.addEventListener('keyup', this.startGame);
    }

    draw(time) {
        if (!this.prevTime) {
            this.prevTime = time;
        }
        this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.ctx.fillStyle="#99c2ff";

        const drawFood = this.foodSupply.draw(time);
        if (drawFood) {
            this.ctx.fillRect(...drawFood);
        }

        this.snake.setDirection();
        this.snake.move(time - this.prevTime);
        this.snake.draw().forEach(item => {
            this.ctx.fillRect(...item)
        });
        this.snake.eats(this.foodSupply.square);
        this.snake.cleanDirMarkers();

        this.prevTime = time;
        if (!this.snake.isGameOver()) {
            window.requestAnimationFrame(this.draw);
        } else {
            this.playAgainPrompt();
        }
    }
}
