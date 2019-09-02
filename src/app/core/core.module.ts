import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// modules
import { SharedModule } from '@app/shared/shared.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { HttpErrorsInterceptor } from './errors/http-errors.interceptor';
import { CustomErrorPageComponent } from './components/custom-error-page/custom-error-page.component';

// components

// required for AOT (ahead of time) compilation in your project
// prefix and suffix are in case a different base-href is used
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        CustomErrorPageComponent,
    ],
    imports: [
        SharedModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    exports: [
        AppRoutingModule,
        TranslateModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true },
    ]
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
}
