import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EjemploTranslatePageRoutingModule } from './ejemplo-translate-routing.module';
import { EjemploTranslatePage } from './ejemplo-translate.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EjemploTranslatePageRoutingModule,
    SharedModule
  ],
  declarations: [EjemploTranslatePage]
})
export class EjemploTranslatePageModule { }
