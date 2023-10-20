import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploParamsPageRoutingModule } from './ejemplo-params-routing.module';

import { EjemploParamsPage } from './ejemplo-params.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploParamsPageRoutingModule,
    SharedModule
  ],
  declarations: [EjemploParamsPage]
})
export class EjemploParamsPageModule { }
