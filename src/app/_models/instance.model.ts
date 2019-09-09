import { Tool } from '@app/_types';
import { Point } from './point.model';
import { Canvas } from './canvas.model';
import { Renderer2 } from '@angular/core';
import { Shape } from '.';
import { BehaviorSubject } from 'rxjs';

export class Instance {
    constructor(
        public tool: BehaviorSubject<Tool>,
        public zoom: number = 1,
        public startPoint: Point,
        public canvas: Canvas,
        public canvasElement: HTMLCanvasElement,
        public canvasContainer: HTMLDivElement,
        public ctx: CanvasRenderingContext2D,
        public renderer: Renderer2,
        public cursorDown: Point,
        public cursorUp: Point,
        public prevMovement: Point,
        public keySpace: BehaviorSubject<boolean>,
        public shapes: Shape[]
    ) { }
}
