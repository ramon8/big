import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MainService } from '@app/main/main.service';
import { Tool } from '@app/_types';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

    @ViewChild('canvas', { static: true }) canvas: ElementRef;
    @ViewChild('canvasContainer', { static: true }) canvasContainer: ElementRef;

    /** The current selected `tool` */
    tool: Tool;

    constructor(
        // The service that controls the web app
        private mainService: MainService,

        // The angular renderer2 from a gular for rendering into the DOM
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        // I pass the `renderer2` to the `mainService`
        this.mainService.renderer = this.renderer;

        // I subscribe to the tool in the mainService
        this.mainService.tool.subscribe(data => this.tool = data);

        // pass the canvas to the mainService
        this.mainService.canvas = this.canvas.nativeElement;

        // added all listeners of the canvas from the mainService
        this.mainService.addListeners();
    }

}
