import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilityService } from '../../services/utility.service';
// import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  
  isLoadingImg: Subject<boolean> = this.utilSer.isLoadingImg;

  constructor(private utilSer : UtilityService){} 
}
