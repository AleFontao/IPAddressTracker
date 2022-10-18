import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Ubicacion } from 'src/models/ubicacion';
import { UbicacionService } from 'src/services/ubicacion.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  map: any;
  constructor(private ubicacionService: UbicacionService) {

  }
  ubicacion: Ubicacion = {
    ipAddress: '',
    isp: '',
    location: '',
    timezone: ''
  };
  flag: boolean = false;
  ipFormControl = new FormControl('', [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]);


  ngOnInit(): void {
    this.map = L.map('map').setView([-33.461582765942882, -64.18693255105764], 15);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=ef5143ae-e4ce-4e69-bfd6-a919e28a71a6', {
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.ubicacionService.getIp().subscribe(result => {
      this.ipFormControl.setValue(result.ip);
      this.consultarIp();
    });
   
  }

  consultarIp() {
    this.ubicacionService.consultarIp(this.ipFormControl.value).subscribe(
      result => {
        this.ubicacion = {
          ipAddress: result.ip,
          isp: result.isp,
          location: result.location.region + ", " + result.location.country,
          timezone: result.location.timezone,
        }
        
        this.ubicacionService.getAddressFromAddress(result.location.region + "%20," + result.location.country).subscribe(data => {
          this.map.panTo(new L.LatLng(data.Results[0].latitude, data.Results[0].longitude), { animation: true });
          L.marker([data.Results[0].latitude, data.Results[0].longitude]).addTo(this.map)
            .bindPopup(result.location.region + ", " + result.location.country)
            .openPopup();
        }
        );
        this.flag = true;
      }
    );
  }

  getErrorMessage() {
    if (this.ipFormControl.hasError('required')) {
      return 'You must enter a value';
    }
    return this.ipFormControl.hasError('pattern') ? 'Not a valid ip' : '';
  }
}

