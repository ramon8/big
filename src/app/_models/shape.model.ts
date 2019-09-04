import { Point } from './point.model';

export class Shape {

    constructor(
        public type: 'rectangle' = 'rectangle',
        public position: Point = { x: 0, y: 0 },
        public initialPosition: Point = { x: 0, y: 0 },
        public dimension: Point = { x: 50, y: 50 },
        public selected: boolean = false,
        public color: string = 'red',
    ) { }

    setDimensions(mousePosition: Point): void {
        if (this.initialPosition.x < mousePosition.x && this.initialPosition.y < mousePosition.y) {
            this.dimension = {
                x: mousePosition.x - this.initialPosition.x,
                y: mousePosition.y - this.initialPosition.y
            };
        }
        // } else if (this.initialPosition.x > mousePosition.x && this.initialPosition.y > mousePosition.y) {
        //     this.dimension = {
        //         x: mousePosition.x + this.initialPosition.x,
        //         y: mousePosition.y + this.initialPosition.y
        //     };
        //     this.position = {
        //         x: mousePosition.x,
        //         y: mousePosition.y
        //     };
        // } else if (this.initialPosition.x > mousePosition.x && this.initialPosition.y < mousePosition.y) {
        //     this.dimension = {
        //         x: mousePosition.x + this.initialPosition.x,
        //         y: mousePosition.y - this.initialPosition.y
        //     };
        //     this.position.x = mousePosition.x;
        // } else {
        //     this.dimension = {
        //         x: mousePosition.x - this.initialPosition.x,
        //         y: mousePosition.y + this.initialPosition.y
        //     };
        //     this.position.y = mousePosition.y;
        // }
    }
}
