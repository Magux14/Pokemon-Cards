import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploParamRecibidoPage } from './ejemplo-param-recibido.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploParamRecibidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploParamRecibidoPageRoutingModule {}
