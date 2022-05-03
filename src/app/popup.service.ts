import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  picSize="50px"
  constructor() { }
  makeCapitalPopup(data: {
    address:string,
    chief:string,
    city:string,
    fax:string,
    image:string,
    phone:string
  }): string {
    return `` +
      `<div style="display: flex;justify-content: flex-end">
<span style="align-self: center;">מפקד תחנה: ${data.chief}</span>
<img src="${data.image}" style="height: ${this.picSize};width: ${this.picSize}"></img>
        </div>` +
      `<div style="display: flex;justify-content: flex-end; margin-right: 51px">עיר: ${data.city}</div>` +
      `<div style="display: flex;justify-content: flex-end; margin-right: 51px">כתובת: ${data.address}</div>` +
      `<div style="display: flex;justify-content: flex-end; margin-right: 51px">טלפון: ${data.phone}</div>` +
      `<div *ngIf=${data.fax} style="display: flex;justify-content: flex-end; margin-right: 51px">פקס: ${data.fax}</div>`
  }
}
