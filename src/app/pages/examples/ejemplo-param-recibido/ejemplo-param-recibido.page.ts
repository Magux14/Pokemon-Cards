import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ejemplo-param-recibido',
  templateUrl: './ejemplo-param-recibido.page.html',
})
export class EjemploParamRecibidoPage implements OnInit {

  public data: any;

  //---------------------------------------------------------------------------------------------------------------------
  constructor(private route: ActivatedRoute) {
    if (this.route.snapshot.data['data']) {
      this.data = this.route.snapshot.data['data'];
      console.log(this.data)
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public ngOnInit() {
    return;
  }

}
