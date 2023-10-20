import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EjemploPluginCapacitorPageRoutingModule } from './ejemplo-plugin-capacitor-routing.module';
import { EjemploPluginCapacitorPage } from './ejemplo-plugin-capacitor.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploPluginCapacitorPageRoutingModule,
    SharedModule
  ],
  declarations: [EjemploPluginCapacitorPage]
})
export class EjemploPluginCapacitorPageModule { }
