import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from '@app/shared/shared.module';
import { ToolBarComponent } from './components/tool-bar/tool-bar.component';
import { LayerComponent } from './components/layer/layer.component';
import { ShapeInfoComponent } from './components/shape-info/shape-info.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [MainComponent, ToolBarComponent, LayerComponent, ShapeInfoComponent, CanvasComponent],
    imports: [
        CommonModule,
        MainRoutingModule,
        SharedModule,
        FormsModule
    ]
})
export class MainModule { }
