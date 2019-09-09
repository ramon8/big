import { Component, OnInit } from '@angular/core';
import { MainService } from '@app/_services/main.service';
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

    ngOnInit(): void { }

}
