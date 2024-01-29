import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountToZeroPageRoutingModule } from './count-to-zero-routing.module';

import { CountToZeroPage } from './count-to-zero.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountToZeroPageRoutingModule
  ],
  declarations: [CountToZeroPage]
})
export class CountToZeroPageModule {}
