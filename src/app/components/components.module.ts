import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomHeaderComponent } from './custom-header/custom-header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppVersionComponent } from './app-version/app-version.component';
import { NetworkComponent } from './network/network.component';
import { WavesComponent } from './waves/waves.component';
import { ItemCardComponent } from './item-card/item-card.component';

@NgModule({
  declarations: [
    CustomHeaderComponent,
    AppVersionComponent,
    NetworkComponent,
    WavesComponent,
    ItemCardComponent
  ],
  exports: [
    CustomHeaderComponent,
    AppVersionComponent,
    NetworkComponent,
    WavesComponent,
    ItemCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }