import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Clase exclusiva para parsar parámetros
export class DataParamService {

  private data = [];

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /*
    // Set data from sender page, Usage example:

    // declare object.
    public obj = {
      name: 'Gabriela Mitre',
      age: 28,
      hobbies: ['dancing', 'swimming']
    }

    // Set an id to this param, in this case is: 'user_details'.
    this.dataParamService.setData('user_details', this.obj);

    // Go to destination page with: Destination page + '/id'
    this.navCtrl.navigateForward('/receive-parameters/user_details');

  */
  public setData(id: string, data: any) {
    this.data[id] = data;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // To get data use: 'data-param-resolver.service'
  public getData(id) {
    return this.data[id];
  }

}
