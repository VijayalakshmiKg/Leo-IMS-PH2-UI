import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfigService } from "src/app/app.config.service";
// import { AppConfigService } from "src/app/app.config.service";
// import { AppConfigService } from "../app.config.service";

@Injectable({
  providedIn:"root"
})
export class CustomHttpService {
  private baseUrl!: string;
  private httpOptions: any;
  private httpHeaders!: HttpHeaders;
  private _isLoaded: boolean = false;

  constructor(private http: HttpClient, private appConfig: AppConfigService, private router: Router) {
    this.getBaseUrl();
    this.baseUrl = this.appConfig.ApplicationConfig.ApiEndPoint;
    this.httpHeaders = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        //'DataBaseName': 'Global_Master',
        'offSet': new Date().getTimezoneOffset().toString()
      }
    );
  }
  async postfile(url: string, data?: any): Promise<any> {
    // this.getDbName(localStorage.getItem('DatabaseName'));
    return this.getBaseUrl().then
      (res => {
        this.baseUrl = this.appConfig.ApplicationConfig.ApiEndPoint;

        // Get the token and create headers with Authorization
        const jwtToken = localStorage.getItem('token');
        let fileHeaders = new HttpHeaders({
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
          'offSet': new Date().getTimezoneOffset().toString()
        });
        
        if (jwtToken) {
          fileHeaders = fileHeaders.set('Authorization', 'Bearer ' + jwtToken);
        }
        
        // Note: Don't set Content-Type for multipart/form-data - let the browser set it with boundary
        this.httpOptions = {
          headers: fileHeaders
        };
        
        return this.http.post(this.baseUrl + url, data, this.httpOptions).toPromise()
          .catch((err): any => { if (err.ErrorCode === 401) { 
            localStorage.clear();
            this.router.navigate(['login']); } else { return Promise.reject(err); } });
      }
      );
  }


  //get BaseUrl
  
  getBaseUrl(): Promise<any> {
    if (this._isLoaded) {
      return Promise.resolve((res: any) => true);
    }
    else {
      return this.http.get('assets/appsettings.json')
        .toPromise().then
        (
          res => {
            const configData = JSON.stringify(res);
            const appSettings = JSON.parse(configData);
            
            // Check if apiEndPoint is set to use relative URL
            if (appSettings.useRelativeApi === true) {
              // Get current browser URL and append '/api'
              const currentOrigin = window.location.origin;
              this.appConfig.ApplicationConfig.ApiEndPoint = `${currentOrigin}/api`;
            } else {
              // Use the configured endpoint from appsettings.json
              // You can also implement environment-specific logic here
              const hostname = window.location.hostname;
              
              if (hostname === 'localhost' || hostname === '127.0.0.1') {
                this.appConfig.ApplicationConfig.ApiEndPoint = appSettings.apiEndPoint; // localhost endpoint
              } else if (hostname.includes('uat') || hostname.includes('test')) {
                this.appConfig.ApplicationConfig.ApiEndPoint = appSettings.apiEndPoint2; // UAT endpoint
              } else {
                this.appConfig.ApplicationConfig.ApiEndPoint = appSettings.apiEndPoint1; // Production endpoint
              }
            }
            
            this._isLoaded = true;
          }
        );
    }
  }


  addUserToken(): void {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      // HttpHeaders is immutable, so we need to reassign the result of .set()
      this.httpHeaders = this.httpHeaders.set('Authorization', 'Bearer ' + jwtToken);
    }
  }


  async get(url: string, data?: any): Promise<any> {
    return this.getBaseUrl().then(res => {

      this.baseUrl = this.appConfig.ApplicationConfig.ApiEndPoint;
      this.httpOptions = {
        headers: this.httpHeaders
      };
      this.addUserToken();
      // //console.log(this.httpOptions.headers);
      
    //  //console.log(this.baseUrl + url, this.httpOptions);
      return this.http.get(this.baseUrl + url, this.httpOptions)
        .toPromise()
        .catch((err): any => {
          if (err.ErrorCode === 401) {
            this.router.navigate(['login']);
          }
          else {
            return Promise.reject(err);
          }
        }
        );
    }
    );
  }


  async post(url: string, data?: any): Promise<any> {

    return this.getBaseUrl().then
      (res => {
        this.baseUrl = this.appConfig.ApplicationConfig.ApiEndPoint;
        this.httpOptions = {
          headers: this.httpHeaders
        };
        this.addUserToken();
        return this.http.post(this.baseUrl + url, data, this.httpOptions)
          .toPromise()
          .catch((err): any => {
            if (err.ErrorCode === 401) {
              this.router.navigate(['login']);
            }
            else {
              return Promise.reject(err);
            }
          }
          );
      }
      );
  }




}
