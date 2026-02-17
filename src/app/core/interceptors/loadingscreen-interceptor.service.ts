import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { finalize } from "rxjs/operators";
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable()

export class LoadingScreenInterceptor implements HttpInterceptor {
  get utilSer() {
    return this.injector.get(UtilityService);
  }
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.utilSer.show();   

    //REF:- finalize-- https://rxjs.dev/api/operators/finalize 
    return next.handle(request).pipe(
      finalize(() => this.utilSer.hide()) 
    );
  }
}
