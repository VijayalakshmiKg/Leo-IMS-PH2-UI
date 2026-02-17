import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfigModel } from './core/model/AppConfigModel';

/**
  Service used to read app configuration settings from Environment files
*/

@Injectable({
  providedIn: 'root',
})

export class AppConfigService {
  
  
  public ApplicationConfig: AppConfigModel = new AppConfigModel();

  public sideNavState: Subject<boolean> = new Subject(); //Dont remove its for title show...


  constructor() {}


}

