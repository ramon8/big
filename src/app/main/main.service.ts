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
    canvas: ElementRef;
    canvasCotnainer: ElementRef;
    renderer: Renderer2;

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
    }

    handleRectangleClick(mouseEvent: MouseEvent): void {
        this.mouseIsDown = true;
        const shape: Shape = new Shape();
        console.log(mouseEvent);
        shape.position = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        shape.initialPosition = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
        this.shapes.push(shape);
    }

    handleNoneClick(mouseEvent: MouseEvent): void {

    }

    handleRectangleMove(mouseEvent: MouseEvent): void {
        if (this.mouseIsDown) {
            const shape: Shape = this.shapes[this.shapes.length - 1];
            const position: Point = new Point(mouseEvent.offsetX, mouseEvent.offsetY);
            shape.setDimensions(position);
            this.renderHtml();
        }
    }

    handleNoneMove(mouseEvent: MouseEvent): void {

    }

    renderHtml(): void {
        this.canvas.nativeElement.innerHTML = null;
        this.shapes.forEach((shape) => {
            this.renderer.appendChild(this.canvas.nativeElement, this.createShape(shape));
            // this.canvas.nativeElement.append(this.createShape(shape));
        });
    }

    createShape(shape: Shape): HTMLElement {

        const div: HTMLElement = this.renderer.createElement('div');
        div.id = this.shapes.length.toString();

        div.style.position = 'absolute';

        div.style.width = shape.dimension.x + 'px';
        div.style.height = shape.dimension.y + 'px';

        div.style.top = shape.position.y + 'px';
        div.style.left = shape.position.x + 'px';
        div.style.backgroundColor = shape.color;
        div.style.opacity = '0.1';
        this.renderer.listen(div, 'mousedown', (mouseEvent: MouseEvent) => {
            mouseEvent.stopPropagation();
        });
        this.renderer.listen(div, 'mouseover', (mouseEvent: MouseEvent) => {
            mouseEvent.stopPropagation();
        });
        return div;
    }
}
