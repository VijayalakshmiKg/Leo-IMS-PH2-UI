import { Injectable } from '@angular/core';
import { CustomHttpService } from 'src/app/core/http/custom-http.service';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  constructor(
    private customHttpService: CustomHttpService
  ) {}

  // Get records list
  getRecordsList(params: any): Promise<any> {
    const url = `/WeighBridgeManager/GetWeighRecordsList`;
    return this.customHttpService.post(url, params);
  }

   getWeighBridgeRecordsByEmpId(employeeId : any) {
    return this.customHttpService.get('/WeighBridge/GetWeighbridgeRecordsByEmpId?employeeId=' + employeeId).then(res => res);
  }

  // Get weigh trailer details by task ID
  getWeighTrailerDetails(taskId: number) {
    return this.customHttpService.get('/WeighBridge/GetWeighTrailerDetailsByTaskId?taskId=' + taskId).then(res => res);
  }
  
  // Save weigh trailer data
  saveWeighTrailerData(model: any) {
    return this.customHttpService.post('/WeighBridge/SaveWeighTrailerData', model).then(res => res);
  }
 
}
