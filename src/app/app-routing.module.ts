import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataParamResolverService } from './services/params/data-param-resolver.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/examples/ejemplo-web-service/ejemplo-web-service.module').then(m => m.EjemploWebServicePageModule)
    // loadChildren: () => import('./pages/ejemplo-params/ejemplo-params.module').then(m => m.EjemploParamsPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'ejemplo-params',
    loadChildren: () => import('./pages/examples/ejemplo-params/ejemplo-params.module').then(m => m.EjemploParamsPageModule)
  },
  {
    path: 'embebed-generic',
    loadChildren: () => import('./pages/embebed-generic/embebed-generic.module').then(m => m.EmbebedGenericPageModule)
  },
  {
    path: 'ejemplo-web-service',
    loadChildren: () => import('./pages/examples/ejemplo-web-service/ejemplo-web-service.module').then(m => m.EjemploWebServicePageModule)
  },
  {
    path: 'ejemplo-param-recibido/:id',
    resolve: {
      data: DataParamResolverService
    },
    loadChildren: () => import('./pages/examples/ejemplo-param-recibido/ejemplo-param-recibido.module').then(m => m.EjemploParamRecibidoPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
