import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Logger } from '@app/_helpers/logger';

@Injectable({ providedIn: 'root' })
export class HttpErrorsInterceptor implements HttpInterceptor {

    constructor(
        private logger: Logger,
        private translateService: TranslateService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .pipe(
                timeout(5000),
                retry(2),
                catchError(this.handleError<any>(req.method, req.urlWithParams, {}))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param method - method of the operation that failed
     * @param url - url of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(method: string, url: string, result?: T): (error: any) => Observable<T> {
        return (error: any): Observable<T> => {

            // error message
            let errorMessage = 'Something bad happened; please try again later.';
            this.translateService.get('common.error_message')
                .subscribe(
                    (res: string) => {
                        errorMessage = res;
                    }
                );

            this.logger.err(error, `${method} ${url} failed: ${error.error}`);

            // TODO: decide if error handler should return an empty observable or throw error
            // Let the app keep running by returning an empty result.
            // return of(result as T);

            console.log(errorMessage);

            // return an observable with a user-facing error message
            return throwError(errorMessage);
        };
    }
}
