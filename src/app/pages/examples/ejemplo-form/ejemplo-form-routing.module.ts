import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploFormPage } from './ejemplo-form.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploFormPageRoutingModule {}
