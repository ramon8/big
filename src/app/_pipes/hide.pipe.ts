import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hide'
})
export class HidePipe implements PipeTransform {

    transform(value: string, args?: any): string {
        return value.replace(/./g, '\u2022');
    }

}
