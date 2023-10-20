import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmbebedGenericPageRoutingModule } from './embebed-generic-routing.module';
import { EmbebedGenericPage } from './embebed-generic.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmbebedGenericPageRoutingModule,
    SharedModule
  ],
  declarations: [EmbebedGenericPage]
})
export class EmbebedGenericPageModule {}
