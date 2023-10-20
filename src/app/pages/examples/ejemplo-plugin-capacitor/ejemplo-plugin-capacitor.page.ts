import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { where } from 'firebase/firestore';
import { FcmService } from 'src/app/services/fcm.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GenericWebResponseModel } from 'src/app/shared-models/generic-web-response.model';

@Component({
  selector: 'app-ejemplo-plugin-capacitor',
  templateUrl: './ejemplo-plugin-capacitor.page.html',
})
export class EjemploPluginCapacitorPage implements OnInit {

  constructor(
    private fcmService: FcmService,
    private firebaseService: FirebaseService
    ) {

  }

  public latLng: any;

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  async ngOnInit() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    this.latLng = {
      lat: coordinates.coords.latitude, lng: coordinates.coords.longitude
    }

    const resp: GenericWebResponseModel = await this.firebaseService.getCollectionDocuments('errores_codigo');
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public fcmTest() {
    this.fcmService.registerDevice();
  }

}
