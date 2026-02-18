import { Component, OnInit } from '@angular/core';
// import { Loader } from '@googlemaps/js-api-loader';
import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-tracking-home',
  templateUrl: './tracking-home.component.html',
  styleUrls: ['./tracking-home.component.css']
})
export class TrackingHomeComponent implements OnInit {

  // private map!: google.maps.Map; // TODO: Uncomment when Google Maps is properly configured

  showStatusBar: Boolean = true
  showFlagSheet: Boolean = false
  showTransionDetails: Boolean = false
  selectedValue: any | String = 'All'

  trackingList:any | any[]= []
  tripDetails:any 

  constructor(public trackServ:TrackingService) {
    this.getTrackingVehiclesByStatus()
   }

  ngOnInit(): void {

  }

  statusBarFlag() {
    this.showStatusBar = !this.showStatusBar
  }

  flagSheetFlag() {
    this.showFlagSheet = !this.showFlagSheet
  }

  onSelectionChange(value: string) {
    //console.log('Selected value:', value);
    this.selectedValue = value;
    this.getTrackingVehiclesByStatus(value)
  }

  showDetails(data:any) {
    //console.log(data);
    
    this.showTransionDetails = true

    this.tripDetails = data
  }

  showHideDetails(){
    this.showTransionDetails = !this.showTransionDetails
  }


  getTrackingVehiclesByStatus(status?: any | string) {
    //console.log('Filter status:', status);
  
    this.trackingList = this.trackServ.vehicleData.filter((res: any) => {
      if (!status || status == 'All') {
        return true;
      }
      return res?.status?.trim().toLowerCase() === status?.trim().toLowerCase();
    });
  
    //console.log('Filtered list:', this.trackingList);

    // TODO: Uncomment when Google Maps types are properly configured
    /*
    const loader = new Loader({
      apiKey: '', // Replace with your actual API key
      version: 'weekly',
    });

    loader.load().then(() => {
      const mapContainer = document.getElementById('map') as HTMLElement;

      // Map configuration
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 37.7999, lng: -122.4194 }, // Centered at San Francisco
        zoom: 13,
      };

      this.map = new google.maps.Map(mapContainer, mapOptions);

      // Array of marker locations with different SVGs
//       const markerLocations = [
//         {
//           lat: 37.7749,
//           lng: -122.4194,
//           title: 'Marker 1',
//           svg: `
//             <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
//               <circle cx="14" cy="14" r="14" fill="#F1F2F2"/>
//               <circle cx="14" cy="14" r="13.5" fill="#ED1C24"/>
//               <rect x="9.1" y="9.1" width="9.8" height="9.8" fill="white"/>
//             </svg>
//           `,
//         },
//         {
//           lat: 37.7849,
//           lng: -122.4094,
//           title: 'Marker 2',
//           svg: `
//            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
// <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#FFC817"/>
// <path d="M11.0698 7.7998H6.50977V16.1998H11.0698V7.7998Z" fill="white"/>
// <path d="M17.5053 7.7998H12.9453V16.1998H17.5053V7.7998Z" fill="white"/>
// </svg>
//           `,
//         },
//         {
//           lat: 37.7649,
//           lng: -122.4294,
//           title: 'Marker 3',
//           svg: `
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
// <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#39B54A"/>
// <path d="M17.7394 11.9424L7.79384 6.96963C7.74104 6.94323 7.68344 6.99363 7.70024 7.04883L9.39224 11.4888C9.51704 11.82 9.51704 12.1848 9.39224 12.5136L7.70024 16.9536C7.68344 17.0088 7.74104 17.0592 7.79384 17.0328L17.7394 12.06C17.7874 12.036 17.7874 11.964 17.7394 11.94V11.9424Z" fill="white"/>
// </svg>
//           `,
//         },
//         {
//           lat: 37.7649,
//           lng: -122.4894,
//           title: 'Marker 3',
//           svg: `
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
// <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#FFC817"/>
// <path d="M11.0698 7.7998H6.50977V16.1998H11.0698V7.7998Z" fill="white"/>
// <path d="M17.5053 7.7998H12.9453V16.1998H17.5053V7.7998Z" fill="white"/>
// </svg>
//           `,
//         },
//       ];

      // Loop through locations and add markers with their specific SVG
      this.trackingList.forEach((location:any) => {
        //console.log(location.markers);
        
        new google.maps.Marker({
          position: { lat: location.markers.lat, lng: location.markers.lng },
          map: this.map,
          title: location.markers.title,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(location.markers.svg)}`, // Convert SVG to data URL
            scaledSize: new google.maps.Size(28, 28), // Match the SVG size
            anchor: new google.maps.Point(14, 14), // Center the marker on its location
          },
        });
      });
    });
    */
  }

}
