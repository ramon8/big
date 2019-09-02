import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';

// modules

// components
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HidePipe } from '@app/_pipes/hide.pipe';

@NgModule({
    declarations: [
        SidenavComponent,
        HidePipe
    ],
    entryComponents: [
    ],
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        TranslateModule,
        SidenavComponent,
        HidePipe
    ]
})
export class SharedModule { }
