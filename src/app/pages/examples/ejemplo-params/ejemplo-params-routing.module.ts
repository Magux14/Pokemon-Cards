import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploParamsPage } from './ejemplo-params.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploParamsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploParamsPageRoutingModule { }
