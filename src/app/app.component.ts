import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BehaviorSubject } from 'rxjs';
import { ERROR_HANDLER } from './namespaces/error-handler.namespace';
import { networkObserver$ } from './namespaces/network.namespace';
import { ROUTE_LOG } from './namespaces/route-log.namespace';
import { AppRemoteControlService } from './services/app-remote-control-service';
import { ErrorHandlerService } from './services/error-handler.service';
import { FirebaseService } from './services/firebase.service';
import { SplashScreen } from '@capacitor/splash-screen';

export var errorObserver$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
export var webErrorObserver$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private http: HttpClient,
    private router: Router,
    private appRemoteControlService: AppRemoteControlService,
    public errorHandlerService: ErrorHandlerService,
    private firebaseService: FirebaseService
  ) {

    SplashScreen.show();
    
    this.platform.ready().then(() => {
      ROUTE_LOG.addRoute('App start');
      this.logCurrentRoute();
      // this.appRemoteControlService.validarVersion();
      // this.appRemoteControlService.listenerErrores();
      // this.firebaseService.listenerErrores();
      const idioma: string = this.translate.getBrowserLang();
      this.translate.resetLang(idioma);
      this.translate.currentLoader = new TranslateHttpLoader(this.http, './assets/i18n/', '.json');
      this.translate.reloadLang(idioma);
      this.translate.setDefaultLang(idioma === 'es' ? 'es' : 'en');
      setTimeout(() => {
        SplashScreen.hide({fadeOutDuration: 1_000});
      }, 1_000);
    });

    this.startNetworkListener();
    // Remove this if you want to keep them.
    ROUTE_LOG.cleanRoutes();
    ERROR_HANDLER.cleanErrors();

  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public startNetworkListener() {
    Network.addListener('networkStatusChange', (status) => {
      networkObserver$.next(status?.connected);
    });

    // Get the current network status
    Network.getStatus().then(status => {
      networkObserver$.next(status?.connected);
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private logCurrentRoute() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        const url: string = val.url;
        ROUTE_LOG.addRoute(url);
      }
    });
  }


}