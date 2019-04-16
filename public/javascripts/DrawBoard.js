/**
 * Capsules the DOM-Canvas element.
 */
class DrawBoard {
    constructor(width, height, canvas) {
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        /** @type {CanvasRenderingContext2D} */
        this.context = canvas.getContext("2d");

        this.canvas.width = width;
        this.canvas.height = height;

        
    }
}




