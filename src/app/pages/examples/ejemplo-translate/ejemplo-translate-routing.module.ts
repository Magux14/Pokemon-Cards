import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EjemploTranslatePage } from './ejemplo-translate.page';

const routes: Routes = [
  {
    path: '',
    component: EjemploTranslatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EjemploTranslatePageRoutingModule {}
