import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class Logger {

    logs: string[] = [];
    errors: string[] = [];

    public log(message: string): void {
        this.logs.push(message);
        if (environment.debug) {
            console.log(message);
        }
    }

    public err(error: object, message: string): void {

        this.errors.push(message);
        if (environment.debug) {
            console.error(message);
            console.error(error);
        }
    }
}
