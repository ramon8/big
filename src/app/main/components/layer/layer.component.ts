import { Component, OnInit } from '@angular/core';
import { MainService } from '@app/main/main.service';
import { Shape } from '@app/_models';

@Component({
    selector: 'app-layer',
    templateUrl: './layer.component.html',
    styleUrls: ['./layer.component.scss']
})
export class LayerComponent implements OnInit {

    shapes: Shape[];

    constructor(
        private mainService: MainService
    ) { }

    ngOnInit(): void {
        this.shapes = this.mainService.canvasShapes;
    }

    handleClick(shape: Shape): void {
        shape.hidde = !shape.hidde;
        this.mainService.renderCanvas();
    }

    changeLayerOrder(direction: string, shapeId: number): void {
        const index: number = this.shapes.findIndex(shp => shp.id === shapeId);
        const shape: Shape = this.shapes.find(shp => shp.id === shapeId);
        if (direction === 'up' && index < this.shapes.length) {
            this.shapes.splice(index, 1);
            this.shapes.splice(index + 1, 0, shape);
        } else if (direction === 'down' && index > 0) {
            this.shapes.splice(index, 1);
            this.shapes.splice(index - 1, 0, shape);
        } else if (direction === 'delete') {
            this.shapes.splice(index, 1);
        }
        this.mainService.unselectShapes();
        shape.selected = true;
        this.mainService.renderCanvas();
    }

}
