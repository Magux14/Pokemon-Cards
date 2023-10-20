import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataParamResolverService } from './services/params/data-param-resolver.service';
import { DataParamService } from './services/params/data-param.service';
import { UtilitiesService } from './services/utilities.service';
import { WebPersonalizedService } from './services/web-personalized.service';
import { WebRestService } from './services/web-rest.service';
import { WebSoapService } from './services/web-soap.service';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { FcmService } from './services/fcm.service';
import { ErrorHandlerService } from './services/error-handler.service';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export function newTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: newTranslateLoader,
        deps: [HttpClient]
      }
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UtilitiesService,
    DataParamService,
    ReactiveFormsModule,
    DataParamResolverService,
    WebRestService,
    WebSoapService,
    WebPersonalizedService,
    HTTP,
    Clipboard,
    FcmService,
    ErrorHandlerService,
    { provide: ErrorHandler, useClass: ErrorHandlerService }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
