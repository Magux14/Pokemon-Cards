import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploPluginCapacitorPage } from './ejemplo-plugin-capacitor.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploPluginCapacitorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploPluginCapacitorPageRoutingModule {}
