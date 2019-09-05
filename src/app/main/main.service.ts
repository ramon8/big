import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tool } from '@app/_types';
import { Shape } from '@app/_models';
import { Point } from '@app/_models/point.model';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    // The selected tool
    tool: BehaviorSubject<Tool>;

    // Contains if the mouse is pressed or not
    mouseIsDown: boolean;

    // All the shapes of the draw ready to be exported as background-image
    drawShapes: Shape[];

    // All the shapes of showed on the canvas
    canvasShapes: Shape[];

    // The shapes count
    shapesCount: number = 0;

    // The canvas of the editor
    canvas: HTMLCanvasElement;

    // The HTML element that contains the canvas
    canvasContainer: ElementRef;

    // The renderer2 service from angular
    renderer: Renderer2;

    // the context of the canvas
    ctx: CanvasRenderingContext2D;

    // The shape id that its selected
    currentShape: number;

    constructor() {
        // initialize the tool behaivorSubject
        this.tool = new BehaviorSubject<Tool>('none');
        // initialize the canvasShapes
        this.canvasShapes = [
            new Shape('rectangle', { x: 20, y: 20 }, { x: 20, y: 20 }, { x: 100, y: 100 }, false, 'blue', true, 1000, false)
        ];
        // at the start of the app mouse is always up
        this.mouseIsDown = false;
    }

    /**
     * Handle when you click the canvas with a tool or without
     * @param tool The current tool used by the user
     * @param mouseEvent The mousedown event
     */
    handleClick(tool: Tool, mouseEvent: MouseEvent): void {
        this.mouseIsDown = true;
        switch (tool) {
            case 'rectangle':
                this.handleRectangleClick(mouseEvent);
                break;
            case 'none':
                this.handleNoneClick(mouseEvent);
                break;
            case 'move':
                this.handleMoveClick(mouseEvent);
                break;
            case 'se-resize':
                this.handleResizeTopLeftClick(mouseEvent);
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
            case 'move':
                this.handleMoveMove(mouseEvent);
                break;
            case 'se-resize':
                this.handleResizeTopLeftMove(mouseEvent);
                break;
            case 'sw-resize':
                this.handleResizeTopRightMove(mouseEvent);
                break;
            case 'nwse-resize':
                this.handleResizeDownRightMove(mouseEvent);
                break;
            case 'nesw-resize':
                this.handleResizeDownLeftMove(mouseEvent);
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
            case 'move':
                this.handleMoveUp(mouseEvent);
                break;
            case 'se-resize':
                this.handleResizeTopLeftUp(mouseEvent);
                break;
            default: break;
        }
        this.renderCanvas();
    }

    handleResizeTopLeftUp(mouseEvent: MouseEvent): void { }

    handleResizeTopLeftMove(mouseEvent: MouseEvent): void {
        const currentShape: Shape = this.findShapeById(this.currentShape);
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        if (this.checkIfResizeTopLeft(position, currentShape)) {
            this.tool.next('se-resize');
        } else {
            const shape = this.findShapeOnPoint(position);
            if (shape && currentShape.id === shape.id) {
                this.tool.next('move');
            } else {
                this.tool.next('none');
            }
        }
    }

    handleResizeTopRightMove(mouseEvent: MouseEvent): void {
        const currentShape: Shape = this.findShapeById(this.currentShape);
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        if (this.checkIfResizeTopRight(position, currentShape)) {
            this.tool.next('sw-resize');
        } else if (!this.mouseIsDown) {
            const shape = this.findShapeOnPoint(position);
            if (shape && currentShape.id === shape.id) {
                this.tool.next('move');
            } else {
                this.tool.next('none');
            }
        } else {
            this.canvasShapes.find(shp => shp.id === this.currentShape).setDimensions(position);
        }
    }

    handleResizeDownRightMove(mouseEvent: MouseEvent): void {
        const currentShape: Shape = this.findShapeById(this.currentShape);
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        if (this.checkIfResizeDownRight(position, currentShape)) {
            this.tool.next('nwse-resize');
        } else if (!this.mouseIsDown) {
            const shape = this.findShapeOnPoint(position);
            if (shape && currentShape.id === shape.id) {
                this.tool.next('move');
            } else {
                this.tool.next('none');
            }
        } else {
            this.canvasShapes.find(shp => shp.id === this.currentShape).setDimensions(position);
        }
    }

    handleResizeDownLeftMove(mouseEvent: MouseEvent): void {
        const currentShape: Shape = this.findShapeById(this.currentShape);
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        if (this.checkIfResizeDownLeft(position, currentShape)) {
            this.tool.next('nesw-resize');
        } else {
            const shape = this.findShapeOnPoint(position);
            if (shape && currentShape.id === shape.id) {
                this.tool.next('move');
            } else {
                this.tool.next('none');
            }
        }
    }

    handleResizeTopLeftClick(mouseEvent: MouseEvent): void { }

    handleMoveUp(mouseEvent: MouseEvent): void {

    }

    handleMoveClick(mouseEvent: MouseEvent): void {

    }

    handleMoveMove(mouseEvent: MouseEvent): void {
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        const shape = this.findShapeOnPoint(position);
        if (!shape || !shape.selected) {
            this.setDirectionResize(position);
        }
        if (this.mouseIsDown) {
            shape.position.x = position.x - shape.dimension.x / 2;
            shape.position.y = position.y - shape.dimension.y / 2;
        }
    }

    handleNoneMove(mouseEvent: MouseEvent): void {
        const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        const shape: Shape = this.findShapeOnPoint(position);
        if (shape && shape.selected) {
            this.tool.next('move');
        } else {
            this.setDirectionResize(position);
        }
    }

    setDirectionResize(position: Point): void {
        const currentShape = this.findShapeById(this.currentShape);
        if (this.checkIfResizeTopLeft(position, currentShape)) {
            this.tool.next('se-resize');
        } else if (this.checkIfResizeTopRight(position, currentShape)) {
            this.tool.next('sw-resize');
        } else if (this.checkIfResizeDownRight(position, currentShape)) {
            this.tool.next('nwse-resize');
        } else if (this.checkIfResizeDownLeft(position, currentShape)) {
            this.tool.next('nesw-resize');
        } else {
            this.tool.next('none');
        }
    }

    /**
     *  TODO: properly commentary
     */
    checkIfResizeTopLeft(position: Point, currentShape: Shape): boolean {
        return (
            currentShape &&
            currentShape.position.x - 5 < position.x &&
            currentShape.position.y - 5 < position.y &&
            currentShape.position.x + 5 > position.x &&
            currentShape.position.y + 5 > position.y
        );
    }

    /**
     *  TODO: properly commentary
     */
    checkIfResizeTopRight(position: Point, currentShape: Shape): boolean {
        return (
            currentShape &&
            currentShape.position.x + currentShape.dimension.x - 5 < position.x &&
            currentShape.position.y - 5 < position.y &&
            currentShape.position.x + currentShape.dimension.x + 5 > position.x &&
            currentShape.position.y + 5 > position.y
        );
    }
    /**
     *  TODO: properly commentary
     */
    checkIfResizeDownRight(position: Point, currentShape: Shape): boolean {
        return (
            currentShape &&
            currentShape.position.x + currentShape.dimension.x - 5 < position.x &&
            currentShape.position.y + currentShape.dimension.y - 5 < position.y &&
            currentShape.position.x + currentShape.dimension.x + 5 > position.x &&
            currentShape.position.y + currentShape.dimension.y + 5 > position.y
        );
    }
    /**
     *  TODO: properly commentary
     */
    checkIfResizeDownLeft(position: Point, currentShape: Shape): boolean {
        return (
            currentShape &&
            currentShape.position.x - 5 < position.x &&
            currentShape.position.y + currentShape.dimension.y - 5 < position.y &&
            currentShape.position.x + 5 > position.x &&
            currentShape.position.y + currentShape.dimension.y + 5 > position.y
        );
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
        this.tool.next('none');
    }

    handleNoneUp(mouseEvent: MouseEvent): void {

    }

    /**
     * Handle when the user click with the rectangle tool
     * @param mouseEvent The mousemove event
     */
    handleRectangleClick(mouseEvent: MouseEvent): void {
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
        this.currentShape = shape ? shape.id : null;
        if (shape) { shape.selected = true; }
    }

    /**
     * TODO properly coment
     */
    findShapeById(id: number): Shape {
        // search in every shape to find the one that with id
        const shape: Shape = this.canvasShapes.find(shp => shp.id === id);
        return shape;
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
                if (!shape.hidde) {
                    // if the shape is selected
                    ctx.fillStyle = shape.color;
                    ctx.fillRect(shape.position.x, shape.position.y, shape.dimension.x, shape.dimension.y);
                    if (shape.selected) {
                        this.drawSelectionPoint(ctx, shape);
                    }
                }
            } else {
                ctx.strokeRect(shape.position.x, shape.position.y, shape.dimension.x, shape.dimension.y);
            }
            // ctx.fillStyle = shape.color;
        });
        this.drawSelected(this.canvasShapes.find(shp => shp.selected && !shp.hidde), 3);
    }

    /**
     * Draw a shape in the select mode in the canvas
     * @param shape the shape to draw
     * @param thickness the border size
     */
    drawSelected(shape: Shape, border: number = 1): void {
        if (shape) {
            this.ctx.fillStyle = 'green';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(shape.position.x, shape.position.y, shape.dimension.x, shape.dimension.y);
        }
    }

    /**
     * Draw the selection points of the shape
     */
    drawSelectionPoint(ctx: CanvasRenderingContext2D, shape: Shape): void {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(shape.position.x, shape.position.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(shape.position.x, shape.position.y + shape.dimension.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(shape.position.x + shape.dimension.x, shape.position.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(shape.position.x + shape.dimension.x, shape.position.y + shape.dimension.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    // add the listeners for the canvas
    addListeners(): void {
        this.ctx = this.canvas.getContext('2d');
        this.renderer.listen(this.canvas, 'mousedown', (e) => {
            this.handleClick(this.tool.getValue(), e);
        });
        this.renderer.listen(this.canvasContainer, 'mousemove', (e) => {
            this.handleMouseMove(this.tool.getValue(), e);
        });
        this.renderer.listen(this.canvas, 'mouseup', (e) => {
            this.handleMouseUp(this.tool.getValue(), e);
        });
    }
}
