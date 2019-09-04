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

    tool: Tool;

    constructor(private mainService: MainService, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.mainService.renderer = this.renderer;
        this.mainService.tool.subscribe(data => this.tool = data);
        this.mainService.canvas = this.canvas.nativeElement;
        this.mainService.addListeners();
    }

}
