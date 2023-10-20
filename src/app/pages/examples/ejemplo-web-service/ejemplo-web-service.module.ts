import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploWebServicePageRoutingModule } from './ejemplo-web-service-routing.module';

import { EjemploWebServicePage } from './ejemplo-web-service.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploWebServicePageRoutingModule,
    SharedModule
  ],
  declarations: [EjemploWebServicePage]
})
export class EjemploWebServicePageModule { }
