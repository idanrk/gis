import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { PopupService } from './popup.service';
import {LatLngExpression} from "leaflet";
type feat = {
  features:{
    geometry: { coordinates:number[],type:string },
    properties:{
      address:string,
      chief:string,
      city:string,
      fax:string,
      image:string,
      phone:string
   }
   type:string
  }[]
}
@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = '/assets/data/data.geojson';
  data?: feat;
  constructor(private http: HttpClient, private popupService: PopupService) {}
  makeCircleMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res) => {
      console.log(res)
      const data = res as feat
      this.data = data;
      for (const c of data.features) {
        if (c) {
          if (!c.properties.phone || !c.properties.fax){
            continue;
          }
          const lon = c.geometry.coordinates[0];
          const lat = c.geometry.coordinates[1];
          const circle = L.circleMarker([lat, lon]);
          circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
          circle.addTo(map);
        }
      }
    });
  }
  showClosestStation(map: L.Map) {
      let min = 99999999;
      let place: LatLngExpression;
      navigator.geolocation.getCurrentPosition(position => {
          const currLon = position.coords.longitude
          const currLat = position.coords.latitude
          map.setView([currLat, currLon], 12);
          const myLocation = L.marker([currLat, currLon])
          .addTo(map)
          .bindTooltip("הנך נמצא/ת כאן")
          .openTooltip();
          this.data!.features.forEach(station=> {
              const lon = station.geometry.coordinates[0];
              const lat = station.geometry.coordinates[1];
              let dis= map.distance([lat, lon], [currLat, currLon]);
              if (min > dis) {
                  min = dis;
                  place = [lat, lon];
              }
          })
          map.on('click', function (e) {
              myLocation.unbindTooltip();
          });
          map.flyTo(place,12);
      })
  }
}
