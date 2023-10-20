import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EjemploParamRecibidoPageRoutingModule } from './ejemplo-param-recibido-routing.module';

import { EjemploParamRecibidoPage } from './ejemplo-param-recibido.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploParamRecibidoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EjemploParamRecibidoPage]
})
export class EjemploParamRecibidoPageModule { }
