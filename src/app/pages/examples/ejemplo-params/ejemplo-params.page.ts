import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataParamService } from 'src/app/services/params/data-param.service';

@Component({
  selector: 'app-ejemplo-params',
  templateUrl: './ejemplo-params.page.html',
})
export class EjemploParamsPage implements OnInit {

  //---------------------------------------------------------------------------------------------------------------------
  constructor(
    private navCtrl: NavController,
    private dataParamService: DataParamService
  ) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit() {
    return;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public irDetalle() {
    let obj = {
      name: 'Gabriela Mitre',
      age: 28,
      hobbies: ['dancing', 'swimming']
    }

    // Set an id to this param, in this case is: 'data'.
    this.dataParamService.setData('data', obj);

    // Go to destination page with: Destination page + '/id'
    this.navCtrl.navigateForward('ejemplo-param-recibido/data');
  }

}
