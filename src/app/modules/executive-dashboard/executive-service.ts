import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class ExecutiveService {

  executiveDashboardCount:any = {
    "totalDrivers": 0,
    "totalTrucks": 0,
    "totalTrailers": 0,
    "totalOrders": 0,
    "totalProducts": 0
  }


}