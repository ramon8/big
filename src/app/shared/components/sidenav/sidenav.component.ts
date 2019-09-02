import { Component, OnInit, HostBinding, Input, HostListener } from '@angular/core';
import {
    trigger,
    state,
    style,
    transition,
    animate,
    AnimationEvent
} from '@angular/animations';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    animations: [
        trigger('toggleDrawer', [
            state('closed', style({
                transform: 'translateX(80vw)'
            })),
            state('opened', style({
                transform: 'translateX(0)',
                'box-shadow': '0px 3px 6px 1px rgba(0, 0, 0, 0.6)'
            })),
            transition('closed <=> opened', animate(300))
        ])
    ]
})
export class SidenavComponent implements OnInit {

    @Input() hasBackdrop: boolean = true;
    showBackdrop: boolean = false;
    private state: 'opened' | 'closed' = 'closed';

    // binds the animation to the host component
    @HostBinding('@toggleDrawer') get getToggleDrawer(): string {
        return this.state;
    }

    constructor() { }

    ngOnInit(): void {
    }

    // listener for when toggle animation starts
    @HostListener('@toggleDrawer.start', ['$event'])
    startDrawerHandler(event: AnimationEvent): void {
        if (event.toState === 'closed') {
            this.showBackdrop = false;
        }
    }

    // listener for when toggle animation finishes
    @HostListener('@toggleDrawer.done', ['$event'])
    doneDrawerHandler(event: AnimationEvent): void {
        if (event.toState === 'opened') {
            this.showBackdrop = true;
        }
    }

    // toggle drawer
    toggle(): void {
        this.state = this.state === 'closed' ? 'opened' : 'closed';
    }

    // opens drawer
    open(): void {
        this.state = 'opened';
    }

    // closes drawer
    close(): void {
        this.state = 'closed';
    }

}
