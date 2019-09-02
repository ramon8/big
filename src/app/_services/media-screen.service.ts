import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MediaScreenService {

    constructor() { }

    // get the width (in pixels) of the browser window viewport including, if rendered, the vertical scrollbar.
    getWindowWith(): number {
        return window.innerWidth;
    }
}
