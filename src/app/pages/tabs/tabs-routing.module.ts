import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'ejemplo-translate',
        loadChildren: () => import('../examples/ejemplo-translate/ejemplo-translate.module').then(m => m.EjemploTranslatePageModule)
      },
      {
        path: 'ejemplo-plugin-capacitor',
        loadChildren: () => import('../examples/ejemplo-plugin-capacitor/ejemplo-plugin-capacitor.module').then(m => m.EjemploPluginCapacitorPageModule)
      },
      {
        path: 'ejemplo-form',
        loadChildren: () => import('../examples/ejemplo-form/ejemplo-form.module').then(m => m.EjemploFormPageModule)
      },
      {
        path: 'ejemplo-params',
        loadChildren: () => import('../examples/ejemplo-params/ejemplo-params.module').then(m => m.EjemploParamsPageModule)
      },
      {
        path: 'ejemplo-web-service',
        loadChildren: () => import('../examples/ejemplo-web-service/ejemplo-web-service.module').then(m => m.EjemploWebServicePageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/ejemplo-plugin-capacitor',
    pathMatch: 'full'
  },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
