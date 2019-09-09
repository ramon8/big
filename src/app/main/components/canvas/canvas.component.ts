import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MainService } from '@app/_services/main.service';
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
        this.mainService.setup(this.renderer, this.canvas.nativeElement, this.canvasContainer.nativeElement);
        this.mainService.instance.tool.subscribe((tool) => {
            this.tool = tool;
        });
    }
}
