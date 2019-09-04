import { Component, OnInit } from '@angular/core';
import { MainService } from '@app/main/main.service';

@Component({
    selector: 'app-tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {

    constructor(
        private mainService: MainService
    ) { }

    ngOnInit() {
    }

    clickRectangleBtn(): void {
        this.mainService.tool.next('rectangle');
    }

    clickfingerBtn(): void {
        this.mainService.tool.next('none');
    }

}
