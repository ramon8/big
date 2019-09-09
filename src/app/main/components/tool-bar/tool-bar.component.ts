import { Component, OnInit } from '@angular/core';
import { MainService } from '@app/_services/main.service';

@Component({
    selector: 'app-tool-bar',
    templateUrl: './tool-bar.component.html',
    styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {

    constructor(
        private mainService: MainService
    ) { }

    ngOnInit() { }
}
