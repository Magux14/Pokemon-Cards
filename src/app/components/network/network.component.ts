import { Component, NgZone } from '@angular/core';
import { isPlatform } from '@ionic/angular';
import { networkObserver$ } from 'src/app/namespaces/network.namespace';

@Component({
  selector: 'network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent {

  public hasInternet: boolean = true;
  public isIOS: boolean = false;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private ngZone: NgZone
  ) {
    if (isPlatform('ios')) {
      this.isIOS = true;
    }
    this.hasInternet = networkObserver$.getValue();
    networkObserver$.subscribe((status: boolean) => {
      this.ngZone.run(() => {
        this.hasInternet = status;
      });
    });
  }

}
