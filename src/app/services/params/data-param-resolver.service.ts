import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { DataParamService } from './data-param.service';

@Injectable({
  providedIn: 'root'
})
export class DataParamResolverService implements Resolve<any> {

  //-------------------------------------------------------------------------------------------------------------------
  constructor(private dataService: DataParamService) { }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /*
    // Get data sended from an Id.
    // this works adding this lines into app-routing.module:
  
    {
      path: 'receive-parameters/:id',
      // this resolve shit.
      resolve: {
        data: DataParamResolverService
      },
      loadChildren: './pages/receive-parameters/receive-parameters.module#ReceiveParametersPageModule'
    },
  
    // In the destination page add this:
  
      public data: any;
      constructor(private route: ActivatedRoute) {}
  
       ngOnInit() {
          if (this.route.snapshot.data['data']) {
            this.data = this.route.snapshot.data['data'];
          }
        }
  */
  public resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');
    return this.dataService.getData(id);
  }

}
