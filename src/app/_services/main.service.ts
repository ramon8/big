import { Injectable, Renderer2 } from '@angular/core';
import { Canvas } from '@app/_models/canvas.model';
import { Shape } from '@app/_models';
import { Rectangle } from '@app/_models/rectangle.model';
import { Point } from '@app/_models/point.model';
import { BehaviorSubject } from 'rxjs';
import { Tool } from '@app/_types';
import { RectangleHandler } from './rectangleHandler.service';
import { Instance } from '@app/_models/instance.model';

@Injectable({
    providedIn: 'root'
})
export class MainService {

    public instance: Instance;

    constructor(
        private rectangleHandler: RectangleHandler
    ) { }

    /**
     * Sets up all the variables and listeners of the main service
     */
    setup(renderer: Renderer2, canvas: HTMLCanvasElement, canvasContainer: HTMLDivElement): void {
        this.instance = new Instance(
            new BehaviorSubject<Tool>('none'),
            1,
            new Point(),
            new Canvas(600, 450),
            canvas,
            canvasContainer,
            canvas.getContext('2d'),
            renderer,
            null,
            null,
            new Point(),
            new BehaviorSubject<boolean>(false),
            []
        );
        // this.instance.tool = new BehaviorSubject<Tool>('none');
        // this.instance.keySpace = new BehaviorSubject<boolean>(false);

        this.rectangleHandler = new RectangleHandler();

        this.instance.keySpace.subscribe((isPressed) => {
            if (isPressed) {
                this.instance.tool.next('move');
            } else {
                this.instance.tool.next('none');
            }
        });


        this.resizeWindow();
        this.addListeners();

        this.render();
    }

    /**
     * render all the elements on the canvas
     */
    render(): void {
        this.instance.ctx.beginPath();
        this.instance.ctx.clearRect(
            this.instance.startPoint.x,
            this.instance.startPoint.y,
            this.instance.canvasContainer.offsetWidth * this.instance.zoom,
            this.instance.canvasContainer.offsetHeight * this.instance.zoom
        );
        this.instance.canvas.render(this.instance);
        this.instance.shapes.forEach((shp: any) => {
            shp.render(this.instance);
        });
    }

    /**
     * resize the canvas based on the container dimensions
     */
    resizeWindow(): void {
        this.instance.canvasElement.width = this.instance.canvasContainer.offsetWidth;
        this.instance.canvasElement.height = this.instance.canvasContainer.offsetHeight;
        this.render();
    }

    /**
     *
     */
    private addListeners(): void {

        // MOUSE DOWN
        this.instance.renderer.listen(this.instance.canvasElement, 'mousedown', (mouseEvent: MouseEvent) => {
            this.handleMouseDown(mouseEvent);
            this.render();
        });

        // MOUSE MOVE
        this.instance.renderer.listen(this.instance.canvasElement, 'mousemove', (mouseEvent: MouseEvent) => {
            this.handleMouseMove(mouseEvent);
        });

        // MOUSE UP
        this.instance.renderer.listen(this.instance.canvasElement, 'mouseup', (mouseEvent: MouseEvent) => {
            this.handleMouseUp(mouseEvent);
            this.render();
        });

        // RESIZE
        this.instance.renderer.listen(window, 'resize', () => {
            this.resizeWindow();
        });

        // MOUSE WHEEL
        this.instance.renderer.listen(this.instance.canvasElement, 'mousewheel', (e: WheelEvent) => {
            this.instance.zoom = e.deltaY < 0 ? this.instance.zoom + 0.01 : this.instance.zoom <= 0.6 ? 0.6 : this.instance.zoom - 0.01;
            this.render();
        });

        // KEY DOWN
        this.instance.renderer.listen(document, 'keydown', (key: KeyboardEvent) => {
            const keyString = 'key' + key.code;
            if (this[keyString]) {
                this[keyString].next(true);
            }
        });

        // KEY UP
        this.instance.renderer.listen(document, 'keyup', (key: KeyboardEvent) => {
            const keyString = 'key' + key.code;
            if (this[keyString]) {
                this[keyString].next(false);
            }
        });
    }

    private handleMouseDown(mouse: MouseEvent): void {
        this.instance.cursorDown = { x: mouse.offsetX, y: mouse.offsetY };
        this.instance.cursorUp = null;
        switch (this.instance.tool.getValue()) {
            case 'rectangle':
                this.rectangleHandler.handleDown(mouse, this.instance);
                break;
        }
    }

    private handleMouseMove(mouse: MouseEvent): void {
        const cursor: Point = { x: mouse.offsetX, y: mouse.offsetY };
        switch (this.instance.tool.getValue()) {
            case 'rectangle':
                this.rectangleHandler.handleMove(mouse, this.instance);
                break;
        }
        if (this.instance.cursorDown != null) {
            this.instance.startPoint.x = (this.instance.prevMovement.x - cursor.x) * -1;
            this.instance.startPoint.y = (this.instance.prevMovement.y - cursor.y) * -1;
            this.render();
        }
        this.instance.prevMovement = cursor;
    }

    private handleMouseUp(mouse: MouseEvent): void {
        this.instance.cursorUp = { x: mouse.offsetX, y: mouse.offsetY };
        this.instance.cursorDown = null;
        switch (this.instance.tool.getValue()) {
            case 'rectangle':
                this.rectangleHandler.handleUp(mouse);
                break;
        }
    }
}
