import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountToZeroPage } from './count-to-zero.page';

const routes: Routes = [
  {
    path: '',
    component: CountToZeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountToZeroPageRoutingModule {}
