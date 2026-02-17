import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {


  vehicleData = [
    {
      status: "Moving",
      vehicle: {
        registrationNumber: "TN01AT9997",
        model: "Volvo",
        year: 2015,
      },
      currentLocation: {
        time: "11:22 AM",
        date: "Aug 12, 2024",
        address: "5640 Spring Garden Rd, Halifax, NS B3J 3M7, UK",
      },
      driverOverview: {
        name: "Alex Venus",
        avatar: "AV",
        registrationNumber: "TN01AT9997",
        tripId: "TR3232R",
      },
      tripInfo: {
        time: "11:22 AM",
        date: "Aug 12, 2024",
        startLocation: "Headlands Rd, 6PR, UK",
        endLocation: "Swalesmoor Farm, Swalesmoor Road, Halifax, HX3 6UF",
      },
      driverInfo: {
        name: "Alex Venus",
        currentShiftStart: "Aug 12, 2024, 11:22 AM",
        status: "Intransit",
        currentJobs: 2,
        mobileNumber: "7849374624",
      },
      materialInfo: {
        materialName: "Processed meat",
        organization: "Newmans Abattoir",
        materialId: "M85973",
        category: "Processed meat and blood waste sample",
        netWeight: "750 kg",
        netVolume: "500 m³",
        grossWeight: "820 kg",
        grossVolume: "750 m³",
      },
      markers: {
        lat: 37.7749,  // San Francisco central coordinates
        lng: -122.4194,  // San Francisco central coordinates
          title: 'Marker 1',
          svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
<path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#39B54A"/>
<path d="M17.7394 11.9424L7.79384 6.96963C7.74104 6.94323 7.68344 6.99363 7.70024 7.04883L9.39224 11.4888C9.51704 11.82 9.51704 12.1848 9.39224 12.5136L7.70024 16.9536C7.68344 17.0088 7.74104 17.0592 7.79384 17.0328L17.7394 12.06C17.7874 12.036 17.7874 11.964 17.7394 11.94V11.9424Z" fill="white"/>
</svg>`,
        },
      
    },
    {
      status: "Moving",
      vehicle: {
        registrationNumber: "MH12BY7654",
        model: "Scania",
        year: 2020,
      },
      currentLocation: {
        time: "2:45 PM",
        date: "Aug 11, 2024",
        address: "123 King Street, Toronto, ON M5V 1E5, Canada",
      },
      driverOverview: {
        name: "John Doe",
        avatar: "JD",
        registrationNumber: "MH12BY7654",
        tripId: "TR4343R",
      },
      tripInfo: {
        time: "2:45 PM",
        date: "Aug 11, 2024",
        startLocation: "Queen's Park, Toronto, ON, Canada",
        endLocation: "Union Station, Toronto, ON, Canada",
      },
      driverInfo: {
        name: "John Doe",
        currentShiftStart: "Aug 11, 2024, 10:00 AM",
        status: "Intransit",
        currentJobs: 3,
        mobileNumber: "9876543210",
      },
      materialInfo: {
        materialName: "Frozen fish",
        organization: "Ocean's Fresh",
        materialId: "F12345",
        category: "Frozen seafood",
        netWeight: "500 kg",
        netVolume: "300 m³",
        grossWeight: "550 kg",
        grossVolume: "350 m³",
      },
      markers: {
        lat: 37.7885,  // Slightly different latitude near San Francisco
        lng: -122.3996,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
          <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#39B54A"/>
          <path d="M17.7394 11.9424L7.79384 6.96963C7.74104 6.94323 7.68344 6.99363 7.70024 7.04883L9.39224 11.4888C9.51704 11.82 9.51704 12.1848 9.39224 12.5136L7.70024 16.9536C7.68344 17.0088 7.74104 17.0592 7.79384 17.0328L17.7394 12.06C17.7874 12.036 17.7874 11.964 17.7394 11.94V11.9424Z" fill="white"/>
          </svg>`,
        },
      
    },
    {
      status: "Stopped",
      vehicle: {
        registrationNumber: "KA05MN3456",
        model: "Mercedes",
        year: 2018,
      },
      currentLocation: {
        time: "4:30 PM",
        date: "Aug 10, 2024",
        address: "456 Market St, Bangalore, KA 560001, India",
      },
      driverOverview: {
        name: "Jane Smith",
        avatar: "JS",
        registrationNumber: "KA05MN3456",
        tripId: "TR5454R",
      },
      tripInfo: {
        time: "4:30 PM",
        date: "Aug 10, 2024",
        startLocation: "Indiranagar, Bangalore, India",
        endLocation: "Whitefield, Bangalore, India",
      },
      driverInfo: {
        name: "Jane Smith",
        currentShiftStart: "Aug 10, 2024, 8:00 AM",
        status: "Stopped",
        currentJobs: 1,
        mobileNumber: "9876541234",
      },
      materialInfo: {
        materialName: "Electronics",
        organization: "Tech World",
        materialId: "E98765",
        category: "Consumer electronics",
        netWeight: "1200 kg",
        netVolume: "800 m³",
        grossWeight: "1300 kg",
        grossVolume: "850 m³",
      },
      markers: {
        lat: 37.8000,  // Another slightly different latitude near San Francisco
        lng: -122.4180,  // Another slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#F1F2F2"/>
<path d="M14.0006 27.2274C21.3058 27.2274 27.2278 21.3053 27.2278 14.0001C27.2278 6.69497 21.3058 0.772949 14.0006 0.772949C6.69546 0.772949 0.773438 6.69497 0.773438 14.0001C0.773438 21.3053 6.69546 27.2274 14.0006 27.2274Z" fill="#ED1C24"/>
<path d="M18.8996 9.1001H9.09961V18.9001H18.8996V9.1001Z" fill="white"/>
</svg>

          `,
        },
    },
    {
      status: "Idling",
      vehicle: {
        registrationNumber: "DL03RT7890",
        model: "Tata",
        year: 2016,
      },
      currentLocation: {
        time: "9:15 AM",
        date: "Aug 13, 2024",
        address: "789 Freedom Blvd, New Delhi, DL 110001, India",
      },
      driverOverview: {
        name: "Robert Brown",
        avatar: "RB",
        registrationNumber: "DL03RT7890",
        tripId: "TR6565R",
      },
      tripInfo: {
        time: "9:15 AM",
        date: "Aug 13, 2024",
        startLocation: "Connaught Place, New Delhi, India",
        endLocation: "Chandni Chowk, New Delhi, India",
      },
      driverInfo: {
        name: "Robert Brown",
        currentShiftStart: "Aug 13, 2024, 7:00 AM",
        status: "Idling",
        currentJobs: 0,
        mobileNumber: "9101234567",
      },
      materialInfo: {
        materialName: "Cement",
        organization: "BuildWell Co.",
        materialId: "C45678",
        category: "Construction materials",
        netWeight: "3000 kg",
        netVolume: "2000 m³",
        grossWeight: "3200 kg",
        grossVolume: "2100 m³",
      },
      markers: {
        lat: 37.7520,  // Yet another latitude near San Francisco
        lng: -122.4037,  // Yet another longitude near San Francisco
          title: 'Marker 2',
          svg: ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
<path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#FFC817"/>
<path d="M11.0698 7.7998H6.50977V16.1998H11.0698V7.7998Z" fill="white"/>
<path d="M17.5053 7.7998H12.9453V16.1998H17.5053V7.7998Z" fill="white"/>
</svg> `,
        },
    },
    {
      status: "Offline",
      vehicle: {
        registrationNumber: "AP09XY1234",
        model: "Ashok Leyland",
        year: 2019,
      },
      currentLocation: {
        time: "6:00 PM",
        date: "Aug 14, 2024",
        address: "101 Ocean Ave, Visakhapatnam, AP 530003, India",
      },
      driverOverview: {
        name: "Emily Clark",
        avatar: "EC",
        registrationNumber: "AP09XY1234",
        tripId: "TR7676R",
      },
      tripInfo: {
        time: "6:00 PM",
        date: "Aug 14, 2024",
        startLocation: "Gajuwaka, Visakhapatnam, India",
        endLocation: "Araku Valley, Visakhapatnam, India",
      },
      driverInfo: {
        name: "Emily Clark",
        currentShiftStart: "Aug 14, 2024, 3:00 PM",
        status: "Offline",
        currentJobs: 0,
        mobileNumber: "8123456789",
      },
      materialInfo: {
        materialName: "Fresh produce",
        organization: "Farm Fresh",
        materialId: "P67890",
        category: "Perishable goods",
        netWeight: "1000 kg",
        netVolume: "700 m³",
        grossWeight: "1100 kg",
        grossVolume: "750 m³",
      },
      markers: {
        lat: 37.7841,  // Slightly different latitude near San Francisco
        lng: -122.3954,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#F1F2F2"/>
<path d="M14.0006 27.2274C21.3058 27.2274 27.2278 21.3053 27.2278 14.0001C27.2278 6.69497 21.3058 0.772949 14.0006 0.772949C6.69546 0.772949 0.773438 6.69497 0.773438 14.0001C0.773438 21.3053 6.69546 27.2274 14.0006 27.2274Z" fill="#64748B"/>
<path d="M13.5859 13.1008C14.7298 12.7488 15.2284 13.394 14.8178 14.274" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M7.48438 7L20.9764 20.492" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M18.9531 8.87695C21.5929 11.8393 21.5929 15.1243 19.4517 18.116" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M9.53711 18.6147C7.54264 16.5909 6.9267 14.0392 7.83594 11.6048" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M17.2218 10.7478C17.0399 10.538 16.7223 10.5153 16.5125 10.6972C16.3026 10.8791 16.28 11.1966 16.4618 11.4065L17.2218 10.7478ZM16.4618 11.4065C17.1687 12.2221 17.4603 12.9686 17.4907 13.6406C17.5212 14.3142 17.2922 14.9774 16.8393 15.63L17.6655 16.2033C18.2099 15.4188 18.5382 14.5421 18.4953 13.5952C18.4524 12.6467 18.0401 11.692 17.2218 10.7478L16.4618 11.4065Z" fill="white"/>
<path d="M11.7969 16.5327C10.8583 15.9461 10.6237 14.9489 10.5357 14.0983" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
</svg>`,
        },
    },
    {
      status: "Moving",
      vehicle: {
        registrationNumber: "RJ14CV5678",
        model: "Volvo FH",
        year: 2021,
      },
      currentLocation: {
        time: "3:30 PM",
        date: "Aug 15, 2024",
        address: "Jaipur Railway Station, Jaipur, RJ 302006, India",
      },
      driverOverview: {
        name: "Arjun Mehta",
        avatar: "AM",
        registrationNumber: "RJ14CV5678",
        tripId: "TR8787R",
      },
      tripInfo: {
        time: "3:30 PM",
        date: "Aug 15, 2024",
        startLocation: "Amer Fort, Jaipur, India",
        endLocation: "Hawa Mahal, Jaipur, India",
      },
      driverInfo: {
        name: "Arjun Mehta",
        currentShiftStart: "Aug 15, 2024, 10:00 AM",
        status: "Intransit",
        currentJobs: 2,
        mobileNumber: "9012345678",
      },
      materialInfo: {
        materialName: "Textiles",
        organization: "Royal Fabrics",
        materialId: "T12345",
        category: "Fabric materials",
        netWeight: "600 kg",
        netVolume: "400 m³",
        grossWeight: "650 kg",
        grossVolume: "450 m³",
      },
      markers: {
        lat: 37.7625,  // Slightly different latitude near San Francisco
        lng: -122.4392,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
          <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#39B54A"/>
          <path d="M17.7394 11.9424L7.79384 6.96963C7.74104 6.94323 7.68344 6.99363 7.70024 7.04883L9.39224 11.4888C9.51704 11.82 9.51704 12.1848 9.39224 12.5136L7.70024 16.9536C7.68344 17.0088 7.74104 17.0592 7.79384 17.0328L17.7394 12.06C17.7874 12.036 17.7874 11.964 17.7394 11.94V11.9424Z" fill="white"/>
          </svg>`,
        },
    },
    {
      status: "Idling",
      vehicle: {
        registrationNumber: "WB06KL7890",
        model: "Mahindra Blazo",
        year: 2017,
      },
      currentLocation: {
        time: "5:15 PM",
        date: "Aug 15, 2024",
        address: "Howrah Bridge, Kolkata, WB 700001, India",
      },
      driverOverview: {
        name: "Sunil Roy",
        avatar: "SR",
        registrationNumber: "WB06KL7890",
        tripId: "TR9898R",
      },
      tripInfo: {
        time: "5:15 PM",
        date: "Aug 15, 2024",
        startLocation: "Salt Lake, Kolkata, India",
        endLocation: "Park Street, Kolkata, India",
      },
      driverInfo: {
        name: "Sunil Roy",
        currentShiftStart: "Aug 15, 2024, 8:00 AM",
        status: "Idling",
        currentJobs: 1,
        mobileNumber: "9098765432",
      },
      materialInfo: {
        materialName: "Industrial chemicals",
        organization: "Bengal Chemicals",
        materialId: "IC23456",
        category: "Chemical materials",
        netWeight: "2000 kg",
        netVolume: "1500 m³",
        grossWeight: "2100 kg",
        grossVolume: "1600 m³",
      },
      markers: {
        lat: 37.7952,  // Slightly different latitude near San Francisco
        lng: -122.4147,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: ` <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F1F2F2"/>
          <path d="M12.0017 23.3378C18.2633 23.3378 23.3393 18.2618 23.3393 12.0002C23.3393 5.73861 18.2633 0.662598 12.0017 0.662598C5.74008 0.662598 0.664062 5.73861 0.664062 12.0002C0.664062 18.2618 5.74008 23.3378 12.0017 23.3378Z" fill="#FFC817"/>
          <path d="M11.0698 7.7998H6.50977V16.1998H11.0698V7.7998Z" fill="white"/>
          <path d="M17.5053 7.7998H12.9453V16.1998H17.5053V7.7998Z" fill="white"/>
          </svg> `,
        },
    },
    {
      status: "Offline",
      vehicle: {
        registrationNumber: "UP32XZ1234",
        model: "Ashok Leyland Dost",
        year: 2014,
      },
      currentLocation: {
        time: "12:00 PM",
        date: "Aug 14, 2024",
        address: "Hazratganj, Lucknow, UP 226001, India",
      },
      driverOverview: {
        name: "Vikas Sharma",
        avatar: "VS",
        registrationNumber: "UP32XZ1234",
        tripId: "TR5656R",
      },
      tripInfo: {
        time: "12:00 PM",
        date: "Aug 14, 2024",
        startLocation: "Charbagh, Lucknow, India",
        endLocation: "Aliganj, Lucknow, India",
      },
      driverInfo: {
        name: "Vikas Sharma",
        currentShiftStart: "Aug 14, 2024, 6:00 AM",
        status: "Offline",
        currentJobs: 0,
        mobileNumber: "8543217890",
      },
      materialInfo: {
        materialName: "Dairy products",
        organization: "Lucknow Dairy",
        materialId: "D54321",
        category: "Perishable goods",
        netWeight: "1200 kg",
        netVolume: "800 m³",
        grossWeight: "1300 kg",
        grossVolume: "850 m³",
      },
      markers: {
        lat: 37.7471,  // Slightly different latitude near San Francisco
        lng: -122.4129,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#F1F2F2"/>
<path d="M14.0006 27.2274C21.3058 27.2274 27.2278 21.3053 27.2278 14.0001C27.2278 6.69497 21.3058 0.772949 14.0006 0.772949C6.69546 0.772949 0.773438 6.69497 0.773438 14.0001C0.773438 21.3053 6.69546 27.2274 14.0006 27.2274Z" fill="#64748B"/>
<path d="M13.5859 13.1008C14.7298 12.7488 15.2284 13.394 14.8178 14.274" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M7.48438 7L20.9764 20.492" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M18.9531 8.87695C21.5929 11.8393 21.5929 15.1243 19.4517 18.116" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M9.53711 18.6147C7.54264 16.5909 6.9267 14.0392 7.83594 11.6048" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
<path d="M17.2218 10.7478C17.0399 10.538 16.7223 10.5153 16.5125 10.6972C16.3026 10.8791 16.28 11.1966 16.4618 11.4065L17.2218 10.7478ZM16.4618 11.4065C17.1687 12.2221 17.4603 12.9686 17.4907 13.6406C17.5212 14.3142 17.2922 14.9774 16.8393 15.63L17.6655 16.2033C18.2099 15.4188 18.5382 14.5421 18.4953 13.5952C18.4524 12.6467 18.0401 11.692 17.2218 10.7478L16.4618 11.4065Z" fill="white"/>
<path d="M11.7969 16.5327C10.8583 15.9461 10.6237 14.9489 10.5357 14.0983" stroke="white" stroke-width="1.00561" stroke-linecap="round"/>
</svg>
          `,
        },
    },
    {
      status: "Stopped",
      vehicle: {
        registrationNumber: "TN22AA6789",
        model: "BharatBenz",
        year: 2023,
      },
      currentLocation: {
        time: "9:45 AM",
        date: "Aug 16, 2024",
        address: "Marina Beach, Chennai, TN 600002, India",
      },
      driverOverview: {
        name: "Kumar Raj",
        avatar: "KR",
        registrationNumber: "TN22AA6789",
        tripId: "TR6767R",
      },
      tripInfo: {
        time: "9:45 AM",
        date: "Aug 16, 2024",
        startLocation: "Guindy, Chennai, India",
        endLocation: "T. Nagar, Chennai, India",
      },
      driverInfo: {
        name: "Kumar Raj",
        currentShiftStart: "Aug 16, 2024, 7:00 AM",
        status: "Stopped",
        currentJobs: 1,
        mobileNumber: "9345678901",
      },
      materialInfo: {
        materialName: "Furniture",
        organization: "WoodCraft Ltd.",
        materialId: "F98765",
        category: "Wooden products",
        netWeight: "3000 kg",
        netVolume: "2000 m³",
        grossWeight: "3200 kg",
        grossVolume: "2100 m³",
      },
      markers: {
        lat: 37.7865,  // Slightly different latitude near San Francisco
    lng: -122.4019,  // Slightly different longitude near San Francisco
          title: 'Marker 2',
          svg: `
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#F1F2F2"/>
<path d="M14.0006 27.2274C21.3058 27.2274 27.2278 21.3053 27.2278 14.0001C27.2278 6.69497 21.3058 0.772949 14.0006 0.772949C6.69546 0.772949 0.773438 6.69497 0.773438 14.0001C0.773438 21.3053 6.69546 27.2274 14.0006 27.2274Z" fill="#ED1C24"/>
<path d="M18.8996 9.1001H9.09961V18.9001H18.8996V9.1001Z" fill="white"/>
</svg>

          `,
        },
    }
  ];

  constructor() { }
}
