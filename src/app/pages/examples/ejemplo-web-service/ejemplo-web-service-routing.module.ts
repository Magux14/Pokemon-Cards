import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploWebServicePage } from './ejemplo-web-service.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploWebServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploWebServicePageRoutingModule { }
