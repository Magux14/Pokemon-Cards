import { Component, Input } from '@angular/core';
import { FIREBASE_LOG } from 'src/app/constants';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-version',
  templateUrl: './app-version.component.html',
})
export class AppVersionComponent {

  @Input() color: string;
  public version: string;
  public dev: boolean = !environment.production;
  public firebaseLog: boolean = FIREBASE_LOG && !environment.production;

  constructor(
    private utilitiesService: UtilitiesService
  ) {
    this.utilitiesService.getAppInfoAsync().then(app => {
      this.version = app.version;
    })
  }

}
