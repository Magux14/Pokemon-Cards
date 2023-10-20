import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EjemploFormPageRoutingModule } from './ejemplo-form-routing.module';
import { EjemploFormPage } from './ejemplo-form.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploFormPageRoutingModule,
    SharedModule
  ],
  declarations: [EjemploFormPage]
})
export class EjemploFormPageModule { }
