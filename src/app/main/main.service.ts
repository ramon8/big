import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tool } from '@app/_types';
import { Shape } from '@app/_models';
import { Point } from '@app/_models/point.model';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    //The selected tool
    tool: BehaviorSubject<Tool>;

    //Contains if the mouse is pressed or not
    mouseIsDown: boolean;

    //All the shapes of the draw ready to be exported as background-image
    drawShapes: Shape[];

    //All the shapes of showed on the canvas
    canvasShapes: Shape[];

    //The shapes count
    shapesCount: number = 0;

    //The canvas of the editor
    canvas: HTMLCanvasElement;

    //The HTML element that contains the canvas
    canvasCotnainer: ElementRef;

    //The renderer2 service from angular
    renderer: Renderer2;

    //the context of the canvas
    ctx: CanvasRenderingContext2D;

    //The shape id that its selected
    currentShape: number;

    constructor() {
        //initialize the tool behaivorSubject
        this.tool = new BehaviorSubject<Tool>('none');
        //initialize the canvasShapes
        this.canvasShapes = [];
        //at the start of the app mouse is always up
        this.mouseIsDown = false;
    }

    /**
     * Handle when you click the canvas with a tool or without
     * @param tool The current tool used by the user
     * @param mouseEvent The mousedown event
     */
    handleClick(tool: Tool, mouseEvent: MouseEvent): void {
        switch (tool) {
            case 'rectangle':
                this.handleRectangleClick(mouseEvent);
                break;
            case 'none':
                this.handleNoneClick(mouseEvent);
                break;
            default: break;
        }
        this.renderCanvas();
    }


    /**
     * Handle when the user move the mouse over the canvas with a tool or without
     * @param tool The current tool used by the user
     * @param mouseEvent The mousemove event
     */
    handleMouseMove(tool: Tool, mouseEvent: MouseEvent): void {
        switch (tool) {
            case 'rectangle':
                this.handleRectangleMove(mouseEvent);
                break;
            case 'none':
                this.handleNoneMove(mouseEvent);
                break;
            default: break;
        }
        this.renderCanvas();
    }

    /**
     * Handle when the user release the mouse button on the canvas with a tool or without
     * @param tool The current tool used by the user
     * @param mouseEvent The mousemove event
     */
    handleMouseUp(tool: Tool, mouseEvent: MouseEvent): void {
        this.mouseIsDown = false;
        switch (tool) {
            case 'rectangle':
                this.handleRectangleUp(mouseEvent);
                break;
            case 'none':
                this.handleNoneUp(mouseEvent);
                break;
            default: break;
        }
        this.renderCanvas();
    }


    /**
     * Handle when the user move the mouse up with the rectangle tool
     * @param mouseEvent The mousemove event
     */
    handleRectangleUp(mouseEvent: MouseEvent): void {
        // Fins the current used shape
        const shape = this.canvasShapes.find(x => x.id === this.currentShape);
        // Unselect all the other shapes
        this.unselectShapes();
        // set the current shape to finished
        shape.finished = true;
        // set the current shape to selected
        shape.selected = true;
    }

    handleNoneUp(mouseEvent: MouseEvent): void {

    }

    /**
     * Handle when the user click with the rectangle tool
     * @param mouseEvent The mousemove event
     */
    handleRectangleClick(mouseEvent: MouseEvent): void {
        // the mouse now is down
        this.mouseIsDown = true;
        // initialize create a new shape
        const shape: Shape = new Shape();
        // set the position of the shape using the position of the mouse
        shape.position = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        // set the initial position
        shape.initialPosition = new Point(mouseEvent.offsetX, mouseEvent.offsetY);

        // set the id of the shape
        shape.id = this.shapesCount++;
        this.currentShape = shape.id;
        this.canvasShapes.push(shape);
    }

    /**
     * Handle when the user click with the rectangle tool
     * @param mouseEvent The mousemove event
     */
    handleNoneClick(mouseEvent: MouseEvent): void {
        this.unselectShapes();
        const shape = this.findShapeOnPoint(new Point(mouseEvent.offsetX, mouseEvent.offsetY));
        if (shape) { shape.selected = true; }
    }

    /**
     * Handle when the user move the mouse with the rectangle tool over the canvas
     * @param mouseEvent The mousemove event
     */
    handleRectangleMove(mouseEvent: MouseEvent): void {
        // when the mouse is down
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        if (this.mouseIsDown) {
            // get the last shape added to the shapes container and the set the dimensions
            this.canvasShapes.find(shp => shp.id === this.currentShape).setDimensions(position);
        }
    }


    handleNoneMove(mouseEvent: MouseEvent): void {

    }

    /**
     * Clear the canvas
     */
    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    /**
     * Finds a shape in the given position, if not return null
     * @param position the position where find
     */
    findShapeOnPoint(position: Point): Shape {
        // search in every shape to find the one that is in the given position
        let shape: Shape = null;
        this.canvasShapes.forEach((shp) => {
            if (this.checkPosition(shp, position)) { shape = shp; }
        });
        return shape;
    }

    /**
     * Return true if there is a shape in this position
     * @param position the position to check
     */
    checkPosition(shape: Shape, position: Point): boolean {
        return (
            shape.position.x < position.x &&
            shape.position.y < position.y &&
            shape.dimension.x + shape.position.x > position.x &&
            shape.dimension.y + shape.position.y > position.y
        );
    }

    // Unselect all the shappes
    unselectShapes(): void {
        this.canvasShapes.forEach((shape) => {
            shape.selected = false;
        });
    }

    // renders the canvas with all the shapes
    renderCanvas(): void {
        const ctx = this.ctx;
        // clear the cnanvas
        this.clearCanvas();
        this.canvasShapes.forEach((shape) => {
            ctx.beginPath();
            // set the strocke of the drawing shape
            ctx.strokeStyle = 'green';
            // if the shape is finished
            if (shape.finished) {
                // if the shape is selected
                if (shape.selected) {
                    // draw the shape in selected mode
                    this.drawSelected(shape, 3);
                }
                ctx.fillStyle = shape.color;
                ctx.fillRect(shape.position.x, shape.position.y, shape.dimension.x, shape.dimension.y);
                if (shape.selected) {
                    this.drawSelectionPoint(ctx, shape);
                }
            } else {
                ctx.strokeRect(shape.position.x, shape.position.y, shape.dimension.x, shape.dimension.y);
            }
            // ctx.fillStyle = shape.color;
        });
    }

    /**
     * Draw a shape in the select mode in the canvas
     * @param shape the shape to draw
     * @param thickness the border size
     */
    drawSelected(shape: Shape, border: number = 1): void {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(
            shape.position.x - (border),
            shape.position.y - (border),
            shape.dimension.x + (border * 2),
            shape.dimension.y + (border * 2)
        );
    }

    /**
     * Draw the selection points of the shape
     */
    drawSelectionPoint(ctx: CanvasRenderingContext2D, shape: Shape): void {
        ctx.fillStyle = 'green';
        // ctx.beginPath();
        // ctx.arc(shape.position.x, shape.position.y, 5, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(shape.position.x, shape.position.y + shape.dimension.y, 5, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(shape.position.x + shape.dimension.x, shape.position.y, 5, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.arc(shape.position.x + shape.dimension.x, shape.position.y + shape.dimension.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // add the listeners for the canvas
    addListeners(): void {
        this.ctx = this.canvas.getContext('2d');
        this.renderer.listen(this.canvas, 'mousedown', (e) => {
            this.handleClick(this.tool.getValue(), e);
        });
        this.renderer.listen(this.canvas, 'mousemove', (e) => {
            this.handleMouseMove(this.tool.getValue(), e);
        });
        this.renderer.listen(this.canvas, 'mouseup', (e) => {
            this.handleMouseUp(this.tool.getValue(), e);
        });
    }
}
