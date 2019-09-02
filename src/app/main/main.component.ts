import { Component, OnInit, HostListener } from '@angular/core';

import { MediaScreenService } from '@app/_services/media-screen.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    vwSize: number;

    constructor(
        private mediaScreenService: MediaScreenService
    ) { }

    ngOnInit(): void {
        // set vwSize
        this.onResize();
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.vwSize = this.windowWith();
    }

    private windowWith(): number {
        return this.mediaScreenService.getWindowWith();
    }
}
