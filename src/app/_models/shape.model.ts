import { Point } from './point.model';
import { HotSpot } from '@app/_types';
import { BehaviorSubject } from 'rxjs';

export class Shape {

    constructor(
        private x: number = 0,
        private y: number = 0,
        private width: number = 0,
        private height: number = 0,
        private isHidden: boolean = false,
        private isLocked: boolean = false,
        private isSelected: boolean = false,
        private color: string = 'red',
        private shadowColor: string = 'black',
        private shadowBlur: number = 0,
        private startX: number = 0,
        private startY: number = 0,
        private zoom: number = 0

    ) { }

    // GETTERS AND SETTERS

    /**
     * Getter for x
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Setter for x
     */
    public setX(x: number): void {
        this.x = x;
    }

    /**
     * Getter for y
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Setter for y
     */
    public setY(y: number): void {
        this.y = y;
    }

    /**
     * Getter for width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Setter for width
     */
    setWidth(width: number): void {
        this.width = width;
    }

    /**
     * Getter for height
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Setter for height
     */
    setHeight(height: number): void {
        this.height = height;
    }

    /**
     * Getter for isLocked
     */
    getIsLocked(): boolean {
        return this.isLocked;
    }

    /**
     * Setter for isLocked
     */
    setIsLocked(isLocked: boolean): void {
        this.isLocked = isLocked;
    }

    /**
     * Getter for isHidden
     */
    getIsHidden(): boolean {
        return this.isHidden;
    }

    /**
     * Setter for isHidden
     */
    public setIsHidden(isHidden: boolean): void {
        this.isHidden = isHidden;
    }

    /**
     * Getter for isSelected
     */
    public getIsSelected(): boolean {
        return this.isSelected;
    }

    /** Setter for isSelected */
    public setIsSelected(isSelected: boolean): void {
        this.isSelected = isSelected;
    }

    /** Getter for shadowColor */
    getShadowColor(): string {
        return this.shadowColor;
    }

    /** Setter for shadowColor */
    setShadowColor(shadowColor: string): void {
        this.shadowColor = shadowColor;
    }

    /** Getter for shadowBlur */
    getShadowBlur(): number {
        return this.shadowBlur;
    }

    /** Setter for shadowBlur */
    setShadowBlur(shadowBlur: number): void {
        this.shadowBlur = shadowBlur;
    }

    /** Getter for color */
    getColor(): string {
        return this.color;
    }

    /** Setter for color */
    setColor(color: string): void {
        this.color = color;
    }

    /** Getter for startX */
    getStartX(): number {
        return this.startX;
    }

    /** Setter for startX */
    setStartX(startX: number): void {
        this.startX = startX;
    }

    /** Getter for startY */
    getStartY(): number {
        return this.startY;
    }

    /** Setter for startY */
    setStartY(startY: number): void {
        this.startY = startY;
    }

    /** Getter for zoom */
    getZoom(): number {
        return this.zoom;
    }

    /** Setter for zoom */
    setZoom(zoom: number): void {
        this.zoom = zoom;
    }




    // CUSTOM METHODS

    /** Return the position of the shape */
    public getPosition(): Point {
        return new Point(this.x, this.y);
    }

    /** Set the position of the shape, return false if the position its out of the canvas */
    public setPosition(position: Point, canvas: any): boolean {
        const startPosition: Point = { x: canvas.x, y: canvas.y };
        const endPosition: Point = { x: canvas.width + canvas.x, y: canvas.height + canvas.y };
        if (this.isPointInside(position, startPosition, endPosition)) {
            this.setX(position.x);
            this.setY(position.y);
            return true;
        }
        return false;
    }

    /** Return the position of the shape */
    public getPointAt(hotSpot: HotSpot): Point {
        let point: Point;
        switch (hotSpot) {
            case 'bottomLeft':
                return point = {
                    x: this.x,
                    y: this.y + this.height
                };
            case 'bottomRight':
                return point = {
                    x: this.x + this.width,
                    y: this.y + this.height
                };
            case 'center':
                return point = {
                    x: this.x + this.width / 2,
                    y: this.y + this.height / 2
                };
            case 'centerBottom':
                return point = {
                    x: this.x + this.width / 2,
                    y: this.y + this.height
                };
            case 'centerLeft':
                return point = {
                    x: this.x,
                    y: this.y + this.height / 2
                };
            case 'centerRight':
                return point = {
                    x: this.x + this.width,
                    y: this.y + this.height / 2
                };
            case 'centerTop':
                return point = {
                    x: this.x + this.width / 2,
                    y: this.y
                };
            case 'topLeft':
                return point = this.getPosition();
            case 'topRight':
                return point = {
                    x: this.x + this.width,
                    y: this.y
                };
        }
    }

    /**
     * Return true if the point its inside the startPoint and endPoint
     */
    private isPointInside(pointToCheck: Point, startPoint: Point, endPoint: Point): boolean {
        return (
            pointToCheck.x > startPoint.x &&
            pointToCheck.x < endPoint.x &&
            pointToCheck.y > startPoint.y &&
            pointToCheck.y < endPoint.y
        );
    }
}
