import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export class ErrorMsg {
  public ErrorCode!: number;
  public Status!: string;
  public Message!: string;
  public error?: any; // Preserve original error body for validation errors
}
export class HttpErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(this.addToken(request))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errMsg = new ErrorMsg();
          
          // Preserve the original error body (important for validation errors)
          errMsg.error = error.error;
          errMsg.ErrorCode = error.status;
          errMsg.Status = error.statusText;
          
          // Client Side Error
          if (error.error) {
            // For validation errors, use the title if available
            errMsg.Message = error.error.title || error.error.message || `Error: ${error.message}`;
          } else {
            // Server Side Error
            errMsg.Message = error.message;
          }

          return throwError(errMsg);
        })
      );
  }

  addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

}
