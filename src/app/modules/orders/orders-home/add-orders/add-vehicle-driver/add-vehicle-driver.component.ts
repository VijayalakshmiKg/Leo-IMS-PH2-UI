import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriversService } from 'src/app/modules/drivers/drivers.service';
import { TrailerService } from 'src/app/modules/trailer/trailer.service';
import { VehicleService } from 'src/app/modules/vehicle/vehicle.service';
import { OrdersService } from '../../../orders.service';

@Component({
  selector: 'app-add-vehicle-driver',
  templateUrl: './add-vehicle-driver.component.html',
  styleUrls: ['./add-vehicle-driver.component.css']
})
export class AddVehicleDriverComponent implements OnInit {

  vechiclesSelected:any
  trailerSelected:any
  driverSelected:any
  vechiclesRecord:any
  trailerRecord:any
  driverRecord:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public vehiServ:VehicleService,public triServ:TrailerService,public driServ:DriversService ,public dialog  : MatDialogRef<AddVehicleDriverComponent>,public OrderServ:OrdersService ) {
    // this.drivers = driServ.driversList
    // this.vehicles = vehiServ.VehiclesList
    // this.trailers = triServ.TrailersList
    // //console.log(this.drivers);
    // //console.log(this.vehicles);
    // //console.log(this.trailers);
    //console.log(data);
    if(data){
      this.vechiclesSelected = data.vechile.truckID
      this.driverSelected = data.driver.driverID
      this.trailerSelected = data.trailer.trailerID
      this.vechiclesRecord = data.vechile
      this.driverRecord = data.driver
      this.trailerRecord = data.trailer
    }
   }

  ngOnInit(): void {
    this.getTrailerBySearch({value:''})
    this.getTrucksBySearch({value:''})
    this.getDriversBySearch({value:''})
  }

  searchVehicle: string = '';
  searchTrailer: string = '';
  searchDriver: string = '';

  vehicles:any | any[] = [

  ];

  trailers:any | any[] = [

  ];

  drivers:any | any[] = [

  ];

  close(){
    this.dialog.close({driver:this.driverRecord,vehicle:this.vechiclesRecord,trailer:this.trailerRecord})
  }

  getTrailerBySearch(searchKey:any){
    //console.log(searchKey.value);
    
    this.OrderServ.getTrailersBySearch(searchKey).then(res => {
      //console.log(res);
    if(res){
      this.trailers = res
    }
    })
  }
  getDriversBySearch(searchKey:any){
    
    this.OrderServ.getDriversBySearch(searchKey).then(res => {
      //console.log(res);
    if(res){
      this.drivers = res
    }
    })
  }
  getTrucksBySearch(searchKey:any){
    //console.log(searchKey.value);
    this.OrderServ.getTrucksBySearch(searchKey).then(res => {
      //console.log(res);
    if(res){
      this.vehicles = res
    }
    })
  }


  closeC(){
    this.dialog.close()
  }

  selectVechicle(vechileID:any,record:any){
    if(record.availabilityStatus){
      this.vechiclesRecord = record
      this.vechiclesSelected = vechileID
    }
   
  }
  selectTrailer(trailerID:any,record:any){
    if(record.availabilityStatus){
      this.trailerRecord = record
      this.trailerSelected = trailerID
    }
   
  }
  selectDriver(driverID:any,record:any){
    if(record.availabilityStatus){
      this.driverRecord = record
      this.driverSelected = driverID
    }
  
  }

}
