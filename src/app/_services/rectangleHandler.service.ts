import { Injectable } from '@angular/core';
import { Rectangle } from '@app/_models/rectangle.model';
import { Instance } from '@app/_models/instance.model';

@Injectable({
    providedIn: 'root'
})
export class RectangleHandler {

    public handleDown(mouse: MouseEvent, instance: Instance): void {
        const rectangle = new Rectangle();
    }

    public handleMove(mouse: MouseEvent, instance: Instance): void {

    }

    public handleUp(mouse: MouseEvent, instance: Instance): void {

    }
}
