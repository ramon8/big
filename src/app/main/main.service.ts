import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tool } from '@app/_types';
import { Shape } from '@app/_models';
import { Point } from '@app/_models/point.model';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    tool: BehaviorSubject<Tool>;
    mouseIsDown: boolean;
    shapes: Shape[];
    canvas: HTMLCanvasElement;
    canvasCotnainer: ElementRef;
    renderer: Renderer2;
    ctx: CanvasRenderingContext2D;
    currentShape: string;

    constructor() {
        this.tool = new BehaviorSubject<Tool>('none');
        this.shapes = [];
        this.mouseIsDown = false;
    }

    handleClick(tool: Tool, mouseEvent: MouseEvent): void {
        // console.log(mouseEvent);
        switch (tool) {
            case 'rectangle':
                this.handleRectangleClick(mouseEvent);
                break;
            case 'none':
                this.handleNoneClick(mouseEvent);
                break;
            default: break;
        }
        this.renderHtml();
    }


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
        this.renderHtml();
    }

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
        this.renderHtml();
    }

    handleRectangleUp(mouseEvent: MouseEvent): void {
        const shape = this.shapes.find(x => x.id === this.currentShape);
        shape.finished = true;
        this.unselectShapes();
        shape.selected = true;
        console.log(shape);
    }

    handleNoneUp(mouseEvent: MouseEvent): void {

    }

    handleRectangleClick(mouseEvent: MouseEvent): void {
        this.mouseIsDown = true;
        const shape: Shape = new Shape();
        shape.position = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        shape.initialPosition = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        shape.id = this.shapes.length + '';
        this.shapes.push(shape);
    }

    handleNoneClick(mouseEvent: MouseEvent): void {
        // console.log(mouseEvent.offsetX);
        // console.log(mouseEvent.offsetY);
        this.findShape(new Point(mouseEvent.offsetX, mouseEvent.offsetY));
    }

    findShape(position: Point): void {
        this.unselectShapes();
        this.shapes.forEach((shape) => {
            console.log(shape.position.x);
            console.log(shape.position.y);
            console.log(shape.dimension.x);
            console.log(shape.dimension.y);
            if (
                shape.position.x < position.x &&
                shape.position.y < position.y &&
                shape.dimension.x + shape.position.x > position.x &&
                shape.dimension.y + shape.position.y > position.y
            ) {
                shape.selected = true;
            }
        });
    }

    handleRectangleMove(mouseEvent: MouseEvent): void {
        if (this.mouseIsDown) {
            const shape: Shape = this.shapes[this.shapes.length - 1];

            this.currentShape = shape.id;
            const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
            shape.setDimensions(position);
        }
    }

    handleNoneMove(mouseEvent: MouseEvent): void {

    }

    clearCanvas(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    unselectShapes(): void {
        this.shapes.forEach((shape) => {
            shape.selected = false;
        });
    }

    renderHtml(): void {
        const ctx = this.ctx;
        this.clearCanvas(ctx);
        this.shapes.forEach((shape) => {
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            if (shape.finished) {
                if (shape.selected) {
                    this.drawSelected(ctx, shape, 3);
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

    drawSelected(ctx: CanvasRenderingContext2D, shape: Shape, thickness: number = 1): void {
        ctx.fillStyle = 'green';
        ctx.fillRect(
            shape.position.x - (thickness),
            shape.position.y - (thickness),
            shape.dimension.x + (thickness * 2),
            shape.dimension.y + (thickness * 2)
        );
    }

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
